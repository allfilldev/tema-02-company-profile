import type { MetadataRoute } from "next";

const AI_CRAWLERS = ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "CCBot"] as const;
const PRIVATE_PATHS = ["/admin", "/api"];

function buildAllowRule(userAgent: string) {
  return { userAgent, allow: "/", disallow: [...PRIVATE_PATHS] };
}

export function buildRobots(site: { siteUrl: string; indexingEnabled: boolean }): MetadataRoute.Robots {
  if (!site.indexingEnabled) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [buildAllowRule("*"), ...AI_CRAWLERS.map(buildAllowRule)],
    sitemap: `${site.siteUrl.replace(/\/+$/, "")}/sitemap.xml`,
  };
}
