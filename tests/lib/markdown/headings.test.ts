import { describe, expect, it } from "vitest";
import { analyzeHeadings, extractHeadings } from "@/lib/markdown/headings";

const sample = "## Satu\n\n### Dua\n\n```\n# bukan heading\n```\n\n## Tiga\n\n#### Empat";

describe("extractHeadings", () => {
  it("returns ATX headings and ignores fenced code blocks", () => {
    expect(extractHeadings(sample)).toEqual([
      { level: 2, text: "Satu" },
      { level: 3, text: "Dua" },
      { level: 2, text: "Tiga" },
      { level: 4, text: "Empat" },
    ]);
  });

  it("ignores headings inside tilde fences", () => {
    expect(extractHeadings("~~~\n## palsu\n~~~\n\n## Asli")).toEqual([{ level: 2, text: "Asli" }]);
  });

  it("requires a space after the hashes", () => {
    expect(extractHeadings("#tag\n\n####### tujuh")).toEqual([]);
  });
});

describe("analyzeHeadings", () => {
  it("counts levels and detects skipped levels", () => {
    expect(analyzeHeadings(sample)).toEqual({ h1Count: 0, h2Count: 2, h3Count: 1, deepCount: 1, skipsLevel: true });
  });

  it("flags a first heading deeper than H2", () => {
    expect(analyzeHeadings("### Mulai\n\n## Lanjut").skipsLevel).toBe(true);
  });

  it("accepts an orderly structure", () => {
    expect(analyzeHeadings("# Judul\n\n## A\n\n### B")).toEqual({
      h1Count: 1,
      h2Count: 1,
      h3Count: 1,
      deepCount: 0,
      skipsLevel: false,
    });
  });

  it("handles empty markdown", () => {
    expect(analyzeHeadings("")).toEqual({ h1Count: 0, h2Count: 0, h3Count: 0, deepCount: 0, skipsLevel: false });
  });
});
