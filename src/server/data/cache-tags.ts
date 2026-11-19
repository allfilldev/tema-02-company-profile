export const CACHE_TAGS = {
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
} as const;

export type EntityTagModule = "service" | "portfolio" | "article";

export function entityTag(module: EntityTagModule, slug: string): string {
  return `${module}:${slug}`;
}
