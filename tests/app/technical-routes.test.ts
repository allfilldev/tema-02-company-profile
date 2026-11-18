import { afterEach, describe, expect, it, vi } from "vitest";
import { themeConfig } from "@/config/theme";
import { ogTheme } from "@/styles/tokens";
import { GET as getLlmsTxt } from "@/app/llms.txt/route";
import { GET as getRssFeed } from "@/app/rss.xml/route";
import manifest from "@/app/manifest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

const SITE_URL = "https://arunika.example";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.doUnmock("@/config/theme");
  vi.resetModules();
});

function robotRules() {
  const { rules } = robots();
  return Array.isArray(rules) ? rules : [rules];
}

describe("robots route", () => {
  it("disallows everything without a sitemap when indexing is unset", () => {
    vi.stubEnv("SITE_INDEXING", undefined);
    vi.stubEnv("SITE_URL", SITE_URL);

    expect(robotRules()).toEqual([{ userAgent: "*", disallow: "/" }]);
    expect("sitemap" in robots()).toBe(false);
  });

  it("keeps blocking everything for any value other than on", () => {
    vi.stubEnv("SITE_INDEXING", "true");

    expect(robotRules()).toEqual([{ userAgent: "*", disallow: "/" }]);
  });

  it("allows crawling with private paths blocked and the sitemap listed when indexing is on", () => {
    vi.stubEnv("SITE_INDEXING", "on");
    vi.stubEnv("SITE_URL", SITE_URL);

    const wildcard = robotRules().find((rule) => rule.userAgent === "*");

    expect(wildcard).toEqual({ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] });
    expect(robots().sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });
});

describe("sitemap route", () => {
  it("lists absolute urls built from SITE_URL with no duplicates", async () => {
    vi.stubEnv("SITE_URL", SITE_URL);

    const urls = (await sitemap()).map((entry) => entry.url);

    expect(urls.length).toBeGreaterThan(5);
    expect(urls.every((url) => url.startsWith(`${SITE_URL}/`))).toBe(true);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls).toContain(`${SITE_URL}/`);
    expect(urls).toContain(`${SITE_URL}/kontak`);
    expect(urls).toContain(`${SITE_URL}/layanan/penyusunan-sop`);
    expect(urls).not.toContain(`${SITE_URL}/artikel/halaman/1`);
  });

  it("gives every entry a valid last modified date", async () => {
    const entries = await sitemap();

    for (const entry of entries) {
      expect(Number.isNaN(new Date(entry.lastModified as string).getTime())).toBe(false);
    }
    expect(Number.isNaN(new Date("bukan tanggal").getTime())).toBe(true);
  });
});

describe("manifest route", () => {
  it("describes the site with the two icons and the og theme colors", async () => {
    const result = await manifest();

    expect(result.name).toBe("Arunika Solusi");
    expect(result.icons?.map((icon) => icon.src)).toEqual(["/icon-192.png", "/icon-512.png"]);
    expect(result.theme_color).toBe(ogTheme.primary);
    expect(result.background_color).toBe(ogTheme.background);
    expect(result.lang).toBe("id");
  });
});

describe("rss.xml route", () => {
  it("serves the feed as rss xml with a utf-8 charset", async () => {
    vi.stubEnv("SITE_URL", SITE_URL);

    const response = await getRssFeed();
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/rss+xml; charset=utf-8");
    expect(body).toMatch(/<rss\b/);
    expect(body).toContain(`${SITE_URL}/artikel/`);
  });

  it("answers 404 when the articles module is disabled", async () => {
    vi.resetModules();
    vi.doMock("@/config/theme", () => ({
      themeConfig: { ...themeConfig, enabledModules: themeConfig.enabledModules.filter((key) => key !== "articles") },
    }));
    const { GET } = await import("@/app/rss.xml/route");

    const response = await GET();

    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).not.toBe("application/rss+xml; charset=utf-8");
  });
});

describe("llms.txt route", () => {
  it("serves plain text with the site name and absolute links", async () => {
    vi.stubEnv("SITE_URL", SITE_URL);

    const response = await getLlmsTxt();
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8");
    expect(body).toContain("Arunika Solusi");
    expect(body).toContain(`${SITE_URL}/layanan/penyusunan-sop`);
    expect(body).not.toMatch(/<rss\b/);
  });
});
