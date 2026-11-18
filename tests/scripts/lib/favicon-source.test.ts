import { describe, expect, it } from "vitest";
import { assertSquareFaviconSource, FAVICON_MAX_ASPECT_RATIO } from "../../../scripts/lib/favicon-source";

describe("assertSquareFaviconSource", () => {
  it("allows a ratio of at most 1.1", () => {
    expect(FAVICON_MAX_ASPECT_RATIO).toBe(1.1);
    expect(() => assertSquareFaviconSource(512, 512)).not.toThrow();
    expect(() => assertSquareFaviconSource(520, 500)).not.toThrow();
  });

  it.each([
    [600, 200],
    [200, 600],
    [0, 100],
    [100, 0],
  ])("rejects %ix%i", (width, height) => {
    expect(() => assertSquareFaviconSource(width, height)).toThrow(/square/);
  });
});
