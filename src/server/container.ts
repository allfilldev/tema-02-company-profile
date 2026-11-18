import { createSiteQueries, type SiteQueries } from "@/core/application/site/site-queries";
import type { ContentPack } from "@/core/domain/content-pack/content-pack";
import { themeConfig } from "@/config/theme";
import { CONTENT_PACKS } from "@/content/packs";
import { createFixtureRepositories } from "@/infrastructure/fixtures/fixture-repositories";

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
    throw new Error("DATA_SOURCE=supabase is not available yet");
  }
  throw new Error(`Unknown DATA_SOURCE "${dataSource}", expected "demo" or "supabase"`);
}
