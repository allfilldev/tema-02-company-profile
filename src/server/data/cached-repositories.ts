import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { Article } from "@/core/domain/article/article";
import type { ContentBlock } from "@/core/domain/content-block/content-block";
import type { AboutContent } from "@/core/domain/page/about-content";
import type { CompanyVision } from "@/core/domain/page/company-vision";
import type { HomeContent } from "@/core/domain/page/home-content";
import type { LegalPage, LegalSlug } from "@/core/domain/page/legal-page";
import type { SectionIntro } from "@/core/domain/page/section-intro";
import type { Partner } from "@/core/domain/partner/partner";
import type { PortfolioItem } from "@/core/domain/portfolio/portfolio-item";
import type { Repositories } from "@/core/domain/repositories";
import type { Service } from "@/core/domain/service/service";
import type { SiteSettings } from "@/core/domain/settings/site-settings";
import type { SectionKey } from "@/core/domain/shared/section-key";
import type { Stat } from "@/core/domain/stat/stat";
import type { TeamMember } from "@/core/domain/team/team-member";
import type { Testimonial } from "@/core/domain/testimonial/testimonial";
import { createPublicSupabaseClient } from "@/infrastructure/supabase/public-client";
import { createSupabaseRepositories } from "@/infrastructure/supabase/public-repositories";
import { CACHE_TAGS, entityTag } from "@/server/data/cache-tags";
import { getSupabasePublicEnv } from "@/server/supabase/supabase-env";

const PUBLIC_CACHE_LIFE = { stale: 300, revalidate: 3600, expire: 604800 };

function readRepositories(): Repositories {
  return createSupabaseRepositories(createPublicSupabaseClient(getSupabasePublicEnv()));
}

async function loadSettings(): Promise<SiteSettings> {
  "use cache";
  cacheLife(PUBLIC_CACHE_LIFE);
  cacheTag(CACHE_TAGS.settings);
  return readRepositories().siteSettings.get();
}

async function loadHome(): Promise<HomeContent> {
  "use cache";
  cacheLife(PUBLIC_CACHE_LIFE);
  cacheTag(CACHE_TAGS.home);
  return readRepositories().pageContent.getHome();
}

async function loadAbout(): Promise<AboutContent> {
  "use cache";
  cacheLife(PUBLIC_CACHE_LIFE);
  cacheTag(CACHE_TAGS.about);
  return readRepositories().pageContent.getAbout();
}

async function loadVision(): Promise<CompanyVision> {
  "use cache";
  cacheLife(PUBLIC_CACHE_LIFE);
  cacheTag(CACHE_TAGS.vision);
  return readRepositories().pageContent.getVision();
}

async function loadSectionIntro(key: SectionKey): Promise<SectionIntro | null> {
  "use cache";
  cacheLife(PUBLIC_CACHE_LIFE);
  cacheTag(CACHE_TAGS.sectionIntros);
  return readRepositories().pageContent.findSectionIntro(key);
}

async function loadLegalPage(slug: LegalSlug): Promise<LegalPage | null> {
  "use cache";
  cacheLife(PUBLIC_CACHE_LIFE);
  cacheTag(CACHE_TAGS.legal);
  return readRepositories().pageContent.findLegalPage(slug);
}

async function loadServices(): Promise<Service[]> {
  "use cache";
  cacheLife(PUBLIC_CACHE_LIFE);
  cacheTag(CACHE_TAGS.services);
  return readRepositories().services.listPublished();
}

async function loadService(slug: string): Promise<Service | null> {
  "use cache";
  cacheLife(PUBLIC_CACHE_LIFE);
  cacheTag(CACHE_TAGS.services, entityTag("service", slug));
  return readRepositories().services.findPublishedBySlug(slug);
}

async function loadPortfolio(): Promise<PortfolioItem[]> {
  "use cache";
  cacheLife(PUBLIC_CACHE_LIFE);
  cacheTag(CACHE_TAGS.portfolio);
  return readRepositories().portfolio.listPublished();
}

