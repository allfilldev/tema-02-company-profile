import type { Repositories } from "@/core/domain/repositories";
import type { ContentPack } from "@/core/domain/content-pack/content-pack";

function sortBySortOrder<Item extends { sortOrder: number }>(items: Item[]): Item[] {
  return [...items].sort((left, right) => left.sortOrder - right.sortOrder);
}

function sortNewestFirst<Item extends { publishedAt: string }>(items: Item[]): Item[] {
  return [...items].sort((left, right) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt));
}

function findBySlug<Item extends { slug: string }>(items: Item[], slug: string): Item | null {
  return items.find((item) => item.slug === slug) ?? null;
}

export function createFixtureRepositories(pack: ContentPack): Repositories {
  return {
    siteSettings: {
      get: async () => pack.settings,
    },
    pageContent: {
      getHome: async () => pack.home,
      getAbout: async () => pack.about,
      getVision: async () => pack.vision,
      findSectionIntro: async (key) => pack.sectionIntros.find((intro) => intro.key === key) ?? null,
      findLegalPage: async (slug) => pack.legalPages.find((page) => page.slug === slug) ?? null,
    },
    services: {
      listPublished: async () => sortBySortOrder(pack.services),
      findPublishedBySlug: async (slug) => findBySlug(pack.services, slug),
    },
    portfolio: {
      listPublished: async () => sortBySortOrder(pack.portfolio),
      findPublishedBySlug: async (slug) => findBySlug(pack.portfolio, slug),
    },
    team: {
      listPublished: async () => sortBySortOrder(pack.team),
      findById: async (id) => pack.team.find((member) => member.id === id) ?? null,
    },
    stats: {
      list: async () => sortBySortOrder(pack.stats),
    },
    testimonials: {
      listPublished: async () => sortBySortOrder(pack.testimonials),
    },
    partners: {
      listPublished: async () => sortBySortOrder(pack.partners),
    },
    articles: {
      listPublished: async ({ offset, limit }) => {
        const newestFirst = sortNewestFirst(pack.articles);
        return { items: newestFirst.slice(offset, offset + limit), total: newestFirst.length };
      },
      listAllPublished: async () => sortNewestFirst(pack.articles),
      findPublishedBySlug: async (slug) => findBySlug(pack.articles, slug),
    },
    contentBlocks: {
      findPublishedByKey: async (key) => pack.contentBlocks.find((block) => block.key === key) ?? null,
    },
  };
}
