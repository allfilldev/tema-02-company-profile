import { describe, expect, it } from "vitest";
import type { ArticleWithAuthor } from "@/core/domain/article/article";
import { buildRssXml } from "@/lib/seo/rss";
import { buildTestPack } from "../../fixtures/content-pack";

const SITE_URL = "https://nusakarya.example";

function buildArticles(): ArticleWithAuthor[] {
  const pack = buildTestPack();
  return pack.articles.map((article) => {
    const author = pack.team.find((member) => member.id === article.authorId);
    if (!author) {
      throw new Error(`Missing author ${article.authorId}`);
    }
    return { ...article, author };
  });
}

function build(articles: ArticleWithAuthor[]): string {
  return buildRssXml({ siteUrl: SITE_URL, settings: buildTestPack().settings, articles });
}

describe("buildRssXml", () => {
  it("builds an RSS 2.0 channel with the site metadata", () => {
    const xml = build(buildArticles());

    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain("<channel>");
    expect(xml).toContain("<title>Nusa Karya</title>");
    expect(xml).toContain(`<link>${SITE_URL}/</link>`);
    expect(xml).toContain("<description>Mitra digital untuk bisnis yang ingin tumbuh</description>");
    expect(xml).toContain("<language>id-ID</language>");
    expect(xml).toContain("<lastBuildDate>Tue, 10 Nov 2026 08:00:00 GMT</lastBuildDate>");
    expect(xml.trimEnd().endsWith("</rss>")).toBe(true);
  });

  it("emits absolute links, permalink guids, and RFC 822 dates for each item", () => {
    const xml = build(buildArticles());

    expect(xml).toContain(`<link>${SITE_URL}/artikel/cara-memilih-jasa-pembuatan-website</link>`);
    expect(xml).toContain(
      `<guid isPermaLink="true">${SITE_URL}/artikel/cara-memilih-jasa-pembuatan-website</guid>`,
    );
    expect(xml).toContain("<pubDate>Thu, 05 Nov 2026 08:00:00 GMT</pubDate>");
    expect(xml).toContain("<dc:creator>Rina Wulandari</dc:creator>");
    expect(xml).toContain('xmlns:dc="http://purl.org/dc/elements/1.1/"');
  });

  it("orders items newest first", () => {
    const [newer, older] = buildArticles();
    const xml = build([older, newer]);

    expect(xml.indexOf(newer.slug)).toBeLessThan(xml.indexOf(older.slug));
  });

  it("escapes special characters in titles, descriptions, and names", () => {
    const [article] = buildArticles();
    const xml = build([
      {
        ...article,
        title: `Tips <SEO> & "Konten" 'Terbaik'`,
        lead: "Lead dengan <b>tag</b> & simbol",
        author: { ...article.author, name: "Rina & Bima" },
      },
    ]);

    expect(xml).toContain("<title>Tips &lt;SEO&gt; &amp; &quot;Konten&quot; &apos;Terbaik&apos;</title>");
    expect(xml).toContain("<description>Lead dengan &lt;b&gt;tag&lt;/b&gt; &amp; simbol</description>");
    expect(xml).toContain("<dc:creator>Rina &amp; Bima</dc:creator>");
    expect(xml).not.toContain("<SEO>");
  });

  it("escapes the site name in the channel title", () => {
    const settings = { ...buildTestPack().settings, siteName: "Nusa & Karya <Studio>" };
    const xml = buildRssXml({ siteUrl: SITE_URL, settings, articles: buildArticles() });

    expect(xml).toContain("<title>Nusa &amp; Karya &lt;Studio&gt;</title>");
  });

  it("falls back to the settings date when there are no articles", () => {
    const xml = build([]);

    expect(xml).not.toContain("<item>");
    expect(xml).toContain("<lastBuildDate>Tue, 10 Nov 2026 08:00:00 GMT</lastBuildDate>");
  });
});
