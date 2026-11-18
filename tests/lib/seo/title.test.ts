import { describe, expect, it } from "vitest";
import { buildPageTitle, fitPageTitle, maxMetaTitleLength, titleSuffix } from "@/lib/seo/title";

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

describe("fitPageTitle", () => {
  const siteName = "Nusa Karya";
  const suffix = " - Halaman 2";

  it("keeps the base title when the full title already fits", () => {
    expect(fitPageTitle("Artikel Website dan SEO", suffix, siteName)).toBe("Artikel Website dan SEO - Halaman 2");
  });

  it("cuts the base title at a word boundary until the full title fits", () => {
    const base = "Artikel Seputar Website dan SEO untuk Usaha";
    expect(base).toHaveLength(43);

    const fitted = fitPageTitle(base, suffix, siteName);
    const full = buildPageTitle(fitted, siteName);

    expect(full.length).toBeLessThanOrEqual(60);
    expect(full.length).toBeGreaterThanOrEqual(30);
    expect(fitted.endsWith(suffix)).toBe(true);
    expect(base.startsWith(fitted.slice(0, -suffix.length))).toBe(true);
    expect(fitted).toBe("Artikel Seputar Website dan SEO - Halaman 2");
  });

  it("strips trailing punctuation left by the cut", () => {
    expect(fitPageTitle("Panduan Website Perusahaan Modern, Cepat dan Aman", suffix, siteName)).toBe(
      "Panduan Website Perusahaan Modern - Halaman 2",
    );
  });

  it("cuts a single overlong word to fit", () => {
    const fitted = fitPageTitle("x".repeat(80), suffix, siteName);
    expect(buildPageTitle(fitted, siteName)).toHaveLength(60);
    expect(fitted.endsWith(suffix)).toBe(true);
  });

  it("returns only the suffix text when it leaves no room for the base", () => {
    expect(fitPageTitle("Artikel", suffix, "x".repeat(70))).toBe(suffix);
  });
});
