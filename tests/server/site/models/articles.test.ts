import { describe, expect, it } from "vitest";
import { createSiteQueries, type SiteQueries } from "@/core/application/site/site-queries";
import type { Article } from "@/core/domain/article/article";
import type { ContentPack } from "@/core/domain/content-pack/content-pack";
import type { ThemeConfig } from "@/core/domain/theme/theme-config";
import { themeConfig } from "@/config/theme";
import { createFixtureRepositories } from "@/infrastructure/fixtures/fixture-repositories";
import {
  getArticleDetailModel,
  getArticlesIndexModel,
  listArticleSlugs,
} from "@/server/site/models/articles";
import type { PageSeoResult } from "@/server/site/models/page-seo";
import { buildTestContext } from "../../../fixtures/site";
import { buildTestPack } from "../../../fixtures/content-pack";

const SITE_URL = "https://nusakarya.example";

function buildPackWithArticles(count: number): ContentPack {
  const pack = buildTestPack();
  const [template] = pack.articles;
  pack.articles = Array.from({ length: count }, (_, index): Article => {
    const day = String(28 - index).padStart(2, "0");
    return {
      ...template,
      id: `article-${index}`,
      slug: `artikel-uji-${index}`,
      title: `Artikel Uji Nomor ${index}`,
      publishedAt: `2026-10-${day}T08:00:00.000Z`,
    };
  });
  return pack;
}

function buildQueriesFromPack(pack: ContentPack, theme?: Partial<ThemeConfig>): SiteQueries {
  return createSiteQueries(createFixtureRepositories(pack), { ...themeConfig, ...theme });
}

function fullTitle(seo: PageSeoResult): string {
  return (seo.metadata.title as { absolute: string }).absolute;
}

function jsonLdTypes(seo: PageSeoResult): unknown[] {
  return seo.jsonLd.map((entry) => entry["@type"]);
}

