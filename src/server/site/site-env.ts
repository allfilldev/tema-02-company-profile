import { resolveIndexing, resolveSiteUrl, shouldRequireExplicitSiteUrl } from "@/lib/seo/site-url";

export type SiteEnv = {
  siteUrl: string;
  indexingEnabled: boolean;
  isDemo: boolean;
};

const DEFAULT_DATA_SOURCE = "demo";

export function getSiteEnv(): SiteEnv {
  const indexingEnabled = resolveIndexing(process.env.SITE_INDEXING);
  const requireExplicit = shouldRequireExplicitSiteUrl(process.env.NODE_ENV, indexingEnabled);

  return {
    siteUrl: resolveSiteUrl(process.env.SITE_URL, { requireExplicit }),
    indexingEnabled,
    isDemo: (process.env.DATA_SOURCE || DEFAULT_DATA_SOURCE) === "demo",
  };
}
