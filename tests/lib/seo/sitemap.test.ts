import { describe, expect, it } from "vitest";
import { buildSitemap, type SitemapPage } from "@/lib/seo/sitemap";

const SITE_URL = "https://nusakarya.example";

describe("buildSitemap", () => {
  it("maps each page to an absolute url with its last modified date", () => {
    const pages: SitemapPage[] = [
      { path: "/", lastModified: "2026-11-10T08:00:00.000Z" },
      { path: "/tentang", lastModified: "2026-11-01T08:00:00.000Z" },
    ];

    expect(buildSitemap(SITE_URL, pages)).toEqual([
      { url: `${SITE_URL}/`, lastModified: "2026-11-10T08:00:00.000Z" },
      { url: `${SITE_URL}/tentang`, lastModified: "2026-11-01T08:00:00.000Z" },
    ]);
  });

  it("keeps only the first entry of a duplicated url", () => {
    const pages: SitemapPage[] = [
      { path: "/tentang", lastModified: "2026-11-01T08:00:00.000Z" },
      { path: "/tentang/", lastModified: "2026-11-09T08:00:00.000Z" },
    ];

    expect(buildSitemap(SITE_URL, pages)).toEqual([
      { url: `${SITE_URL}/tentang`, lastModified: "2026-11-01T08:00:00.000Z" },
    ]);
  });

  it("tolerates a trailing slash on the site url", () => {
    const [entry] = buildSitemap(`${SITE_URL}/`, [{ path: "/kontak", lastModified: "2026-11-01T08:00:00.000Z" }]);

    expect(entry.url).toBe(`${SITE_URL}/kontak`);
  });
});
