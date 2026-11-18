import { describe, expect, it } from "vitest";
import type { ModuleKey } from "@/core/domain/shared/module-key";
import { isSitePathAvailable, NOT_FOUND_REWRITE_PATH, type SiteRouteCatalog } from "@/lib/site/route-availability";

const ALL_MODULES: ModuleKey[] = ["services", "portfolio", "articles", "team", "stats", "testimonials", "partners", "vision"];

function buildCatalog(overrides?: Partial<SiteRouteCatalog>): SiteRouteCatalog {
  return {
    enabledModules: ALL_MODULES,
    serviceSlugs: ["penyusunan-sop", "audit-proses"],
    portfolioSlugs: ["sistem-kpi"],
    articleSlugs: ["cara-menyusun-sop"],
    articlePageCount: 3,
    ...overrides,
  };
}

function withoutModule(module: ModuleKey): SiteRouteCatalog {
  return buildCatalog({ enabledModules: ALL_MODULES.filter((key) => key !== module) });
}

describe("isSitePathAvailable", () => {
  it.each([
    "/layanan",
    "/layanan/penyusunan-sop",
    "/layanan/audit-proses",
    "/portofolio",
    "/portofolio/sistem-kpi",
    "/artikel",
    "/artikel/cara-menyusun-sop",
    "/artikel/halaman/2",
    "/artikel/halaman/3",
    "/layanan/penyusunan%2Dsop",
  ])("accepts the existing route %s", (pathname) => {
    expect(isSitePathAvailable(pathname, buildCatalog())).toBe(true);
  });

  it.each([
    "/layanan/tidak-ada",
    "/layanan/PENYUSUNAN-SOP",
    "/portofolio/tidak-ada",
    "/artikel/tidak-ada",
    "/artikel/halaman",
    "/artikel/halaman/1",
    "/artikel/halaman/0",
    "/artikel/halaman/02",
    "/artikel/halaman/-2",
    "/artikel/halaman/abc",
    "/artikel/halaman/2.5",
    "/artikel/halaman/4",
    "/artikel/halaman/99999999999999999999",
    "/layanan/%E0%A4%A",
  ])("rejects the missing route %s", (pathname) => {
    expect(isSitePathAvailable(pathname, buildCatalog())).toBe(false);
  });

  it.each([
    ["/layanan", "services"],
    ["/layanan/penyusunan-sop", "services"],
    ["/layanan/penyusunan-sop/opengraph-image", "services"],
    ["/portofolio", "portfolio"],
    ["/portofolio/sistem-kpi", "portfolio"],
    ["/artikel", "articles"],
    ["/artikel/cara-menyusun-sop", "articles"],
    ["/artikel/halaman/2", "articles"],
  ] as const)("rejects %s when the %s module is disabled", (pathname, module) => {
    expect(isSitePathAvailable(pathname, buildCatalog())).toBe(true);
    expect(isSitePathAvailable(pathname, withoutModule(module))).toBe(false);
  });

  it("keeps other modules available when one module is disabled", () => {
    const catalog = withoutModule("services");

    expect(isSitePathAvailable("/portofolio/sistem-kpi", catalog)).toBe(true);
    expect(isSitePathAvailable("/artikel/cara-menyusun-sop", catalog)).toBe(true);
  });

  it("rejects every paginated page when there is only one article page", () => {
    const catalog = buildCatalog({ articlePageCount: 1 });

    expect(isSitePathAvailable("/artikel", catalog)).toBe(true);
    expect(isSitePathAvailable("/artikel/halaman/2", catalog)).toBe(false);
  });

  it.each([
    "/",
    "/tentang",
    "/kontak",
    "/privasi",
    "/tidak-ada",
    "/layanan/penyusunan-sop/opengraph-image",
    "/layanan/tidak-ada/opengraph-image",
    "/artikel/halaman/2/lainnya",
  ])("leaves %s to the router", (pathname) => {
    expect(isSitePathAvailable(pathname, buildCatalog())).toBe(true);
  });

  it("accepts a trailing slash like the router does", () => {
    expect(isSitePathAvailable("/layanan/penyusunan-sop/", buildCatalog())).toBe(true);
    expect(isSitePathAvailable("/layanan/tidak-ada/", buildCatalog())).toBe(false);
  });
});

describe("NOT_FOUND_REWRITE_PATH", () => {
  it("is an internal path that no route folder can match", () => {
    expect(NOT_FOUND_REWRITE_PATH.startsWith("/_")).toBe(true);
    expect(NOT_FOUND_REWRITE_PATH).not.toBe("/_not-found");
    expect(isSitePathAvailable(NOT_FOUND_REWRITE_PATH, buildCatalog())).toBe(true);
  });
});
