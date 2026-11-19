import { isSitePathAvailable } from "@/lib/site/route-availability";
import type { RouteCatalogMemo } from "@/server/site/route-catalog-memo";

export async function resolvePathAvailability(pathname: string, memo: RouteCatalogMemo): Promise<boolean> {
  const catalog = await memo.get();
  if (isSitePathAvailable(pathname, catalog)) {
    return true;
  }

  const fresh = await memo.refresh();
  return fresh ? isSitePathAvailable(pathname, fresh) : false;
}
