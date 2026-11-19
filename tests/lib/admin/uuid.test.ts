import { describe, expect, it } from "vitest";
import { isUuid } from "@/lib/admin/uuid";

describe("isUuid", () => {
  it("accepts a canonical uuid", () => {
    expect(isUuid("3f2b8c1e-9a4d-4c6e-8b1f-0a2d3e4f5a6b")).toBe(true);
  });

  it("rejects anything else", () => {
    expect(isUuid("xyz")).toBe(false);
    expect(isUuid("")).toBe(false);
    expect(isUuid("3f2b8c1e-9a4d-4c6e-8b1f-0a2d3e4f5a6b-extra")).toBe(false);
  });
});
