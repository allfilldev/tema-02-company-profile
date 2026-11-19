import { describe, expect, it, vi } from "vitest";
import type { SiteRouteCatalog } from "@/lib/site/route-availability";
import { resolvePathAvailability } from "@/server/site/resolve-availability";

function catalog(serviceSlugs: string[]): SiteRouteCatalog {
  return { enabledModules: ["services", "portfolio", "articles"], serviceSlugs, portfolioSlugs: [], articleSlugs: [], articlePageCount: 1 };
}

describe("resolvePathAvailability", () => {
  it("is available without a refresh when the slug is known", async () => {
    const memo = { get: vi.fn(async () => catalog(["a"])), refresh: vi.fn(async () => null) };

    expect(await resolvePathAvailability("/layanan/a", memo)).toBe(true);
    expect(memo.refresh).not.toHaveBeenCalled();
  });

  it("re-fetches the catalog once before declaring a new slug missing", async () => {
    const memo = { get: vi.fn(async () => catalog(["a"])), refresh: vi.fn(async () => catalog(["a", "baru"])) };

    expect(await resolvePathAvailability("/layanan/baru", memo)).toBe(true);
    expect(memo.refresh).toHaveBeenCalledTimes(1);
  });

  it("is missing when the refresh still lacks the slug", async () => {
    const memo = { get: vi.fn(async () => catalog(["a"])), refresh: vi.fn(async () => catalog(["a"])) };

    expect(await resolvePathAvailability("/layanan/x", memo)).toBe(false);
  });

  it("is missing when the refresh is rate limited", async () => {
    const memo = { get: vi.fn(async () => catalog(["a"])), refresh: vi.fn(async () => null) };

    expect(await resolvePathAvailability("/layanan/x", memo)).toBe(false);
  });
});