describe("getArticlesIndexModel", () => {
  it("paginates 10 articles into 2 pages", async () => {
    const queries = buildQueriesFromPack(buildPackWithArticles(10));
    const context = await buildTestContext();

    const first = await getArticlesIndexModel(queries, context, 1);
    const second = await getArticlesIndexModel(queries, context, 2);

    expect(first).not.toBeNull();
    expect(first!.pageCount).toBe(2);
    expect(first!.page).toBe(1);
    expect(first!.items).toHaveLength(9);
    expect(first!.items[0].article.slug).toBe("artikel-uji-0");
    expect(second!.page).toBe(2);
    expect(second!.pageCount).toBe(2);
    expect(second!.items).toHaveLength(1);
    expect(second!.items[0].article.slug).toBe("artikel-uji-9");
  });

  it("resolves the author of every card", async () => {
    const queries = buildQueriesFromPack(buildTestPack());
    const model = await getArticlesIndexModel(queries, await buildTestContext(), 1);

    expect(model!.items.map((item) => item.author.id)).toEqual(["team-rina", "team-bima"]);
    for (const item of model!.items) {
      expect(item.author).toEqual(await queries.getAuthor(item.article.authorId));
    }
  });

  it("resolves authors when the team module is disabled", async () => {
    const enabledModules = themeConfig.enabledModules.filter((key) => key !== "team");
    const queries = buildQueriesFromPack(buildTestPack(), { enabledModules });
    const context = await buildTestContext({ theme: { enabledModules } });

    expect(enabledModules).toContain("articles");
    expect(enabledModules).not.toContain("team");
    expect(await queries.listTeam()).toEqual([]);

    const model = await getArticlesIndexModel(queries, context, 1);
    expect(model!.items).toHaveLength(2);
    expect(model!.items[0].author.name).toBe("Rina Wulandari");
  });

  it("throws when an author is missing", async () => {
    const queries = { ...buildQueriesFromPack(buildTestPack()), getAuthor: async () => null };
    await expect(getArticlesIndexModel(queries, await buildTestContext(), 1)).rejects.toThrow(Error);
  });

  it("returns null for pages out of range or invalid", async () => {
    const queries = buildQueriesFromPack(buildPackWithArticles(10));
    const context = await buildTestContext();

    expect(await getArticlesIndexModel(queries, context, 3)).toBeNull();
    expect(await getArticlesIndexModel(queries, context, 0)).toBeNull();
    expect(await getArticlesIndexModel(queries, context, -1)).toBeNull();
    expect(await getArticlesIndexModel(queries, context, 1.5)).toBeNull();
    expect(await getArticlesIndexModel(queries, context, Number.NaN)).toBeNull();
  });

  it("serves an empty first page and rejects the second", async () => {
    const pack = buildTestPack();
    pack.articles = [];
    const queries = buildQueriesFromPack(pack);
    const context = await buildTestContext();

    const first = await getArticlesIndexModel(queries, context, 1);
    expect(first).not.toBeNull();
    expect(first!.items).toEqual([]);
    expect(first!.pageCount).toBe(1);
    expect(first!.pageHrefs).toEqual(["/artikel"]);
    expect(await getArticlesIndexModel(queries, context, 2)).toBeNull();
  });

  it("uses the articles intro and the index canonical and breadcrumbs for page 1", async () => {
    const queries = buildQueriesFromPack(buildTestPack());
    const model = await getArticlesIndexModel(queries, await buildTestContext(), 1);

    expect(model!.intro.key).toBe("articles");
    expect(model!.seo.metadata.alternates?.canonical).toBe(`${SITE_URL}/artikel`);
    expect(fullTitle(model!.seo)).toBe("Artikel Website dan SEO | Nusa Karya");
    expect(model!.seo.metadata.description).toBe(model!.intro.metaDescription);
    expect(model!.seo.breadcrumbs).toEqual([
      { name: "Beranda", path: "/" },
      { name: "Artikel", path: "/artikel" },
    ]);
    expect(jsonLdTypes(model!.seo)).toEqual(["BreadcrumbList"]);
  });

  it("uses a self-referencing canonical, title, and breadcrumbs for page 2", async () => {
    const queries = buildQueriesFromPack(buildPackWithArticles(10));
    const model = await getArticlesIndexModel(queries, await buildTestContext(), 2);

    expect(model!.seo.metadata.alternates?.canonical).toBe(`${SITE_URL}/artikel/halaman/2`);
    expect(fullTitle(model!.seo)).toBe("Artikel Website dan SEO - Halaman 2 | Nusa Karya");
    const description = String(model!.seo.metadata.description);
    expect(description.startsWith("Halaman 2: ")).toBe(true);
    expect(description.length).toBeLessThanOrEqual(155);
    expect(description).not.toBe(model!.intro.metaDescription);
    expect(model!.seo.breadcrumbs).toEqual([
      { name: "Beranda", path: "/" },
      { name: "Artikel", path: "/artikel" },
      { name: "Halaman 2", path: "/artikel/halaman/2" },
    ]);
    expect(jsonLdTypes(model!.seo)).toEqual(["BreadcrumbList"]);
  });

  it("keeps the page 2 title within 30-60 characters even for a 43 character intro title", async () => {
    const pack = buildPackWithArticles(10);
    const intro = pack.sectionIntros.find((entry) => entry.key === "articles")!;
    intro.metaTitle = "Artikel Seputar Website dan SEO untuk Usaha";
    expect(intro.metaTitle).toHaveLength(43);

    const model = await getArticlesIndexModel(buildQueriesFromPack(pack), await buildTestContext(), 2);
    const title = fullTitle(model!.seo);

    expect(title).toContain("Halaman 2");
    expect(title.length).toBeGreaterThanOrEqual(30);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(title).toBe("Artikel Seputar Website dan SEO - Halaman 2 | Nusa Karya");
  });

  it("keeps the page 1 title untouched even for a long intro title", async () => {
    const pack = buildPackWithArticles(10);
    const intro = pack.sectionIntros.find((entry) => entry.key === "articles")!;
    intro.metaTitle = "Artikel Seputar Website dan SEO untuk Usaha";

    const model = await getArticlesIndexModel(buildQueriesFromPack(pack), await buildTestContext(), 1);
    expect(fullTitle(model!.seo)).toBe("Artikel Seputar Website dan SEO untuk Usaha | Nusa Karya");
  });

  it("builds pageHrefs with one entry per page", async () => {
    const queries = buildQueriesFromPack(buildPackWithArticles(19));
    const model = await getArticlesIndexModel(queries, await buildTestContext(), 1);

    expect(model!.pageCount).toBe(3);
    expect(model!.pageHrefs).toEqual(["/artikel", "/artikel/halaman/2", "/artikel/halaman/3"]);
  });

  it("throws when the articles intro is missing", async () => {
    const queries = { ...buildQueriesFromPack(buildTestPack()), getSectionIntro: async () => null };
    await expect(getArticlesIndexModel(queries, await buildTestContext(), 1)).rejects.toThrow(Error);
  });

  it("returns null when the articles module is disabled", async () => {
    const theme = { enabledModules: [] };
    const queries = buildQueriesFromPack(buildTestPack(), theme);
    const context = await buildTestContext({ theme });

    expect(await getArticlesIndexModel(queries, context, 1)).toBeNull();
    expect(await getArticlesIndexModel(queries, context, 2)).toBeNull();
  });
});

