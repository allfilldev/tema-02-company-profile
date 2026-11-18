import { describe, expect, it } from "vitest";
import { countWords } from "@/lib/markdown/words";

describe("countWords", () => {
  it("counts prose words and skips code, images, and markdown symbols", () => {
    const markdown =
      "Halo **dunia** ini [tautan resmi](https://bps.go.id) ![gambar kantor](/a.webp)\n\n```\nkode di sini\n```\n\n- poin satu";
    expect(countWords(markdown)).toBe(7);
  });

  it("returns zero for empty markdown", () => {
    expect(countWords("")).toBe(0);
  });

  it("counts numeric tokens", () => {
    expect(countWords("Rp 1.500.000 untuk 3 bulan")).toBe(5);
  });
});
