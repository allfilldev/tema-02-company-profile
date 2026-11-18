import { describe, expect, it } from "vitest";
import { isValidSlug, slugify } from "@/lib/text/slug";

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
