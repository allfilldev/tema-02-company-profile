import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo/site-url";

export type SitemapPage = {
  path: string;
  lastModified: string;
};

export function buildSitemap(siteUrl: string, pages: SitemapPage[]): MetadataRoute.Sitemap {
  const entries = new Map<string, MetadataRoute.Sitemap[number]>();

  for (const page of pages) {
    const url = absoluteUrl(siteUrl, page.path);
    if (!entries.has(url)) {
      entries.set(url, { url, lastModified: page.lastModified });
    }
  }

  return [...entries.values()];
}
