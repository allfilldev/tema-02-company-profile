import { describe, expect, it } from "vitest";
import { articlePageHref, parseArticlePageParam } from "@/lib/site/article-pages";

describe("parseArticlePageParam", () => {
  it.each([
    ["2", 2],
    ["3", 3],
    ["10", 10],
    ["123", 123],
  ])("accepts %s", (raw, expected) => {
    expect(parseArticlePageParam(raw)).toBe(expected);
  });

  it.each(["1", "0", "-2", "+2", "02", "002", "abc", "2.5", "2.0", " 2", "2 ", "", "2abc", "1e2", "0x2", "２"])(
    "rejects %j",
    (raw) => {
      expect(parseArticlePageParam(raw)).toBeNull();
    },
  );

  it("rejects numbers beyond the safe integer range", () => {
    expect(parseArticlePageParam("99999999999999999999")).toBeNull();
  });
});

describe("articlePageHref", () => {
  it("links the first page to the articles index", () => {
    expect(articlePageHref(1)).toBe("/artikel");
  });

  it("links later pages to the paginated route", () => {
    expect(articlePageHref(2)).toBe("/artikel/halaman/2");
    expect(articlePageHref(12)).toBe("/artikel/halaman/12");
  });
});
