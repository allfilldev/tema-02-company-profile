import { describe, expect, it } from "vitest";
import { CACHE_TAGS } from "@/server/data/cache-tags";
import { tagsForAdminChange } from "@/server/data/revalidation-tags";

describe("tagsForAdminChange", () => {
  it("refreshes the module, each affected entity, and the route catalog for a service", () => {
    expect(tagsForAdminChange({ kind: "collection", affected: { module: "services", slugs: ["lama", "baru"] } })).toEqual([
      "services",
      "service:lama",
      "service:baru",
      "route-catalog",
    ]);
  });

  it("covers portfolio and articles the same way", () => {
    expect(tagsForAdminChange({ kind: "collection", affected: { module: "portfolio", slugs: ["p"] } })).toEqual(["portfolio", "portfolio:p", "route-catalog"]);
    expect(tagsForAdminChange({ kind: "collection", affected: { module: "articles", slugs: ["a"] } })).toEqual(["articles", "article:a", "route-catalog"]);
  });

  it("refreshes the articles too when the team changes because author boxes show members", () => {
    expect(tagsForAdminChange({ kind: "collection", affected: { module: "team", slugs: [] } })).toEqual(["team", "articles"]);
  });

  it("keeps the simple modules to their own tag", () => {
    expect(tagsForAdminChange({ kind: "collection", affected: { module: "stats", slugs: [] } })).toEqual(["stats"]);
    expect(tagsForAdminChange({ kind: "collection", affected: { module: "testimonials", slugs: [] } })).toEqual(["testimonials"]);
    expect(tagsForAdminChange({ kind: "collection", affected: { module: "partners", slugs: [] } })).toEqual(["partners"]);
  });

  it("refreshes every tag when the settings change because the site name is on every page", () => {
    expect([...tagsForAdminChange({ kind: "settings" })].sort()).toEqual(Object.values(CACHE_TAGS).sort());
  });

  it("refreshes the media tag alone for a media change", () => {
    expect(tagsForAdminChange({ kind: "media" })).toEqual(["media"]);
  });

  it("never lists a tag twice", () => {
    const tags = tagsForAdminChange({ kind: "collection", affected: { module: "services", slugs: ["a", "a"] } });

    expect(new Set(tags).size).toBe(tags.length);
  });
});
