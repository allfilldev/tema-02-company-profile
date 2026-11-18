import { describe, expect, it } from "vitest";
import { createSiteQueries } from "@/core/application/site/site-queries";
import type { Article } from "@/core/domain/article/article";
import type { ContentPack } from "@/core/domain/content-pack/content-pack";
import { createFixtureRepositories } from "@/infrastructure/fixtures/fixture-repositories";
import { themeConfig } from "@/config/theme";
import { buildTestPack } from "../../fixtures/content-pack";

function buildArticles(count: number, template: Article): Article[] {
  return Array.from({ length: count }, (_, index) => {
    const day = String(index + 1).padStart(2, "0");
    return {
      ...template,
      id: `article-${day}`,
      slug: `artikel-ke-${day}`,
      publishedAt: `2026-10-${day}T08:00:00.000Z`,
    };
  });
}

function buildPackWithArticles(count: number): ContentPack {
  const pack = buildTestPack();
  return { ...pack, articles: buildArticles(count, pack.articles[0]) };
}

function buildQueries(pack: ContentPack, theme = themeConfig) {
  return createSiteQueries(createFixtureRepositories(pack), theme);
}

describe("site queries", () => {
  it("returns services sorted by sortOrder", async () => {
    const pack = buildTestPack();
    const [first, second] = pack.services;
    const shuffled = { ...pack, services: [{ ...second, sortOrder: 2 }, { ...first, sortOrder: 1 }] };

    const services = await buildQueries(shuffled).listServices();

    expect(services.map((service) => service.slug)).toEqual([first.slug, second.slug]);
    expect(shuffled.services.map((service) => service.slug)).toEqual([second.slug, first.slug]);
  });

  it("hides a disabled module everywhere", async () => {
    const pack = buildTestPack();
    const queries = buildQueries(pack, { ...themeConfig, enabledModules: ["articles"] });

    expect(await queries.listServices()).toEqual([]);
    expect(await queries.getService(pack.services[0].slug)).toBeNull();
    expect(await queries.getSectionIntro("services")).toBeNull();
    expect(await queries.getVision()).toBeNull();
    expect(queries.isModuleEnabled("services")).toBe(false);
    expect(queries.isModuleEnabled("articles")).toBe(true);
  });

  it("keeps sections that are not modules available", async () => {
    const queries = buildQueries(buildTestPack(), { ...themeConfig, enabledModules: [] });

    expect(await queries.getSectionIntro("about")).not.toBeNull();
    expect(await queries.getSectionIntro("contact")).not.toBeNull();
  });

  it("paginates articles newest first, 9 per page", async () => {
    const queries = buildQueries(buildPackWithArticles(10));

    const first = await queries.listArticles(1);
    expect(first).toMatchObject({ page: 1, pageCount: 2, total: 10 });
    expect(first!.items).toHaveLength(9);
    expect(first!.items[0].slug).toBe("artikel-ke-10");
    expect(first!.items[8].slug).toBe("artikel-ke-02");

    const second = await queries.listArticles(2);
    expect(second!.items.map((article) => article.slug)).toEqual(["artikel-ke-01"]);
    expect(await queries.listArticles(3)).toBeNull();
    expect(await queries.listArticles(0)).toBeNull();
  });

  it("treats page 1 of an empty list as valid", async () => {
    const queries = buildQueries(buildPackWithArticles(0));

    expect(await queries.listArticles(1)).toEqual({ items: [], page: 1, pageCount: 1, total: 0 });
    expect(await queries.listArticles(2)).toBeNull();
  });

  it("returns no article page when the articles module is disabled", async () => {
    const queries = buildQueries(buildTestPack(), { ...themeConfig, enabledModules: ["services"] });

    expect(await queries.listArticles(1)).toBeNull();
    expect(await queries.getArticle(buildTestPack().articles[0].slug)).toBeNull();
  });

  it("resolves the article author", async () => {
    const pack = buildTestPack();
    const queries = buildQueries(pack);

    const article = await queries.getArticle(pack.articles[0].slug);

    expect(article!.author.id).toBe(pack.articles[0].authorId);
    expect(article!.author.name).toBe("Rina Wulandari");
    expect(await queries.getArticle("tidak-ada")).toBeNull();
  });

  it("throws when the article author is missing from the team", async () => {
    const pack = buildTestPack();
    const queries = buildQueries({ ...pack, team: [] });

    await expect(queries.getArticle(pack.articles[0].slug)).rejects.toThrow(Error);
  });

  it("lists related articles without the current one, newest first, up to 3", async () => {
    const queries = buildQueries(buildPackWithArticles(10));

    const related = await queries.listRelatedArticles("artikel-ke-10");

    expect(related.map((article) => article.slug)).toEqual(["artikel-ke-09", "artikel-ke-08", "artikel-ke-07"]);
  });

  it("keeps the requested limit when the current article is not among the newest", async () => {
    const queries = buildQueries(buildPackWithArticles(10));

    const related = await queries.listRelatedArticles("artikel-ke-01", 2);

    expect(related.map((article) => article.slug)).toEqual(["artikel-ke-10", "artikel-ke-09"]);
  });

  it("returns null for an undeclared content block even when data exists", async () => {
    const queries = buildQueries(buildTestPack(), { ...themeConfig, contentBlocks: [] });

    expect(await queries.getContentBlock("how-we-work")).toBeNull();
  });

  it("returns null for a declared content block without data", async () => {
    const queries = buildQueries({ ...buildTestPack(), contentBlocks: [] });

    expect(await queries.getContentBlock("how-we-work")).toBeNull();
  });

  it("returns a declared content block that has data", async () => {
    const block = await buildQueries(buildTestPack()).getContentBlock("how-we-work");

    expect(block!.items).toHaveLength(3);
  });

  it("returns settings, home, about and legal pages from the pack", async () => {
    const queries = buildQueries(buildTestPack());

    expect((await queries.getSettings()).siteName).toBe("Nusa Karya");
    expect((await queries.getHome()).heroTitle).toContain("Website perusahaan");
    expect((await queries.getAbout()).summary).toContain("Nusa Karya");
    expect((await queries.getLegalPage("privasi"))!.slug).toBe("privasi");
  });
});