async function loadPortfolioItem(slug: string): Promise<PortfolioItem | null> {
  "use cache";
  cacheLife(PUBLIC_CACHE_LIFE);
  cacheTag(CACHE_TAGS.portfolio, entityTag("portfolio", slug));
  return readRepositories().portfolio.findPublishedBySlug(slug);
}

async function loadTeam(): Promise<TeamMember[]> {
  "use cache";
  cacheLife(PUBLIC_CACHE_LIFE);
  cacheTag(CACHE_TAGS.team);
  return readRepositories().team.listPublished();
}

async function loadTeamMember(id: string): Promise<TeamMember | null> {
  "use cache";
  cacheLife(PUBLIC_CACHE_LIFE);
  cacheTag(CACHE_TAGS.team);
  return readRepositories().team.findById(id);
}

async function loadStats(): Promise<Stat[]> {
  "use cache";
  cacheLife(PUBLIC_CACHE_LIFE);
  cacheTag(CACHE_TAGS.stats);
  return readRepositories().stats.list();
}

async function loadTestimonials(): Promise<Testimonial[]> {
  "use cache";
  cacheLife(PUBLIC_CACHE_LIFE);
  cacheTag(CACHE_TAGS.testimonials);
  return readRepositories().testimonials.listPublished();
}

async function loadPartners(): Promise<Partner[]> {
  "use cache";
  cacheLife(PUBLIC_CACHE_LIFE);
  cacheTag(CACHE_TAGS.partners);
  return readRepositories().partners.listPublished();
}

async function loadArticlePage(offset: number, limit: number): Promise<{ items: Article[]; total: number }> {
  "use cache";
  cacheLife(PUBLIC_CACHE_LIFE);
  cacheTag(CACHE_TAGS.articles);
  return readRepositories().articles.listPublished({ offset, limit });
}

async function loadAllArticles(): Promise<Article[]> {
  "use cache";
  cacheLife(PUBLIC_CACHE_LIFE);
  cacheTag(CACHE_TAGS.articles);
  return readRepositories().articles.listAllPublished();
}

async function loadArticle(slug: string): Promise<Article | null> {
  "use cache";
  cacheLife(PUBLIC_CACHE_LIFE);
  cacheTag(CACHE_TAGS.articles, entityTag("article", slug));
  return readRepositories().articles.findPublishedBySlug(slug);
}

async function loadContentBlock(key: string): Promise<ContentBlock | null> {
  "use cache";
  cacheLife(PUBLIC_CACHE_LIFE);
  cacheTag(CACHE_TAGS.contentBlocks);
  return readRepositories().contentBlocks.findPublishedByKey(key);
}

export function createCachedSupabaseRepositories(): Repositories {
  return {
    siteSettings: { get: () => loadSettings() },
    pageContent: {
      getHome: () => loadHome(),
      getAbout: () => loadAbout(),
      getVision: () => loadVision(),
      findSectionIntro: (key) => loadSectionIntro(key),
      findLegalPage: (slug) => loadLegalPage(slug),
    },
    services: {
      listPublished: () => loadServices(),
      findPublishedBySlug: (slug) => loadService(slug),
    },
    portfolio: {
      listPublished: () => loadPortfolio(),
      findPublishedBySlug: (slug) => loadPortfolioItem(slug),
    },
    team: {
      listPublished: () => loadTeam(),
      findById: (id) => loadTeamMember(id),
    },
    stats: { list: () => loadStats() },
    testimonials: { listPublished: () => loadTestimonials() },
    partners: { listPublished: () => loadPartners() },
    articles: {
      listPublished: ({ offset, limit }) => loadArticlePage(offset, limit),
      listAllPublished: () => loadAllArticles(),
      findPublishedBySlug: (slug) => loadArticle(slug),
    },
    contentBlocks: { findPublishedByKey: (key) => loadContentBlock(key) },
  };
}
