import { afterEach, describe, expect, it, vi } from "vitest";
import { themeConfig } from "@/config/theme";
import { getSiteQueries } from "@/server/container";

describe("getSiteQueries", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.doUnmock("@/config/theme");
    vi.resetModules();
  });

  it("serves the general pack in demo mode by default", async () => {
    vi.stubEnv("DATA_SOURCE", "");
    expect((await getSiteQueries().getSettings()).siteName).toBe("All Fill Dev");
  });

  it("treats an unset data source as demo", async () => {
    vi.stubEnv("DATA_SOURCE", undefined);
    expect((await getSiteQueries().getSettings()).siteName).toBe("All Fill Dev");
  });

  it("serves the general pack when the data source is demo", async () => {
    vi.stubEnv("DATA_SOURCE", "demo");
    expect((await getSiteQueries().listServices()).map((service) => service.slug)).toContain("penyusunan-sop");
  });

  it("builds site queries from the cached supabase repositories", async () => {
    vi.resetModules();
    const sentinel = { siteSettings: { get: vi.fn(async () => ({ siteName: "Dari Supabase" })) } };
    vi.doMock("@/server/data/cached-repositories", () => ({ createCachedSupabaseRepositories: () => sentinel }));
    vi.stubEnv("DATA_SOURCE", "supabase");

    const { getSiteQueries: getSupabaseQueries } = await import("@/server/container");

    expect((await getSupabaseQueries().getSettings()).siteName).toBe("Dari Supabase");
    vi.doUnmock("@/server/data/cached-repositories");
  });

  it("refuses an unknown data source", () => {
    vi.stubEnv("DATA_SOURCE", "mysql");
    expect(() => getSiteQueries()).toThrow('Unknown DATA_SOURCE "mysql"');
  });

  it("refuses a theme whose content pack is not registered", async () => {
    vi.stubEnv("DATA_SOURCE", "demo");
    vi.resetModules();
    vi.doMock("@/config/theme", () => ({ themeConfig: { ...themeConfig, contentPack: "missing-pack" } }));
    const { getSiteQueries: getQueriesForMissingPack } = await import("@/server/container");
    expect(() => getQueriesForMissingPack()).toThrow('Content pack "missing-pack" is not registered');
  });
});
