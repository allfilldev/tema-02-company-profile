import { afterEach, describe, expect, it, vi } from "vitest";
import { getSiteContext } from "@/server/site/site-context";
import { getSiteEnv } from "@/server/site/site-env";
import { buildTestContext, buildTestEnv, buildTestQueries } from "../../fixtures/site";
import { themeConfig } from "@/config/theme";

describe("getSiteEnv", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("falls back to demo defaults when nothing is set", () => {
    vi.stubEnv("SITE_URL", "");
    vi.stubEnv("SITE_INDEXING", "");
    vi.stubEnv("DATA_SOURCE", "");
    expect(getSiteEnv()).toEqual({ siteUrl: "http://localhost:3000", indexingEnabled: false, isDemo: true });
  });

  it("treats unset variables as defaults", () => {
    vi.stubEnv("SITE_URL", undefined);
    vi.stubEnv("SITE_INDEXING", undefined);
    vi.stubEnv("DATA_SOURCE", undefined);
    expect(getSiteEnv()).toEqual({ siteUrl: "http://localhost:3000", indexingEnabled: false, isDemo: true });
  });

  it("reads the site url without a trailing slash and enables indexing on", () => {
    vi.stubEnv("SITE_URL", "https://nusakarya.example/");
    vi.stubEnv("SITE_INDEXING", "on");
    vi.stubEnv("DATA_SOURCE", "demo");
    expect(getSiteEnv()).toEqual({ siteUrl: "https://nusakarya.example", indexingEnabled: true, isDemo: true });
  });

  it("is not demo when the data source is supabase", () => {
    vi.stubEnv("SITE_URL", "");
    vi.stubEnv("DATA_SOURCE", "supabase");
    expect(getSiteEnv().isDemo).toBe(false);
  });

  it("reads the environment at call time", () => {
    vi.stubEnv("SITE_URL", "https://nusakarya.example");
    vi.stubEnv("SITE_INDEXING", "off");
    expect(getSiteEnv().indexingEnabled).toBe(false);
    vi.stubEnv("SITE_INDEXING", "on");
    expect(getSiteEnv().indexingEnabled).toBe(true);
  });

  it("rejects a site url that carries a path", () => {
    vi.stubEnv("SITE_URL", "https://nusakarya.example/blog");
    expect(() => getSiteEnv()).toThrow("path, query, atau hash");
  });

  describe("in a production build", () => {
    it.each(["", undefined, "http://localhost:3000", "http://127.0.0.1:3000", "http://[::1]:3000", "https://app.localhost"])(
      "throws when indexing is on and SITE_URL is %j",
      (siteUrl) => {
        vi.stubEnv("NODE_ENV", "production");
        vi.stubEnv("SITE_INDEXING", "on");
        vi.stubEnv("SITE_URL", siteUrl);
        expect(() => getSiteEnv()).toThrow("SITE_URL");
      },
    );

    it("accepts a real site url when indexing is on", () => {
      vi.stubEnv("NODE_ENV", "production");
      vi.stubEnv("SITE_INDEXING", "on");
      vi.stubEnv("SITE_URL", "https://nusakarya.example");
      expect(getSiteEnv().siteUrl).toBe("https://nusakarya.example");
    });

    it.each(["", undefined, "off"])("keeps the localhost fallback when indexing is %j", (indexing) => {
      vi.stubEnv("NODE_ENV", "production");
      vi.stubEnv("SITE_INDEXING", indexing);
      vi.stubEnv("SITE_URL", "");
      expect(getSiteEnv()).toEqual({ siteUrl: "http://localhost:3000", indexingEnabled: false, isDemo: true });
    });
  });

  describe("outside a production build", () => {
    it.each(["development", "test"])("keeps the localhost fallback with indexing on in %s", (nodeEnv) => {
      vi.stubEnv("NODE_ENV", nodeEnv);
      vi.stubEnv("SITE_INDEXING", "on");
      vi.stubEnv("SITE_URL", "");
      expect(getSiteEnv().siteUrl).toBe("http://localhost:3000");
    });
  });
});

describe("getSiteContext", () => {
  it("builds the whatsapp url from the settings", async () => {
    const context = await buildTestContext();
    expect(context.whatsappUrl).toBe(
      "https://wa.me/6281234567890?text=Halo%2C%20saya%20ingin%20berkonsultasi%20tentang%20layanan%20Nusa%20Karya.",
    );
  });

  it("follows the enabled modules of the theme for navigation", async () => {
    const context = await buildTestContext({ theme: { enabledModules: ["articles"] } });
    expect(context.navigation.map((item) => item.label)).toEqual(["Beranda", "Tentang", "Artikel", "Kontak"]);
  });

  it("types the organization json-ld by the settings schema type", async () => {
    const context = await buildTestContext();
    expect(context.settings.schemaType).toBe("LocalBusiness");
    expect(context.organizationJsonLd["@type"]).toBe("LocalBusiness");
    expect(context.webSiteJsonLd["@type"]).toBe("WebSite");
  });

  it("derives the seo site from the settings and env", async () => {
    const context = await buildTestContext({ env: { indexingEnabled: false } });
    expect(context.seoSite).toEqual({
      siteName: "Nusa Karya",
      siteUrl: "https://nusakarya.example",
      indexingEnabled: false,
      defaultOgImagePath: "/opengraph-image",
      defaultOgImageAlt: "Nusa Karya, Mitra digital untuk bisnis yang ingin tumbuh",
    });
  });

  it("passes the env and theme through", async () => {
    const env = buildTestEnv({ isDemo: false });
    const context = await getSiteContext(buildTestQueries(), env, themeConfig);
    expect(context.env).toBe(env);
    expect(context.theme).toBe(themeConfig);
  });
});

describe("test helpers", () => {
  it("builds the default test env", () => {
    expect(buildTestEnv()).toEqual({ siteUrl: "https://nusakarya.example", indexingEnabled: true, isDemo: true });
  });

  it("merges theme overrides into the test queries", () => {
    expect(buildTestQueries({ enabledModules: [] }).isModuleEnabled("services")).toBe(false);
    expect(buildTestQueries().isModuleEnabled("services")).toBe(true);
  });
});
