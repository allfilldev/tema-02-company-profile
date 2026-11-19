import type { SiteRouteCatalog } from "@/lib/site/route-availability";

export type RouteCatalogMemoOptions = {
  load: () => Promise<SiteRouteCatalog>;
  ttlMs: number;
  minRefreshMs: number;
  now: () => number;
};

export type RouteCatalogMemo = {
  get(): Promise<SiteRouteCatalog>;
  refresh(): Promise<SiteRouteCatalog | null>;
};

export function createRouteCatalogMemo({ load, ttlMs, minRefreshMs, now }: RouteCatalogMemoOptions): RouteCatalogMemo {
  let value: SiteRouteCatalog | null = null;
  let loadedAt = 0;
  let inflight: Promise<SiteRouteCatalog> | null = null;

  function reload(): Promise<SiteRouteCatalog> {
    if (!inflight) {
      inflight = load()
        .then((catalog) => {
          value = catalog;
          loadedAt = now();
          return catalog;
        })
        .finally(() => {
          inflight = null;
        });
    }
    return inflight;
  }

  return {
    async get() {
      if (value && now() - loadedAt < ttlMs) {
        return value;
      }
      return reload();
    },
    async refresh() {
      if (value && now() - loadedAt < minRefreshMs) {
        return null;
      }
      return reload();
    },
  };
}
