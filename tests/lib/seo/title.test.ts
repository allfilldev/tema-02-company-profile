import { describe, expect, it } from "vitest";
import { buildPageTitle, maxMetaTitleLength, titleSuffix } from "@/lib/seo/title";

describe("title helpers", () => {
  it("builds the suffix from the site name", () => {
    expect(titleSuffix("Nusa Karya")).toBe(" | Nusa Karya");
  });

  it("computes the longest allowed meta title", () => {
    expect(maxMetaTitleLength("Nusa Karya")).toBe(47);
  });

  it("never returns a negative length for a very long site name", () => {
    expect(maxMetaTitleLength("x".repeat(70))).toBe(0);
  });

  it("joins the title and the site name", () => {
    expect(buildPageTitle("Layanan", "Nusa Karya")).toBe("Layanan | Nusa Karya");
  });
});
