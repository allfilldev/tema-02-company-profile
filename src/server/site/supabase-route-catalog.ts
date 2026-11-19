import "server-only";
import { themeConfig } from "@/config/theme";
import { createPublicSupabaseClient } from "@/infrastructure/supabase/public-client";
import { fetchRouteCatalog } from "@/infrastructure/supabase/public-repositories";
import { createRouteCatalogMemo, type RouteCatalogMemo } from "@/server/site/route-catalog-memo";
import { toSiteRouteCatalog } from "@/server/site/route-catalog";
import { getSupabasePublicEnv } from "@/server/supabase/supabase-env";

export const CATALOG_TTL_MS = 10_000;
const CATALOG_MIN_REFRESH_MS = 5_000;

let memo: RouteCatalogMemo | null = null;

export function getSupabaseRouteCatalogMemo(): RouteCatalogMemo {
  memo ??= createRouteCatalogMemo({
    load: async () => {
      const data = await fetchRouteCatalog(createPublicSupabaseClient(getSupabasePublicEnv()));
      return toSiteRouteCatalog(data, themeConfig);
    },
    ttlMs: CATALOG_TTL_MS,
    minRefreshMs: CATALOG_MIN_REFRESH_MS,
    now: Date.now,
  });
  return memo;
}
