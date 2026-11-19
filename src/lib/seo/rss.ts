import type { ArticleWithAuthor } from "@/core/domain/article/article";
import type { SiteSettings } from "@/core/domain/settings/site-settings";
import { newestIsoDate } from "@/lib/seo/dates";
import { absoluteUrl } from "@/lib/seo/site-url";
import { SITE_ROUTES } from "@/lib/site/routes";

const XML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => XML_ESCAPES[character]);
}

function toRfc822(isoDate: string): string {
  return new Date(isoDate).toUTCString();
}

function buildItem(siteUrl: string, article: ArticleWithAuthor): string {
  const link = escapeXml(absoluteUrl(siteUrl, `${SITE_ROUTES.articles}/${article.slug}`));

  return [
    "    <item>",
    `      <title>${escapeXml(article.title)}</title>`,
    `      <link>${link}</link>`,
    `      <guid isPermaLink="true">${link}</guid>`,
    `      <pubDate>${toRfc822(article.publishedAt)}</pubDate>`,
    `      <description>${escapeXml(article.lead)}</description>`,
    `      <dc:creator>${escapeXml(article.author.name)}</dc:creator>`,
    "    </item>",
  ].join("\n");
}

export function buildRssXml(input: { siteUrl: string; settings: SiteSettings; articles: ArticleWithAuthor[] }): string {
  const { siteUrl, settings, articles } = input;
  const newestFirst = [...articles].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  const lastBuildDate = newestIsoDate(
    articles.map((article) => article.updatedAt),
    settings.updatedAt,
  );

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">',
    "  <channel>",
    `    <title>${escapeXml(settings.siteName)}</title>`,
    `    <link>${escapeXml(absoluteUrl(siteUrl, "/"))}</link>`,
    `    <description>${escapeXml(settings.tagline)}</description>`,
    "    <language>id-ID</language>",
    `    <lastBuildDate>${toRfc822(lastBuildDate)}</lastBuildDate>`,
    ...newestFirst.map((article) => buildItem(siteUrl, article)),
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
}
