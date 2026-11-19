import { createSiteQueries, type SiteQueries } from "@/core/application/site/site-queries";
import type { ContentPack } from "@/core/domain/content-pack/content-pack";
import { themeConfig } from "@/config/theme";
import { CONTENT_PACKS } from "@/content/packs";
import { createFixtureRepositories } from "@/infrastructure/fixtures/fixture-repositories";
import { createCachedSupabaseRepositories } from "@/server/data/cached-repositories";

const DEFAULT_DATA_SOURCE = "demo";

function createDemoSiteQueries(): SiteQueries {
  const pack: ContentPack | undefined = CONTENT_PACKS[themeConfig.contentPack];
  if (!pack) {
    throw new Error(`Content pack "${themeConfig.contentPack}" is not registered in CONTENT_PACKS`);
  }
  return createSiteQueries(createFixtureRepositories(pack), themeConfig);
}

export function getSiteQueries(): SiteQueries {
  const dataSource = process.env.DATA_SOURCE || DEFAULT_DATA_SOURCE;

  if (dataSource === "demo") {
    return createDemoSiteQueries();
  }
  if (dataSource === "supabase") {
    return createSiteQueries(createCachedSupabaseRepositories(), themeConfig);
  }
  throw new Error(`Unknown DATA_SOURCE "${dataSource}", expected "demo" or "supabase"`);
}
