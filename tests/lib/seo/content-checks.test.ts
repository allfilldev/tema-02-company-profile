import { describe, expect, it } from "vitest";
import {
  hasBlockingErrors,
  runContentChecks,
  type ContentCheck,
  type ContentCheckId,
  type ContentCheckInput,
} from "@/lib/seo/content-checks";

function filler(wordCount: number): string {
  return Array.from({ length: wordCount }, () => "isi").join(" ");
}

function buildBody(): string {
  const linkParagraph =
    "Pelajari [penyusunan SOP](/layanan/penyusunan-sop), baca [artikel pertama](/artikel/a) dan [artikel kedua](/artikel/b), lalu rujuk [sumber resmi](https://www.bps.go.id/id).";
  const sections = [1, 2, 3, 4].map((index) => {
    const extra = index === 1 ? `\n\n${linkParagraph}` : "";
    return `## Bagian ${index}\n\n### Subbagian ${index}\n\n${filler(215)}${extra}`;
  });
  return sections.join("\n\n");
}

function validArticleInput(): ContentCheckInput {
  return {
    kind: "article",
    siteName: "Nusa Karya",
    metaTitle: "Cara Menyusun SOP Bisnis untuk UMKM",
    metaDescription: "d".repeat(140),
    slug: "cara-menyusun-sop-umkm",
    bodyMd: buildBody(),
    lead: filler(60),
    faqCount: 4,
    imageAlts: ["Tim meninjau dokumen SOP"],
  };
}

const byId = (checks: ContentCheck[], id: ContentCheckId) => checks.find((check) => check.id === id)!;

describe("runContentChecks", () => {
  it("passes every check for a well-formed article", () => {
    const checks = runContentChecks(validArticleInput());
    expect(checks.filter((check) => !check.passed)).toEqual([]);
    expect(hasBlockingErrors(checks)).toBe(false);
  });

  it("blocks a meta title that pushes the full title past 60 characters", () => {
    const checks = runContentChecks({ ...validArticleInput(), metaTitle: "a".repeat(48) });
    expect(byId(checks, "meta-title-length")).toMatchObject({ severity: "error", passed: false });
    expect(hasBlockingErrors(checks)).toBe(true);
  });

  it("blocks a full title shorter than 30 characters", () => {
    expect(byId(runContentChecks({ ...validArticleInput(), metaTitle: "SOP" }), "meta-title-length").passed).toBe(false);
  });

  it("blocks an empty meta title", () => {
    expect(byId(runContentChecks({ ...validArticleInput(), metaTitle: "  " }), "meta-title-length").passed).toBe(false);
  });

  it("fails cleanly when the site name leaves no room", () => {
    const check = byId(runContentChecks({ ...validArticleInput(), siteName: "x".repeat(70) }), "meta-title-length");
    expect(check.passed).toBe(false);
    expect(check.message).toContain("Nama situs terlalu panjang");
  });

  it("states the limits in Indonesian", () => {
    const check = byId(runContentChecks(validArticleInput()), "meta-title-length");
    expect(check.message).toBe("Meta title maksimal 47 karakter agar judul lengkap tetap 30–60 karakter.");
  });

  it.each([
    [119, false],
    [120, true],
    [155, true],
    [156, false],
  ])("meta description of %i chars passes=%s", (length, passed) => {
    const checks = runContentChecks({ ...validArticleInput(), metaDescription: "x".repeat(length) });
    expect(byId(checks, "meta-description-length").passed).toBe(passed);
  });

  it("blocks an invalid slug and an empty alt", () => {
    const checks = runContentChecks({ ...validArticleInput(), slug: "Cara_SOP", imageAlts: ["  "] });
    expect(byId(checks, "slug-format")).toMatchObject({ severity: "error", passed: false });
    expect(byId(checks, "image-alt")).toMatchObject({ severity: "error", passed: false });
  });

  it("warns about years and conjunctions in the slug", () => {
    const check = byId(runContentChecks({ ...validArticleInput(), slug: "sop-dan-kpi-2025" }), "slug-clean");
    expect(check).toMatchObject({ severity: "warning", passed: false });
  });

  it("does not treat a long number as a year", () => {
    expect(byId(runContentChecks({ ...validArticleInput(), slug: "sop-20251" }), "slug-clean").passed).toBe(true);
  });

  it("warns about an H1 or H4 in the body", () => {
    const input = validArticleInput();
    expect(byId(runContentChecks({ ...input, bodyMd: `# Judul\n\n${input.bodyMd}` }), "heading-structure").passed).toBe(false);
    expect(byId(runContentChecks({ ...input, bodyMd: `${input.bodyMd}\n\n#### Detail` }), "heading-structure").passed).toBe(false);
  });

  it("ignores headings inside code fences", () => {
    const input = validArticleInput();
    const bodyMd = `${input.bodyMd}\n\n\`\`\`\n# Komentar shell\n#### Lain\n\`\`\``;
    expect(byId(runContentChecks({ ...input, bodyMd }), "heading-structure").passed).toBe(true);
  });

  it("warns when the article is outside the word range", () => {
    const checks = runContentChecks({ ...validArticleInput(), bodyMd: "## A\n\n### B\n\nterlalu pendek" });
    expect(byId(checks, "word-count")).toMatchObject({ severity: "warning", passed: false });
    expect(byId(checks, "h2-count").passed).toBe(false);
  });

  it("warns about a missing or oversized lead", () => {
    expect(byId(runContentChecks({ ...validArticleInput(), lead: null }), "lead-length").passed).toBe(false);
    expect(byId(runContentChecks({ ...validArticleInput(), lead: filler(101) }), "lead-length").passed).toBe(false);
    expect(byId(runContentChecks({ ...validArticleInput(), lead: filler(49) }), "lead-length").passed).toBe(false);
  });

  it("warns when the FAQ count is out of range", () => {
    expect(byId(runContentChecks({ ...validArticleInput(), faqCount: 2 }), "faq-count").passed).toBe(false);
    expect(byId(runContentChecks({ ...validArticleInput(), faqCount: 7 }), "faq-count").passed).toBe(false);
  });

  it("warns when link counts are out of range", () => {
    const checks = runContentChecks({ ...validArticleInput(), bodyMd: "## A\n\n### B\n\nTanpa tautan." });
    expect(byId(checks, "internal-links").passed).toBe(false);
    expect(byId(checks, "outbound-links").passed).toBe(false);
  });

  it("does not block on warnings alone", () => {
    const checks = runContentChecks({ ...validArticleInput(), faqCount: 0 });
    expect(byId(checks, "faq-count").passed).toBe(false);
    expect(hasBlockingErrors(checks)).toBe(false);
  });

  it("skips article-only checks for services", () => {
    const ids = runContentChecks({ ...validArticleInput(), kind: "service", lead: null, faqCount: 0 }).map((check) => check.id);
    expect(ids).not.toContain("word-count");
    expect(ids).not.toContain("h2-count");
    expect(ids).not.toContain("lead-length");
    expect(ids).not.toContain("faq-count");
    expect(ids).not.toContain("internal-links");
    expect(ids).not.toContain("outbound-links");
  });
});
