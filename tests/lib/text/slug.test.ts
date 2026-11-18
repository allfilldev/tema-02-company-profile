import { describe, expect, it } from "vitest";
import { isReservedArticleSlug, isValidSlug, RESERVED_ARTICLE_SLUGS, slugify } from "@/lib/text/slug";

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Jasa Pembuatan Website Company Profile")).toBe("jasa-pembuatan-website-company-profile");
  });
  it("drops symbols and collapses separators", () => {
    expect(slugify("  Desain & Branding — 2024! ")).toBe("desain-branding-2024");
  });
  it("strips diacritics", () => {
    expect(slugify("Kafé Ölçü")).toBe("kafe-olcu");
  });
});

describe("isValidSlug", () => {
  it("accepts lowercase hyphenated words", () => {
    expect(isValidSlug("layanan-desain")).toBe(true);
  });
  it.each(["Layanan-Desain", "layanan--desain", "-layanan", "layanan-", "layanan_desain", ""])("rejects %s", (slug) => {
    expect(isValidSlug(slug)).toBe(false);
  });
});

describe("isReservedArticleSlug", () => {
  it("reserves the pagination segment", () => {
    expect(RESERVED_ARTICLE_SLUGS).toEqual(["halaman"]);
    expect(isReservedArticleSlug("halaman")).toBe(true);
  });
  it("allows slugs that merely start with a reserved word", () => {
    expect(isReservedArticleSlug("halaman-baru")).toBe(false);
  });
});
