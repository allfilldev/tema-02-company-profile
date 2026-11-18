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
    expect((await getSiteQueries().getSettings()).siteName).toBe("Arunika Solusi");
  });

  it("treats an unset data source as demo", async () => {
    vi.stubEnv("DATA_SOURCE", undefined);
    expect((await getSiteQueries().getSettings()).siteName).toBe("Arunika Solusi");
  });

  it("serves the general pack when the data source is demo", async () => {
    vi.stubEnv("DATA_SOURCE", "demo");
    expect((await getSiteQueries().listServices()).map((service) => service.slug)).toContain("penyusunan-sop");
  });

  it("refuses the supabase data source for now", () => {
    vi.stubEnv("DATA_SOURCE", "supabase");
    expect(() => getSiteQueries()).toThrow("DATA_SOURCE=supabase is not available yet");
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
