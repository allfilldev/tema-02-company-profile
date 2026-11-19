import { describe, expect, it } from "vitest";
import { CACHE_TAGS, entityTag } from "@/server/data/cache-tags";

describe("cache tags", () => {
  it("lists the module tags", () => {
    expect(CACHE_TAGS).toEqual({
      settings: "settings",
      home: "home",
      about: "about",
      vision: "vision",
      sectionIntros: "section-intros",
      legal: "legal",
      contentBlocks: "content-blocks",
      services: "services",
      portfolio: "portfolio",
      team: "team",
      stats: "stats",
      testimonials: "testimonials",
      partners: "partners",
      articles: "articles",
      media: "media",
      routeCatalog: "route-catalog",
    });
  });

  it.each([
    ["service", "a", "service:a"],
    ["portfolio", "b-c", "portfolio:b-c"],
    ["article", "x", "article:x"],
  ] as const)("builds the %s entity tag", (module, slug, expected) => {
    expect(entityTag(module, slug)).toBe(expected);
  });
});
