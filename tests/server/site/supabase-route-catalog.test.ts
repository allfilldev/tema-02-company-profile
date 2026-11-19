import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

describe("supabase route catalog timing", () => {
  it("keeps removed or renamed slugs reachable for at most ten seconds", async () => {
    const { CATALOG_TTL_MS } = await import("@/server/site/supabase-route-catalog");

    expect(CATALOG_TTL_MS).toBeLessThanOrEqual(10_000);
  });
});
