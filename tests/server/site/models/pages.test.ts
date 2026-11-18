import { describe, expect, it } from "vitest";
import { getAboutPageModel } from "@/server/site/models/about";
import { getContactPageModel } from "@/server/site/models/contact";
import { getHomePageModel } from "@/server/site/models/home";
import { getLegalPageModel } from "@/server/site/models/legal";
import type { PageSeoResult } from "@/server/site/models/page-seo";
import type { ModuleKey } from "@/core/domain/shared/module-key";
import { buildLinkedBlocksQueries, buildTestContext } from "../../../fixtures/site";
import { buildTestQueries } from "../../../fixtures/site";

function jsonLdTypes(seo: PageSeoResult): unknown[] {
  return seo.jsonLd.map((entry) => entry["@type"]);
}

function expectSeoLimits(seo: PageSeoResult): void {
  const title = (seo.metadata.title as { absolute: string }).absolute;
  expect(title.length).toBeGreaterThanOrEqual(30);
  expect(title.length).toBeLessThanOrEqual(60);
  const description = seo.metadata.description as string;
  expect(description.length).toBeGreaterThanOrEqual(120);
  expect(description.length).toBeLessThanOrEqual(155);
}

describe("home page model", () => {
  it("assembles the home page with limits and no repeated site-wide json-ld", async () => {
    const queries = buildTestQueries();
    const context = await buildTestContext();
    const model = await getHomePageModel(queries, context);

    expectSeoLimits(model.seo);
    expect(model.seo.metadata.alternates?.canonical).toBe("https://nusakarya.example/");
    expect(model.seo.jsonLd).toEqual([]);
    expect(model.seo.breadcrumbs).toEqual([{ name: "Beranda", path: "/" }]);
    expect(model.hero.heroTitle).toBeTruthy();
    expect(model.services.length).toBeGreaterThan(0);
    expect(model.featuredPortfolio.length).toBeGreaterThan(0);
    expect(model.featuredPortfolio.length).toBeLessThanOrEqual(3);
    expect(model.latestArticles.length).toBeGreaterThan(0);
    expect(model.latestArticles.length).toBeLessThanOrEqual(3);
    expect(model.intros.services?.key).toBe("services");
  });

  it("orders latest articles from newest to oldest", async () => {
    const model = await getHomePageModel(buildTestQueries(), await buildTestContext());
    const dates = model.latestArticles.map((article) => article.publishedAt);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it("only includes content blocks declared by the theme", async () => {
    const theme = {
      contentBlocks: [
        { key: "how-we-work", label: "Cara kami bekerja", itemFields: ["title" as const], minItems: 1, maxItems: 6 },
      ],
    };
    const queries = buildTestQueries(theme);
    const context = await buildTestContext({ theme });
    const model = await getHomePageModel(queries, context);

    expect(Object.keys(model.blocks)).toEqual(["how-we-work"]);
    expect(model.blocks["how-we-work"]?.key).toBe("how-we-work");
  });

  it("returns no blocks when the theme declares none", async () => {
    const theme = { contentBlocks: [] };
    const model = await getHomePageModel(buildTestQueries(theme), await buildTestContext({ theme }));
    expect(model.blocks).toEqual({});
  });

  it("leaves module content empty when all modules are disabled", async () => {
    const theme = { enabledModules: [] };
    const model = await getHomePageModel(buildTestQueries(theme), await buildTestContext({ theme }));

    expect(model.services).toEqual([]);
    expect(model.featuredPortfolio).toEqual([]);
    expect(model.team).toEqual([]);
    expect(model.stats).toEqual([]);
    expect(model.testimonials).toEqual([]);
    expect(model.partners).toEqual([]);
    expect(model.latestArticles).toEqual([]);
    expect(model.vision).toBeNull();
    expect(model.intros.services).toBeUndefined();
    expect(model.hero.heroTitle).toBeTruthy();
  });
});

describe("about page model", () => {
  it("assembles the about page with a person json-ld per team member", async () => {
    const queries = buildTestQueries();
    const context = await buildTestContext();
    const model = await getAboutPageModel(queries, context);
    const team = await queries.listTeam();

    expectSeoLimits(model.seo);
    expect(model.seo.metadata.alternates?.canonical).toBe("https://nusakarya.example/tentang");
    expect(team.length).toBeGreaterThan(0);
    expect(jsonLdTypes(model.seo).filter((type) => type === "Person")).toHaveLength(team.length);
    expect(jsonLdTypes(model.seo)).toContain("BreadcrumbList");
    expect(model.team).toHaveLength(team.length);
    expect(model.seo.breadcrumbs).toEqual([
      { name: "Beranda", path: "/" },
      { name: "Tentang", path: "/tentang" },
    ]);
  });

  it("has no person json-ld when the team module is disabled", async () => {
    const theme = { enabledModules: [] };
    const model = await getAboutPageModel(buildTestQueries(theme), await buildTestContext({ theme }));
    expect(jsonLdTypes(model.seo)).toEqual(["BreadcrumbList"]);
    expect(model.team).toEqual([]);
    expect(model.vision).toBeNull();
  });
});

describe("contact page model", () => {
  it("assembles the contact page", async () => {
    const queries = buildTestQueries();
    const context = await buildTestContext();
    const model = await getContactPageModel(queries, context);

    expectSeoLimits(model.seo);
    expect(model.seo.metadata.alternates?.canonical).toBe("https://nusakarya.example/kontak");
    expect(model.intro.key).toBe("contact");
    expect(model.settings.siteName).toBe("Nusa Karya");
    expect(model.whatsappUrl).toBe(context.whatsappUrl);
    expect(model.isDemo).toBe(true);
    expect(jsonLdTypes(model.seo)).toEqual(["BreadcrumbList"]);
  });

  it("reports a non-demo environment", async () => {
    const context = await buildTestContext({ env: { isDemo: false } });
    const model = await getContactPageModel(buildTestQueries(), context);
    expect(model.isDemo).toBe(false);
  });

  it("throws when the contact intro is missing", async () => {
    const queries = { ...buildTestQueries(), getSectionIntro: async () => null };
    const context = await buildTestContext();
    await expect(getContactPageModel(queries, context)).rejects.toThrow(Error);
  });
});

describe("legal page model", () => {
  it.each(["privasi", "syarat-ketentuan", "kebijakan-editorial"])("assembles %s", async (slug) => {
    const model = await getLegalPageModel(buildTestQueries(), await buildTestContext(), slug);

    expect(model).not.toBeNull();
    expectSeoLimits(model!.seo);
    expect(model!.seo.metadata.alternates?.canonical).toBe(`https://nusakarya.example/${slug}`);
    expect(model!.page.slug).toBe(slug);
    expect(jsonLdTypes(model!.seo)).toEqual(["BreadcrumbList"]);
    expect(model!.seo.breadcrumbs).toEqual([
      { name: "Beranda", path: "/" },
      { name: model!.page.title, path: `/${slug}` },
    ]);
  });

  it("returns null for an unknown slug", async () => {
    expect(await getLegalPageModel(buildTestQueries(), await buildTestContext(), "privacy")).toBeNull();
  });

  it("still serves legal pages when all modules are disabled", async () => {
    const theme = { enabledModules: [] };
    const model = await getLegalPageModel(buildTestQueries(theme), await buildTestContext({ theme }), "privasi");
    expect(model).not.toBeNull();
  });
});

describe("home page model with links to disabled modules", () => {
  async function buildLinkedModel(enabledModules: ModuleKey[] | undefined) {
    const theme = enabledModules ? { enabledModules } : undefined;
    return getHomePageModel(buildLinkedBlocksQueries(theme), await buildTestContext({ theme }));
  }

  function bannerHrefs(model: Awaited<ReturnType<typeof buildLinkedModel>>): string[] {
    return (model.blocks["cta-banner"]?.items ?? []).flatMap((item) => (item.link ? [item.link.href] : []));
  }

  it("keeps every hero cta and banner link when all modules are enabled", async () => {
    const model = await buildLinkedModel(undefined);

    expect(model.hero.primaryCta?.href).toBe("/kontak");
    expect(model.hero.secondaryCta?.href).toBe("/portofolio");
    expect(bannerHrefs(model)).toEqual(["/layanan", "/portofolio", "/artikel", "/kontak"]);
    expect(model.blocks["how-we-work"]?.items.map((item) => item.link?.href)).toEqual(["/layanan", "/kontak"]);
  });

  it("drops the hero cta and banner links of every disabled module", async () => {
    const model = await buildLinkedModel([]);

    expect(model.hero.primaryCta).toEqual({ label: "Konsultasi Gratis", href: "/kontak" });
    expect(model.hero.secondaryCta).toBeNull();
    expect(bannerHrefs(model)).toEqual(["/kontak"]);
  });

  it("keeps the other items of a block and only nulls the link of an item with its own content", async () => {
    const model = await buildLinkedModel([]);
    const steps = model.blocks["how-we-work"]?.items ?? [];

    expect(steps.map((item) => item.title)).toEqual(["Diskusi", "Peluncuran"]);
    expect(steps.map((item) => item.link?.href ?? null)).toEqual([null, "/kontak"]);
    expect(model.blocks["why-choose-us"]?.items).toHaveLength(2);
    expect(model.blocks["home-faq"]?.items).toHaveLength(1);
  });

  it("only drops the links of the module that is disabled", async () => {
    const withoutServices = await buildLinkedModel(["portfolio", "articles"]);

    expect(withoutServices.hero.secondaryCta?.href).toBe("/portofolio");
    expect(bannerHrefs(withoutServices)).toEqual(["/portofolio", "/artikel", "/kontak"]);

    const withoutPortfolio = await buildLinkedModel(["services", "articles"]);

    expect(withoutPortfolio.hero.secondaryCta).toBeNull();
    expect(bannerHrefs(withoutPortfolio)).toEqual(["/layanan", "/artikel", "/kontak"]);
  });

  it("omits a block whose items all disappear", async () => {
    const queries = buildLinkedBlocksQueries({ enabledModules: [] });
    const banner = await queries.getContentBlock("cta-banner");
    const onlyGated = banner ? { ...banner, items: banner.items.filter((item) => item.link?.href !== "/kontak") } : null;
    const model = await getHomePageModel(
      { ...queries, getContentBlock: async (key: string) => (key === "cta-banner" ? onlyGated : queries.getContentBlock(key)) },
      await buildTestContext({ theme: { enabledModules: [] } }),
    );

    expect(onlyGated?.items.length).toBe(3);
    expect(model.blocks["cta-banner"]).toBeUndefined();
    expect(model.blocks["how-we-work"]).toBeDefined();
  });

  it("returns copies and leaves the shared query data untouched", async () => {
    const queries = buildLinkedBlocksQueries({ enabledModules: [] });
    const context = await buildTestContext({ theme: { enabledModules: [] } });
    const before = await queries.getHome();

    const model = await getHomePageModel(queries, context);
    const after = await queries.getHome();
    const banner = await queries.getContentBlock("cta-banner");

    expect(model.hero).not.toBe(before);
    expect(after.secondaryCta?.href).toBe("/portofolio");
    expect(banner?.items).toHaveLength(4);
    expect(model.blocks["cta-banner"]).not.toBe(banner);
  });
});
