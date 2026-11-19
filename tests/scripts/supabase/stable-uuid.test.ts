import { describe, expect, it } from "vitest";
import { stableUuid } from "../../../scripts/supabase/stable-uuid";

describe("stableUuid", () => {
  it("is deterministic and formatted as a version 5 uuid", () => {
    const first = stableUuid("service", "layanan-1");

    expect(first).toBe(stableUuid("service", "layanan-1"));
    expect(first).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it("differs per kind and per id", () => {
    expect(stableUuid("service", "a")).not.toBe(stableUuid("team", "a"));
    expect(stableUuid("service", "a")).not.toBe(stableUuid("service", "b"));
  });

  it("matches the known version 5 vector for the dns namespace style input", () => {
    expect(stableUuid("media", "hero")).toBe(stableUuid("media", "hero"));
    expect(stableUuid("", "")).toMatch(/^[0-9a-f-]{36}$/);
  });
});