describe("getArticleDetailModel", () => {
  it("assembles the article with its author, facts, and related articles", async () => {
    const queries = buildQueriesFromPack(buildTestPack());
    const [article] = await queries.listAllArticles();
    const model = await getArticleDetailModel(queries, await buildTestContext(), article.slug);

    expect(model).not.toBeNull();
    expect(model!.article.slug).toBe(article.slug);
    expect(model!.article.author.id).toBe("team-rina");
    expect(model!.authorFacts).toEqual({ completedProjects: null });
    expect(model!.related).toEqual(await queries.listRelatedArticles(article.slug));
    expect(model!.related.map((related) => related.slug)).not.toContain(article.slug);
  });

  it("fills the author facts from the completed_projects stat", async () => {
    const pack = buildTestPack();
    pack.stats = [...pack.stats, { key: "completed_projects", label: "Proyek selesai", value: 87, suffix: "+", sortOrder: 3 }];
    const queries = buildQueriesFromPack(pack);
    const [article] = await queries.listAllArticles();
    const model = await getArticleDetailModel(queries, await buildTestContext(), article.slug);

    expect(model!.authorFacts).toEqual({ completedProjects: 87 });
  });

  it("leaves completedProjects null when the stats module is disabled", async () => {
    const pack = buildTestPack();
    pack.stats = [...pack.stats, { key: "completed_projects", label: "Proyek selesai", value: 87, suffix: "+", sortOrder: 3 }];
    const queries = buildQueriesFromPack(pack, {
      enabledModules: ["services", "portfolio", "articles", "team", "testimonials", "partners", "vision"],
    });
    const [article] = await queries.listAllArticles();
    const model = await getArticleDetailModel(queries, await buildTestContext(), article.slug);

    expect(model!.authorFacts).toEqual({ completedProjects: null });
    expect(model!.article.author.id).toBe("team-rina");
  });

  it("builds article metadata with dates, author, and the opengraph route", async () => {
    const queries = buildQueriesFromPack(buildTestPack());
    const [article] = await queries.listAllArticles();
    const model = await getArticleDetailModel(queries, await buildTestContext(), article.slug);
    const openGraph = model!.seo.metadata.openGraph as Record<string, unknown>;

    expect(model!.seo.metadata.alternates?.canonical).toBe(`${SITE_URL}/artikel/${article.slug}`);
    expect(fullTitle(model!.seo)).toBe(`${article.metaTitle} | Nusa Karya`);
    expect(model!.seo.metadata.description).toBe(article.metaDescription);
    expect(openGraph.type).toBe("article");
    expect(openGraph.publishedTime).toBe(article.publishedAt);
    expect(openGraph.modifiedTime).toBe(article.updatedAt);
    expect(openGraph.authors).toEqual(["Rina Wulandari"]);
    expect(openGraph.images).toEqual([
      expect.objectContaining({ url: `${SITE_URL}/artikel/${article.slug}/opengraph-image` }),
    ]);
  });

  it("orders json-ld as BlogPosting, FAQPage, BreadcrumbList", async () => {
    const queries = buildQueriesFromPack(buildTestPack());
    const [article] = await queries.listAllArticles();
    const model = await getArticleDetailModel(queries, await buildTestContext(), article.slug);

    expect(jsonLdTypes(model!.seo)).toEqual(["BlogPosting", "FAQPage", "BreadcrumbList"]);
    expect(model!.seo.breadcrumbs).toEqual([
      { name: "Beranda", path: "/" },
      { name: "Artikel", path: "/artikel" },
      { name: article.title, path: `/artikel/${article.slug}` },
    ]);
  });

  it("omits FAQPage json-ld when the article has no faq", async () => {
    const pack = buildTestPack();
    pack.articles = pack.articles.map((article) => ({ ...article, faq: [] }));
    const queries = buildQueriesFromPack(pack);
    const [article] = await queries.listAllArticles();
    const model = await getArticleDetailModel(queries, await buildTestContext(), article.slug);

    expect(jsonLdTypes(model!.seo)).toEqual(["BlogPosting", "BreadcrumbList"]);
  });

  it("returns null for an unknown slug", async () => {
    const queries = buildQueriesFromPack(buildTestPack());
    expect(await getArticleDetailModel(queries, await buildTestContext(), "tidak-ada")).toBeNull();
  });

  it("returns null for every model when the articles module is disabled", async () => {
    const theme = { enabledModules: [] };
    const queries = buildQueriesFromPack(buildTestPack(), theme);
    const context = await buildTestContext({ theme });
    const [article] = buildTestPack().articles;

    expect(await getArticleDetailModel(queries, context, article.slug)).toBeNull();
    expect(await getArticlesIndexModel(queries, context, 1)).toBeNull();
    expect(await listArticleSlugs(queries)).toEqual([]);
  });
});

describe("listArticleSlugs", () => {
  it("lists the slugs of all published articles", async () => {
    const queries = buildQueriesFromPack(buildPackWithArticles(10));
    const slugs = await listArticleSlugs(queries);

    expect(slugs).toHaveLength(10);
    expect(slugs).toEqual((await queries.listAllArticles()).map((article) => article.slug));
  });

  it("never lists the reserved halaman slug", async () => {
    const pack = buildTestPack();
    pack.articles = [...pack.articles, { ...pack.articles[0], id: "article-reserved", slug: "halaman" }];
    const queries = buildQueriesFromPack(pack);

    expect((await queries.listAllArticles()).map((article) => article.slug)).toContain("halaman");
    expect(await listArticleSlugs(queries)).not.toContain("halaman");
  });
});
