import { describe, expect, it } from "vitest";
import { createSiteQueries } from "@/core/application/site/site-queries";
import type { Article } from "@/core/domain/article/article";
import type { ContentPack } from "@/core/domain/content-pack/content-pack";
import { themeConfig } from "@/config/theme";
import { createFixtureRepositories } from "@/infrastructure/fixtures/fixture-repositories";
import { buildSitemap } from "@/lib/seo/sitemap";
import { getLlmsTxt, getRssXml, getSitemapPages } from "@/server/site/technical";
import { getSiteContext } from "@/server/site/site-context";
import { buildTestContext, buildTestEnv, buildTestQueries } from "../../fixtures/site";
import { buildTestPack } from "../../fixtures/content-pack";

const SITE_URL = "https://nusakarya.example";

function buildPackWithArticles(count: number): ContentPack {
  const pack = buildTestPack();
  const [template] = pack.articles;
  pack.articles = Array.from({ length: count }, (_, index): Article => {
    const day = String(28 - (index % 28)).padStart(2, "0");
    return {
      ...template,
      id: `article-${index}`,
      slug: `artikel-uji-${index}`,
      title: `Artikel Uji Nomor ${index}`,
      publishedAt: `2026-10-${day}T08:00:00.000Z`,
      updatedAt: `2026-10-${day}T09:00:00.000Z`,
    };
  });
  return pack;
}

function buildQueries(pack: ContentPack, enabledModules?: typeof themeConfig.enabledModules) {
  return createSiteQueries(createFixtureRepositories(pack), {
    ...themeConfig,
    ...(enabledModules ? { enabledModules } : {}),
  });
}

async function buildContext(enabledModules?: typeof themeConfig.enabledModules) {
  return buildTestContext(enabledModules ? { theme: { enabledModules } } : undefined);
}

