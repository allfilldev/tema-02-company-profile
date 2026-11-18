import { describe, expect, it } from "vitest";
import { OG_IMAGE_CONTENT_TYPE, OG_IMAGE_SIZE, OG_TITLE_MAX_LENGTH, fitOgTitle } from "@/lib/seo/og";

describe("OG image constants", () => {
  it("uses the 1200x630 png format", () => {
    expect(OG_IMAGE_SIZE).toEqual({ width: 1200, height: 630 });
    expect(OG_IMAGE_CONTENT_TYPE).toBe("image/png");
  });
});

describe("fitOgTitle", () => {
  it("keeps a short title and gives it the largest font", () => {
    expect(fitOgTitle("Penyusunan SOP")).toEqual({ text: "Penyusunan SOP", fontSize: 80 });
  });

  it("collapses whitespace and line breaks", () => {
    expect(fitOgTitle("  Satu \n  dua   tiga ").text).toBe("Satu dua tiga");
  });

  it("uses smaller fonts for longer titles", () => {
    const medium = fitOgTitle("a".repeat(60));
    const long = fitOgTitle("a".repeat(100));

    expect(medium.fontSize).toBe(64);
    expect(long.fontSize).toBe(52);
  });

  it("truncates at a word boundary with an ellipsis and never exceeds the limit", () => {
    const words = Array.from({ length: 60 }, (_, index) => `kata${index}`).join(" ");
    const result = fitOgTitle(words);

    expect(result.text.length).toBeLessThanOrEqual(OG_TITLE_MAX_LENGTH);
    expect(result.text.endsWith("...")).toBe(true);
    expect(words.startsWith(result.text.slice(0, -3))).toBe(true);
    expect(result.text.slice(0, -3).endsWith(" ")).toBe(false);
  });

  it("hard-cuts a single unbroken word that is too long", () => {
    const result = fitOgTitle("x".repeat(400));

    expect(result.text).toBe(`${"x".repeat(OG_TITLE_MAX_LENGTH - 3)}...`);
  });

  it("does not truncate a title at exactly the limit", () => {
    const exact = "y".repeat(OG_TITLE_MAX_LENGTH);

    expect(fitOgTitle(exact).text).toBe(exact);
    expect(fitOgTitle(`${exact}y`).text).not.toBe(`${exact}y`);
  });
});
