import { describe, expect, it, vi } from "vitest";
import type { SiteRouteCatalog } from "@/lib/site/route-availability";
import { createRouteCatalogMemo } from "@/server/site/route-catalog-memo";

function catalog(slug: string): SiteRouteCatalog {
  return { enabledModules: ["services"], serviceSlugs: [slug], portfolioSlugs: [], articleSlugs: [], articlePageCount: 1 };
}

function setup() {
  let clock = 1_000_000;
  let version = 0;
  const load = vi.fn(async () => catalog(`v${++version}`));
  const memo = createRouteCatalogMemo({ load, ttlMs: 60_000, minRefreshMs: 5_000, now: () => clock });
  return { memo, load, advance: (ms: number) => (clock += ms) };
}

describe("createRouteCatalogMemo", () => {
  it("loads once within the ttl", async () => {
    const { memo, load, advance } = setup();

    await memo.get();
    advance(59_000);
    await memo.get();

    expect(load).toHaveBeenCalledTimes(1);
  });

  it("reloads after the ttl", async () => {
    const { memo, load, advance } = setup();

    await memo.get();
    advance(61_000);
    const next = await memo.get();

    expect(load).toHaveBeenCalledTimes(2);
    expect(next.serviceSlugs).toEqual(["v2"]);
  });

  it("refuses to refresh again within the minimum interval", async () => {
    const { memo, load, advance } = setup();

    await memo.get();
    advance(4_000);

    expect(await memo.refresh()).toBeNull();
    expect(load).toHaveBeenCalledTimes(1);
  });

  it("refreshes after the minimum interval and serves the new catalog afterwards", async () => {
    const { memo, load, advance } = setup();

    await memo.get();
    advance(6_000);
    const fresh = await memo.refresh();

    expect(fresh?.serviceSlugs).toEqual(["v2"]);
    expect(load).toHaveBeenCalledTimes(2);
    expect((await memo.get()).serviceSlugs).toEqual(["v2"]);
  });

  it("does not cache a failed load", async () => {
    const load = vi.fn().mockRejectedValueOnce(new Error("down")).mockResolvedValueOnce(catalog("ok"));
    const memo = createRouteCatalogMemo({ load, ttlMs: 60_000, minRefreshMs: 5_000, now: () => 0 });

    await expect(memo.get()).rejects.toThrow("down");
    expect((await memo.get()).serviceSlugs).toEqual(["ok"]);
  });
});