describe("getSitemapPages", () => {
  it("lists every public route exactly once", async () => {
    const queries = buildTestQueries();
    const pages = await getSitemapPages(queries, await buildContext());
    const paths = pages.map((page) => page.path);

    expect(paths).toEqual([
      "/",
      "/tentang",
      "/kontak",
      "/privasi",
      "/syarat-ketentuan",
      "/kebijakan-editorial",
      "/layanan",
      "/layanan/pembuatan-website",
      "/layanan/desain-identitas-merek",
      "/portofolio",
      "/portofolio/website-toko-kopi-nusantara",
      "/portofolio/website-klinik-sehat-sentosa",
      "/artikel",
      "/artikel/cara-memilih-jasa-pembuatan-website",
      "/artikel/panduan-seo-website-perusahaan",
    ]);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("produces unique absolute urls through buildSitemap without /artikel/halaman/1", async () => {
    const pack = buildPackWithArticles(20);
    const pages = await getSitemapPages(buildQueries(pack), await buildContext());
    const urls = buildSitemap(SITE_URL, pages).map((entry) => entry.url);

    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.every((url) => url.startsWith(`${SITE_URL}/`))).toBe(true);
    expect(urls).toContain(`${SITE_URL}/artikel/halaman/2`);
    expect(urls).toContain(`${SITE_URL}/artikel/halaman/3`);
    expect(urls).not.toContain(`${SITE_URL}/artikel/halaman/1`);
    expect(urls).not.toContain(`${SITE_URL}/artikel/halaman/4`);
    expect(urls).toContain(`${SITE_URL}/artikel/artikel-uji-19`);
  });

  it("drops services, portfolio, and articles routes when their modules are off", async () => {
    const queries = buildTestQueries({ enabledModules: [] });
    const pages = await getSitemapPages(queries, await buildContext([]));
    const paths = pages.map((page) => page.path);

    expect(paths).toEqual(["/", "/tentang", "/kontak", "/privasi", "/syarat-ketentuan", "/kebijakan-editorial"]);
    expect(paths.some((path) => /^\/(layanan|portofolio|artikel)/.test(path))).toBe(false);
  });

  it("drops only the routes of the disabled module", async () => {
    const modules = ["services", "portfolio"] as typeof themeConfig.enabledModules;
    const pages = await getSitemapPages(buildTestQueries({ enabledModules: modules }), await buildContext(modules));
    const paths = pages.map((page) => page.path);

    expect(paths).toContain("/layanan");
    expect(paths).toContain("/portofolio");
    expect(paths.some((path) => path.startsWith("/artikel"))).toBe(false);
  });

  it("uses ISO last modified dates taken from the matching entities", async () => {
    const pack = buildTestPack();
    pack.settings.updatedAt = "2026-11-01T00:00:00.000Z";
    pack.home.updatedAt = "2026-11-03T00:00:00.000Z";
    pack.about.updatedAt = "2026-10-05T00:00:00.000Z";
    pack.legalPages[0].updatedAt = "2026-09-01T00:00:00.000Z";
    pack.services[0].updatedAt = "2026-08-01T00:00:00.000Z";
    pack.services[1].updatedAt = "2026-08-15T00:00:00.000Z";
    pack.portfolio[0].updatedAt = "2026-07-20T00:00:00.000Z";
    pack.portfolio[1].updatedAt = "2026-07-02T00:00:00.000Z";
    pack.articles[0].updatedAt = "2026-10-12T00:00:00.000Z";
    pack.articles[1].updatedAt = "2026-10-30T00:00:00.000Z";

    const queries = buildQueries(pack);
    const context = await getSiteContext(queries, buildTestEnv(), themeConfig);
    const pages = await getSitemapPages(queries, context);
    const lastModifiedOf = (path: string) => pages.find((page) => page.path === path)?.lastModified;

    expect(lastModifiedOf("/")).toBe("2026-11-03T00:00:00.000Z");
    expect(lastModifiedOf("/tentang")).toBe("2026-10-05T00:00:00.000Z");
    expect(lastModifiedOf("/kontak")).toBe("2026-11-01T00:00:00.000Z");
    expect(lastModifiedOf(`/${pack.legalPages[0].slug}`)).toBe("2026-09-01T00:00:00.000Z");
    expect(lastModifiedOf("/layanan")).toBe("2026-08-15T00:00:00.000Z");
    expect(lastModifiedOf(`/layanan/${pack.services[0].slug}`)).toBe("2026-08-01T00:00:00.000Z");
    expect(lastModifiedOf("/portofolio")).toBe("2026-07-20T00:00:00.000Z");
    expect(lastModifiedOf("/artikel")).toBe("2026-10-30T00:00:00.000Z");
    expect(lastModifiedOf(`/artikel/${pack.articles[0].slug}`)).toBe("2026-10-12T00:00:00.000Z");
    expect(pages.every((page) => new Date(page.lastModified).toISOString() === page.lastModified)).toBe(true);
  });

  it("derives each paginated page date from the articles on that page", async () => {
    const pack = buildPackWithArticles(12);
    const pages = await getSitemapPages(buildQueries(pack), await buildContext());
    const lastModifiedOf = (path: string) => pages.find((page) => page.path === path)?.lastModified;

    expect(lastModifiedOf("/artikel")).toBe("2026-10-28T09:00:00.000Z");
    expect(lastModifiedOf("/artikel/halaman/2")).toBe("2026-10-19T09:00:00.000Z");
  });
});

describe("getRssXml", () => {
  it("builds a feed with every article and its author", async () => {
    const xml = await getRssXml(buildTestQueries(), await buildContext());

    expect(xml).toContain("<rss version=\"2.0\"");
    expect(xml).toContain(`${SITE_URL}/artikel/cara-memilih-jasa-pembuatan-website`);
    expect(xml).toContain(`${SITE_URL}/artikel/panduan-seo-website-perusahaan`);
    expect(xml).toContain("<dc:creator>Rina Wulandari</dc:creator>");
  });

  it("escapes an ampersand and an angle bracket in a title", async () => {
    const pack = buildTestPack();
    pack.articles[0].title = "Desain & <Strategi> Merek";
    const xml = await getRssXml(buildQueries(pack), await buildContext());

    expect(xml).toContain("Desain &amp; &lt;Strategi&gt; Merek");
  });

  it("returns null when the articles module is off", async () => {
    const modules = ["services"] as typeof themeConfig.enabledModules;
    const xml = await getRssXml(buildTestQueries({ enabledModules: modules }), await buildContext(modules));

    expect(xml).toBeNull();
  });

  it("throws when an article author is missing from the team", async () => {
    const pack = buildTestPack();
    pack.articles[0].authorId = "team-missing";

    await expect(getRssXml(buildQueries(pack), await buildContext())).rejects.toThrow(Error);
  });
});

describe("getLlmsTxt", () => {
  it("lists the site, services, and articles with absolute links", async () => {
    const text = await getLlmsTxt(buildTestQueries(), await buildContext());

    expect(text.startsWith("# Nusa Karya\n")).toBe(true);
    expect(text).toContain(`${SITE_URL}/layanan/pembuatan-website`);
    expect(text).toContain(`${SITE_URL}/artikel/cara-memilih-jasa-pembuatan-website`);
    expect(text).toContain(`${SITE_URL}/kontak`);
  });

  it("leaves out services and articles when their modules are off", async () => {
    const text = await getLlmsTxt(buildTestQueries({ enabledModules: [] }), await buildContext([]));

    expect(text).toContain("# Nusa Karya");
    expect(text).not.toContain("Layanan");
    expect(text).not.toContain("/layanan");
    expect(text).not.toContain("/artikel");
  });
});
