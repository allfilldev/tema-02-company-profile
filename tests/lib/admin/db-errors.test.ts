import { describe, expect, it } from "vitest";
import { duplicateFieldFrom } from "@/lib/admin/db-errors";

describe("duplicateFieldFrom", () => {
  it("names the slug field for a unique violation on a slug constraint", () => {
    const error = new Error('Supabase services: duplicate key value violates unique constraint "services_slug_key"');

    expect(duplicateFieldFrom(error)).toBe("slug");
  });

  it("names the key field for a unique violation on the stats key", () => {
    const error = new Error('Supabase stats: duplicate key value violates unique constraint "stats_key_key"');

    expect(duplicateFieldFrom(error)).toBe("key");
  });

  it("returns null for any other failure", () => {
    expect(duplicateFieldFrom(new Error("connection reset"))).toBeNull();
    expect(duplicateFieldFrom("duplicate key")).toBeNull();
  });
});
