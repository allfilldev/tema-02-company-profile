import { describe, expect, it } from "vitest";
import { buildLlmsTxt } from "@/lib/seo/llms";
import { buildNavigation } from "@/server/site/navigation";
import { buildTestPack } from "../../fixtures/content-pack";

const SITE_URL = "https://nusakarya.example";

describe("buildLlmsTxt", () => {
  it("starts with the site name, then the tagline as a summary", () => {
    const pack = buildTestPack();
    const text = buildLlmsTxt({
      siteUrl: SITE_URL,
      settings: pack.settings,
      navigation: buildNavigation(["services", "articles"]),
      services: pack.services,
      articles: pack.articles,
    });

    expect(text.startsWith("# Nusa Karya\n\n> Mitra digital untuk bisnis yang ingin tumbuh\n")).toBe(true);
    expect(text.endsWith("\n")).toBe(true);
    expect(text.endsWith("\n\n")).toBe(false);
  });

  it("lists main pages, services, and articles with absolute links", () => {
    const pack = buildTestPack();
    const text = buildLlmsTxt({
      siteUrl: SITE_URL,
      settings: pack.settings,
      navigation: buildNavigation(["services", "articles"]),
      services: pack.services,
      articles: pack.articles,
    });

    expect(text).toContain("## Halaman utama");
    expect(text).toContain(`- [Beranda](${SITE_URL}/)`);
    expect(text).toContain(`- [Kontak](${SITE_URL}/kontak)`);
    expect(text).toContain("## Layanan");
    expect(text).toContain(`- [Pembuatan Website Company Profile](${SITE_URL}/layanan/pembuatan-website)`);
    expect(text).toContain("## Artikel");
    expect(text).toContain(
      `- [Cara Memilih Jasa Pembuatan Website yang Tepat](${SITE_URL}/artikel/cara-memilih-jasa-pembuatan-website)`,
    );
  });

  it("omits the service and article sections when there is nothing to list", () => {
    const pack = buildTestPack();
    const text = buildLlmsTxt({
      siteUrl: SITE_URL,
      settings: pack.settings,
      navigation: buildNavigation([]),
      services: [],
      articles: [],
    });

    expect(text).not.toContain("## Layanan");
    expect(text).not.toContain("## Artikel");
    expect(text).not.toContain("/layanan");
    expect(text).not.toContain("/artikel");
    expect(text).toContain("## Halaman utama");
  });
});
