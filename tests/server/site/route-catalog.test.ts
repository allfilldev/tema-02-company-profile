import { describe, expect, it } from "vitest";
import { themeConfig } from "@/config/theme";
import { isSitePathAvailable } from "@/lib/site/route-availability";
import { listArticleSlugs } from "@/server/site/models/articles";
import { listPortfolioSlugs } from "@/server/site/models/portfolio";
import { listServiceSlugs } from "@/server/site/models/services";
import { getSiteRouteCatalog } from "@/server/site/route-catalog";
import { getSitemapPages } from "@/server/site/technical";
import { buildTestContext, buildTestQueries } from "../../fixtures/site";

describe("getSiteRouteCatalog", () => {
  it("collects the published slugs, enabled modules, and article page count", async () => {
    const queries = buildTestQueries();
    const catalog = await getSiteRouteCatalog(queries, themeConfig);

    expect(catalog.enabledModules).toEqual(themeConfig.enabledModules);
    expect(catalog.serviceSlugs).toEqual(await listServiceSlugs(queries));
    expect(catalog.portfolioSlugs).toEqual(await listPortfolioSlugs(queries));
    expect(catalog.articleSlugs).toEqual(await listArticleSlugs(queries));
    expect(catalog.serviceSlugs.length).toBeGreaterThan(0);
    expect(catalog.portfolioSlugs.length).toBeGreaterThan(0);
    expect(catalog.articleSlugs.length).toBeGreaterThan(0);
    expect(catalog.articlePageCount).toBe(1);
  });

  it("returns empty lists when the catalog modules are disabled", async () => {
    const theme = { ...themeConfig, enabledModules: [] };
    const catalog = await getSiteRouteCatalog(buildTestQueries({ enabledModules: [] }), theme);

    expect(catalog).toEqual({ enabledModules: [], serviceSlugs: [], portfolioSlugs: [], articleSlugs: [], articlePageCount: 1 });
  });

  it("accepts every sitemap path and rejects unknown slugs", async () => {
    const queries = buildTestQueries();
    const catalog = await getSiteRouteCatalog(queries, themeConfig);
    const paths = (await getSitemapPages(queries, await buildTestContext())).map((page) => page.path);

    expect(paths.length).toBeGreaterThan(10);
    for (const path of paths) {
      expect(isSitePathAvailable(path, catalog)).toBe(true);
    }
    for (const path of ["/layanan/tidak-ada", "/portofolio/tidak-ada", "/artikel/tidak-ada", "/artikel/halaman/2"]) {
      expect(isSitePathAvailable(path, catalog)).toBe(false);
    }
  });
});
