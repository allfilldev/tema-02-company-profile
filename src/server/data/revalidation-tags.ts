import type { AffectedContent } from "@/core/application/admin/admin-result";
import type { AdminModule } from "@/core/domain/admin/records";
import { CACHE_TAGS, entityTag, type EntityTagModule } from "@/server/data/cache-tags";

export type AdminChange =
  | { kind: "collection"; affected: AffectedContent }
  | { kind: "settings" }
  | { kind: "media" };

const MODULE_TAGS: Record<AdminModule, string[]> = {
  services: [CACHE_TAGS.services],
  portfolio: [CACHE_TAGS.portfolio],
  team: [CACHE_TAGS.team, CACHE_TAGS.articles],
  stats: [CACHE_TAGS.stats],
  testimonials: [CACHE_TAGS.testimonials],
  partners: [CACHE_TAGS.partners],
  articles: [CACHE_TAGS.articles],
};

const ENTITY_MODULES: Partial<Record<AdminModule, EntityTagModule>> = {
  services: "service",
  portfolio: "portfolio",
  articles: "article",
};

function collectionTags({ module, slugs }: AffectedContent): string[] {
  const entityModule = ENTITY_MODULES[module];
  if (!entityModule) {
    return MODULE_TAGS[module];
  }
  return [...MODULE_TAGS[module], ...slugs.map((slug) => entityTag(entityModule, slug)), CACHE_TAGS.routeCatalog];
}

export function tagsForAdminChange(change: AdminChange): string[] {
  const tags =
    change.kind === "collection"
      ? collectionTags(change.affected)
      : change.kind === "settings"
        ? Object.values(CACHE_TAGS)
        : [CACHE_TAGS.media];

  return [...new Set(tags)];
}
