import { describe, expect, it } from "vitest";
import { parseArticlePageParam } from "@/lib/site/article-pages";
import { buildArticlePageStaticParams, buildSlugStaticParams, PLACEHOLDER_SLUG } from "@/lib/site/static-params";

describe("buildSlugStaticParams", () => {
  it("maps every real slug and adds no placeholder", () => {
    expect(buildSlugStaticParams(["pembuatan-website", "desain-identitas-merek"])).toEqual([
      { slug: "pembuatan-website" },
      { slug: "desain-identitas-merek" },
    ]);
  });

  it("returns exactly one placeholder when the list is empty so Cache Components never gets an empty array", () => {
    expect(buildSlugStaticParams([])).toEqual([{ slug: PLACEHOLDER_SLUG }]);
  });

  it("never lets the placeholder shadow a real slug when slugs exist", () => {
    expect(buildSlugStaticParams([PLACEHOLDER_SLUG, "a"])).toEqual([{ slug: PLACEHOLDER_SLUG }, { slug: "a" }]);
  });
});

describe("buildArticlePageStaticParams", () => {
  it.each([
    [2, ["2"]],
    [3, ["2", "3"]],
    [5, ["2", "3", "4", "5"]],
  ])("lists pages 2..%i as strings", (pageCount, expected) => {
    expect(buildArticlePageStaticParams(pageCount)).toEqual(expected.map((n) => ({ n })));
  });

  it.each([1, 0, -1])("returns the single placeholder page 2 when pageCount is %i", (pageCount) => {
    expect(buildArticlePageStaticParams(pageCount)).toEqual([{ n: "2" }]);
  });

  it("only produces values that parseArticlePageParam accepts", () => {
    for (const pageCount of [0, 1, 2, 4]) {
      for (const { n } of buildArticlePageStaticParams(pageCount)) {
        expect(parseArticlePageParam(n)).not.toBeNull();
      }
    }
  });
});
