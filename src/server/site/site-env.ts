import { resolveIndexing, resolveSiteUrl } from "@/lib/seo/site-url";

export type SiteEnv = {
  siteUrl: string;
  indexingEnabled: boolean;
  isDemo: boolean;
};

const DEFAULT_DATA_SOURCE = "demo";

export function getSiteEnv(): SiteEnv {
  return {
    siteUrl: resolveSiteUrl(process.env.SITE_URL),
    indexingEnabled: resolveIndexing(process.env.SITE_INDEXING),
    isDemo: (process.env.DATA_SOURCE || DEFAULT_DATA_SOURCE) === "demo",
  };
}
