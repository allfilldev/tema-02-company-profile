import type { MetadataRoute } from "next";
import { themeConfig } from "@/config/theme";
import { buildSitemap } from "@/lib/seo/sitemap";
import { getSiteQueries } from "@/server/container";
import { getSiteContext } from "@/server/site/site-context";
import { getSiteEnv } from "@/server/site/site-env";
import { getSitemapPages } from "@/server/site/technical";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const queries = getSiteQueries();
  const context = await getSiteContext(queries, getSiteEnv(), themeConfig);
  const pages = await getSitemapPages(queries, context);
  return buildSitemap(context.env.siteUrl, pages);
}
