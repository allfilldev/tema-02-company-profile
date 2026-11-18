import { describe, expect, it } from "vitest";
import { buildRobots } from "@/lib/seo/robots";

const SITE_URL = "https://nusakarya.example";

function getRules(robots: ReturnType<typeof buildRobots>) {
  return Array.isArray(robots.rules) ? robots.rules : [robots.rules];
}

describe("buildRobots", () => {
  it("disallows everything with exactly one rule and no sitemap when indexing is off", () => {
    const robots = buildRobots({ siteUrl: SITE_URL, indexingEnabled: false });

    expect(robots.rules).toEqual([{ userAgent: "*", disallow: "/" }]);
    expect("sitemap" in robots).toBe(false);
  });

  it("blocks admin and api for every crawler when indexing is on", () => {
    const rules = getRules(buildRobots({ siteUrl: SITE_URL, indexingEnabled: true }));
    const wildcard = rules.find((rule) => rule.userAgent === "*");

    expect(wildcard).toEqual({ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] });
  });

  it("allows the AI crawlers with the same rule when indexing is on", () => {
    const rules = getRules(buildRobots({ siteUrl: SITE_URL, indexingEnabled: true }));

    for (const crawler of ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "CCBot"]) {
      expect(rules).toContainEqual({ userAgent: crawler, allow: "/", disallow: ["/admin", "/api"] });
    }
    expect(rules).toHaveLength(6);
  });

  it("points the sitemap at the site url when indexing is on", () => {
    const robots = buildRobots({ siteUrl: SITE_URL, indexingEnabled: true });

    expect(robots.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });
});
