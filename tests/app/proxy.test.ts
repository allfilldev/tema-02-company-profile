import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { isSitePathAvailable, NOT_FOUND_REWRITE_PATH, type SiteRouteCatalog } from "@/lib/site/route-availability";
import { config, proxy } from "@/proxy";

const catalogMock = vi.hoisted(() => ({ getSiteRouteCatalog: vi.fn() }));

vi.mock("@/server/site/route-catalog", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/server/site/route-catalog")>();
  catalogMock.getSiteRouteCatalog.mockImplementation(actual.getSiteRouteCatalog);
  return { ...actual, getSiteRouteCatalog: catalogMock.getSiteRouteCatalog };
});

const ORIGIN = "http://localhost:3000";
const PROXY_SECTIONS = ["layanan", "portofolio", "artikel"];

function requestFor(pathname: string): NextRequest {
  return new NextRequest(`${ORIGIN}${pathname}`);
}

function isPassThrough(response: Response): boolean {
  return response.headers.get("x-middleware-next") === "1" && !response.headers.has("x-middleware-rewrite");
}

function rewriteTarget(response: Response): string | null {
  return response.headers.get("x-middleware-rewrite");
}

beforeEach(() => {
  catalogMock.getSiteRouteCatalog.mockClear();
});

describe("proxy", () => {
  it.each(["/layanan", "/portofolio", "/artikel"])("passes the existing section index %s through", async (pathname) => {
    const response = await proxy(requestFor(pathname));

    expect(isPassThrough(response)).toBe(true);
  });

  it.each(["/layanan/slug-yang-tidak-ada", "/portofolio/slug-yang-tidak-ada", "/artikel/slug-yang-tidak-ada", "/artikel/halaman/99"])(
    "rewrites the unknown path %s to the not found path",
    async (pathname) => {
      const response = await proxy(requestFor(pathname));

      expect(rewriteTarget(response)).toBe(`${ORIGIN}${NOT_FOUND_REWRITE_PATH}`);
      expect(isPassThrough(response)).toBe(false);
    },
  );

  it("decides from the catalog it is given", async () => {
    const emptyCatalog: SiteRouteCatalog = {
      enabledModules: ["services"],
      serviceSlugs: [],
      portfolioSlugs: [],
      articleSlugs: [],
      articlePageCount: 1,
    };
    catalogMock.getSiteRouteCatalog.mockResolvedValueOnce(emptyCatalog);

    const response = await proxy(requestFor("/layanan/apa-saja"));

    expect(rewriteTarget(response)).toBe(`${ORIGIN}${NOT_FOUND_REWRITE_PATH}`);
  });

  it("passes through when the catalog lookup throws", async () => {
    catalogMock.getSiteRouteCatalog.mockRejectedValueOnce(new Error("katalog gagal"));

    const response = await proxy(requestFor("/layanan/slug-yang-tidak-ada"));

    expect(isPassThrough(response)).toBe(true);
    expect(catalogMock.getSiteRouteCatalog).toHaveBeenCalledTimes(1);
  });

  it("passes through when the catalog lookup throws synchronously", async () => {
    catalogMock.getSiteRouteCatalog.mockImplementationOnce(() => {
      throw new Error("katalog gagal");
    });

    const response = await proxy(requestFor("/artikel/slug-yang-tidak-ada"));

    expect(isPassThrough(response)).toBe(true);
  });
});

describe("proxy config", () => {
  const emptyCatalog: SiteRouteCatalog = {
    enabledModules: [],
    serviceSlugs: [],
    portfolioSlugs: [],
    articleSlugs: [],
    articlePageCount: 1,
  };

  it("matches exactly the sections that route availability decides on", () => {
    expect(config.matcher).toEqual(PROXY_SECTIONS.map((section) => `/${section}/:path*`));
  });

  it.each(PROXY_SECTIONS)("keeps %s in step with isSitePathAvailable", (section) => {
    expect(isSitePathAvailable(`/${section}/apa-saja`, emptyCatalog)).toBe(false);
    expect(config.matcher).toContain(`/${section}/:path*`);
  });

  it("does not match a section that route availability leaves to the router, as a positive control", () => {
    expect(isSitePathAvailable("/tentang/apa-saja", emptyCatalog)).toBe(true);
    expect(config.matcher).not.toContain("/tentang/:path*");
  });
});
