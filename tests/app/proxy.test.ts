import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isSitePathAvailable, NOT_FOUND_REWRITE_PATH, type SiteRouteCatalog } from "@/lib/site/route-availability";
import { config, proxy } from "@/proxy";

const catalogMock = vi.hoisted(() => ({ getSiteRouteCatalog: vi.fn() }));
const sessionMock = vi.hoisted(() => ({ updateAdminSession: vi.fn() }));
const memoMock = vi.hoisted(() => ({ get: vi.fn(), refresh: vi.fn() }));

vi.mock("@/server/supabase/proxy-session", () => ({ updateAdminSession: sessionMock.updateAdminSession }));
vi.mock("@/server/site/supabase-route-catalog", () => ({ getSupabaseRouteCatalogMemo: () => memoMock }));

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
  sessionMock.updateAdminSession.mockReset();
  memoMock.get.mockReset();
  memoMock.refresh.mockReset();
});

afterEach(() => {
  vi.unstubAllEnvs();
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

  it("matches exactly the guarded sections plus the admin area", () => {
    expect(config.matcher).toEqual([...PROXY_SECTIONS.map((section) => `/${section}/:path*`), "/admin/:path*"]);
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

describe("proxy admin guard", () => {
  it.each(["/admin", "/admin/login", "/admin/layanan"])("hides %s in demo mode without touching the session", async (pathname) => {
    const response = await proxy(requestFor(pathname));

    expect(rewriteTarget(response)).toBe(`${ORIGIN}${NOT_FOUND_REWRITE_PATH}`);
    expect(sessionMock.updateAdminSession).not.toHaveBeenCalled();
  });

  it("redirects an anonymous visitor to the login page in supabase mode", async () => {
    vi.stubEnv("DATA_SOURCE", "supabase");
    sessionMock.updateAdminSession.mockResolvedValue({ response: NextResponse.next(), hasSession: false });

    const response = await proxy(requestFor("/admin/layanan"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(`${ORIGIN}/admin/login`);
  });

  it("lets the login page through even without a session", async () => {
    vi.stubEnv("DATA_SOURCE", "supabase");
    const sessionResponse = NextResponse.next();
    sessionMock.updateAdminSession.mockResolvedValue({ response: sessionResponse, hasSession: false });

    expect(await proxy(requestFor("/admin/login"))).toBe(sessionResponse);
  });

  it("returns the session response for a signed in admin", async () => {
    vi.stubEnv("DATA_SOURCE", "supabase");
    const sessionResponse = NextResponse.next();
    sessionMock.updateAdminSession.mockResolvedValue({ response: sessionResponse, hasSession: true });

    expect(await proxy(requestFor("/admin"))).toBe(sessionResponse);
  });

  it("fails closed when the session cannot be read", async () => {
    vi.stubEnv("DATA_SOURCE", "supabase");
    sessionMock.updateAdminSession.mockRejectedValue(new Error("supabase down"));

    const response = await proxy(requestFor("/admin"));

    expect(rewriteTarget(response)).toBe(`${ORIGIN}${NOT_FOUND_REWRITE_PATH}`);
  });
});

describe("proxy slug guard in supabase mode", () => {
  const known: SiteRouteCatalog = {
    enabledModules: ["services"],
    serviceSlugs: ["ada"],
    portfolioSlugs: [],
    articleSlugs: [],
    articlePageCount: 1,
  };

  it("passes a known slug without refreshing", async () => {
    vi.stubEnv("DATA_SOURCE", "supabase");
    memoMock.get.mockResolvedValue(known);

    const response = await proxy(requestFor("/layanan/ada"));

    expect(isPassThrough(response)).toBe(true);
    expect(memoMock.refresh).not.toHaveBeenCalled();
    expect(catalogMock.getSiteRouteCatalog).not.toHaveBeenCalled();
  });

  it("passes a newly published slug after one refresh", async () => {
    vi.stubEnv("DATA_SOURCE", "supabase");
    memoMock.get.mockResolvedValue(known);
    memoMock.refresh.mockResolvedValue({ ...known, serviceSlugs: ["ada", "baru"] });

    expect(isPassThrough(await proxy(requestFor("/layanan/baru")))).toBe(true);
  });

  it("rewrites a slug that is still missing after the refresh", async () => {
    vi.stubEnv("DATA_SOURCE", "supabase");
    memoMock.get.mockResolvedValue(known);
    memoMock.refresh.mockResolvedValue(known);

    expect(rewriteTarget(await proxy(requestFor("/layanan/tidak-ada")))).toBe(`${ORIGIN}${NOT_FOUND_REWRITE_PATH}`);
  });

  it("passes through when the catalog cannot be loaded", async () => {
    vi.stubEnv("DATA_SOURCE", "supabase");
    memoMock.get.mockRejectedValue(new Error("down"));

    expect(isPassThrough(await proxy(requestFor("/layanan/apa-saja")))).toBe(true);
  });
});
