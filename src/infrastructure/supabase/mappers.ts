import type { Article } from "@/core/domain/article/article";
import type { ContentBlock, ContentBlockItem } from "@/core/domain/content-block/content-block";
import type { AboutContent } from "@/core/domain/page/about-content";
import type { CompanyVision } from "@/core/domain/page/company-vision";
import type { HomeContent } from "@/core/domain/page/home-content";
import { LEGAL_SLUGS, type LegalPage, type LegalSlug } from "@/core/domain/page/legal-page";
import type { SectionIntro } from "@/core/domain/page/section-intro";
import type { Partner } from "@/core/domain/partner/partner";
import type { PortfolioItem } from "@/core/domain/portfolio/portfolio-item";
import type { Service } from "@/core/domain/service/service";
import type { SiteSettings } from "@/core/domain/settings/site-settings";
import type { CallToAction } from "@/core/domain/shared/call-to-action";
import type { FaqItem } from "@/core/domain/shared/faq-item";
import type { MediaAsset } from "@/core/domain/shared/media-asset";
import { SECTION_KEYS, type SectionKey } from "@/core/domain/shared/section-key";
import type { Stat } from "@/core/domain/stat/stat";
import type { TeamMember } from "@/core/domain/team/team-member";
import type { Testimonial } from "@/core/domain/testimonial/testimonial";
import type {
  AboutContentRow,
  ArticleRow,
  CompanyValueRow,
  CompanyVisionRow,
  ContentBlockItemRow,
  ContentBlockRow,
  HomeContentRow,
  LegalPageRow,
  MediaRow,
  MissionItemRow,
  PartnerRow,
  PortfolioRow,
  SectionIntroRow,
  ServiceRow,
  SiteSettingsRow,
  StatRow,
  TeamMemberRow,
  TestimonialRow,
} from "@/infrastructure/supabase/rows";

export type MediaMap = ReadonlyMap<string, MediaAsset>;

export function toMediaAsset(row: MediaRow): MediaAsset {
  return { id: row.id, url: row.url, alt: row.alt, width: row.width, height: row.height };
}

export function collectMediaIds(rows: readonly Record<string, unknown>[]): string[] {
  const ids = new Set<string>();
  for (const row of rows) {
    for (const [column, value] of Object.entries(row)) {
      if ((column === "media_id" || column.endsWith("_media_id")) && typeof value === "string") {
        ids.add(value);
      }
      if (column === "gallery_media_ids" && Array.isArray(value)) {
        value.filter((id): id is string => typeof id === "string").forEach((id) => ids.add(id));
      }
    }
  }
  return [...ids];
}

function fail(table: string, id: string, column: string): never {
  throw new Error(`Invalid ${table} row ${id}: ${column} is missing or malformed`);
}

function required<T>(value: T | null | undefined, table: string, id: string, column: string): T {
  if (value === null || value === undefined || value === "") {
    return fail(table, id, column);
  }
  return value;
}

function mediaFor(media: MediaMap, id: string | null): MediaAsset | null {
  return id ? (media.get(id) ?? null) : null;
}

function parseFaq(value: unknown, table: string, id: string): FaqItem[] {
  if (!Array.isArray(value)) {
    return fail(table, id, "faq");
  }
  return value.map((item) => {
    if (!item || typeof item.question !== "string" || typeof item.answer !== "string") {
      return fail(table, id, "faq");
    }
    return { question: item.question, answer: item.answer };
  });
}

function parseStringArray(value: unknown, table: string, id: string, column: string): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    return fail(table, id, column);
  }
  return value as string[];
}

function parseSocialLinks(value: unknown): SiteSettings["socialLinks"] {
  if (!Array.isArray(value)) {
    return fail("site_settings", "singleton", "social_links");
  }
  return value.map((item) => {
    if (!item || typeof item.platform !== "string" || typeof item.url !== "string") {
      return fail("site_settings", "singleton", "social_links");
    }
    return { platform: item.platform, url: item.url };
  });
}

function toCallToAction(label: string | null, href: string | null): CallToAction | null {
  return label && href ? { label, href } : null;
}

export function toSiteSettings(row: SiteSettingsRow, media: MediaMap): SiteSettings {
  return {
    siteName: row.site_name,
    tagline: row.tagline,
    logo: mediaFor(media, row.logo_media_id),
    defaultOgImage: mediaFor(media, row.default_og_media_id),
    email: row.email,
    phone: row.phone,
    whatsappNumber: row.whatsapp_number,
    whatsappMessage: row.whatsapp_message,
    address: {
      street: row.address_street,
      city: row.address_city,
      region: row.address_region,
      postalCode: row.postal_code,
      country: row.address_country,
    },
    mapsEmbedUrl: row.maps_embed_url,
    openingHours: row.opening_hours,
    socialLinks: parseSocialLinks(row.social_links),
    schemaType: row.schema_type,
    foundedYear: row.founded_year,
    googleSiteVerification: row.google_site_verification,
    gaMeasurementId: row.ga_measurement_id,
    updatedAt: row.updated_at,
  };
}

export function toHomeContent(row: HomeContentRow, media: MediaMap): HomeContent {
  return {
    heroEyebrow: row.hero_eyebrow,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    heroTitle: row.hero_title,
    heroSubtitle: row.hero_subtitle,
    heroImage: mediaFor(media, row.hero_media_id),
    primaryCta: toCallToAction(row.hero_primary_cta_label, row.hero_primary_cta_href),
    secondaryCta: toCallToAction(row.hero_secondary_cta_label, row.hero_secondary_cta_href),
    updatedAt: row.updated_at,
  };
}

export function toSectionIntro(row: SectionIntroRow): SectionIntro {
  if (!(SECTION_KEYS as readonly string[]).includes(row.section_key)) {
    return fail("section_intros", row.section_key, "section_key");
  }
  return {
    key: row.section_key as SectionKey,
    eyebrow: row.eyebrow,
    title: row.title,
    description: row.description,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
  };
}

export function toAboutContent(row: AboutContentRow, media: MediaMap): AboutContent {
  return {
    summary: row.summary,
    bodyMd: row.body_md,
    image: mediaFor(media, row.media_id),
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    updatedAt: row.updated_at,
  };
}

export function toCompanyVision(
  row: CompanyVisionRow,
  missions: readonly MissionItemRow[],
  values: readonly CompanyValueRow[],
): CompanyVision {
  return {
    vision: row.vision,
    missions: [...missions].sort((a, b) => a.sort_order - b.sort_order).map((mission) => mission.content),
    values: [...values]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((value) => ({ title: value.title, description: value.description })),
  };
}

export function toLegalPage(row: LegalPageRow): LegalPage {
  if (!(LEGAL_SLUGS as readonly string[]).includes(row.slug)) {
    return fail("legal_pages", row.slug, "slug");
  }
  if (!Array.isArray(row.sections)) {
    return fail("legal_pages", row.slug, "sections");
  }
  return {
    slug: row.slug as LegalSlug,
    title: row.title,
    intro: row.intro,
    sections: row.sections.map((section) => {
      if (!section || typeof section.heading !== "string" || typeof section.body_md !== "string") {
        return fail("legal_pages", row.slug, "sections");
      }
      return { heading: section.heading, bodyMd: section.body_md };
    }),
    metaDescription: row.meta_description,
    updatedAt: row.updated_at,
  };
}

export function toService(row: ServiceRow, media: MediaMap): Service {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: required(row.summary, "services", row.id, "summary"),
    bodyMd: row.body_md,
    cover: mediaFor(media, row.cover_media_id),
    metaTitle: required(row.meta_title, "services", row.id, "meta_title"),
    metaDescription: required(row.meta_description, "services", row.id, "meta_description"),
    faq: parseFaq(row.faq, "services", row.id),
    sortOrder: row.sort_order,
    updatedAt: row.updated_at,
  };
}

export function toPortfolioItem(row: PortfolioRow, media: MediaMap): PortfolioItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    clientName: required(row.client_name, "portfolio_items", row.id, "client_name"),
    category: required(row.category, "portfolio_items", row.id, "category"),
    summary: required(row.summary, "portfolio_items", row.id, "summary"),
    bodyMd: row.body_md,
    cover: mediaFor(media, row.cover_media_id),
    gallery: row.gallery_media_ids.flatMap((id) => {
      const asset = media.get(id);
      return asset ? [asset] : [];
    }),
    completedOn: row.completed_on,
    metaTitle: required(row.meta_title, "portfolio_items", row.id, "meta_title"),
    metaDescription: required(row.meta_description, "portfolio_items", row.id, "meta_description"),
    sortOrder: row.sort_order,
    updatedAt: row.updated_at,
  };
}

export function toTeamMember(row: TeamMemberRow, media: MediaMap): TeamMember {
  return {
    id: row.id,
    name: row.name,
    jobTitle: required(row.job_title, "team_members", row.id, "job_title"),
    bio: required(row.bio, "team_members", row.id, "bio"),
    photo: mediaFor(media, row.photo_media_id),
    yearsExperience: row.years_experience,
    profiles: parseStringArray(row.profiles, "team_members", row.id, "profiles"),
    sortOrder: row.sort_order,
  };
}

export function toStat(row: StatRow): Stat {
  return { key: row.key, label: row.label, value: row.value, suffix: row.suffix, sortOrder: row.sort_order };
}

export function toTestimonial(row: TestimonialRow, media: MediaMap): Testimonial {
  return {
    id: row.id,
    name: row.name,
    jobTitle: required(row.job_title, "testimonials", row.id, "job_title"),
    company: required(row.company, "testimonials", row.id, "company"),
    quote: required(row.quote, "testimonials", row.id, "quote"),
    photo: mediaFor(media, row.photo_media_id),
    sortOrder: row.sort_order,
  };
}

export function toPartner(row: PartnerRow, media: MediaMap): Partner {
  return {
    id: row.id,
    name: row.name,
    logo: mediaFor(media, row.logo_media_id),
    url: row.url,
    sortOrder: row.sort_order,
  };
}

export function toArticle(row: ArticleRow, media: MediaMap): Article {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    metaTitle: required(row.meta_title, "articles", row.id, "meta_title"),
    metaDescription: required(row.meta_description, "articles", row.id, "meta_description"),
    lead: required(row.lead, "articles", row.id, "lead"),
    bodyMd: row.body_md,
    cover: mediaFor(media, row.cover_media_id),
    authorId: required(row.author_id, "articles", row.id, "author_id"),
    faq: parseFaq(row.faq, "articles", row.id),
    publishedAt: required(row.published_at, "articles", row.id, "published_at"),
    updatedAt: row.updated_at,
  };
}

function toContentBlockItem(row: ContentBlockItemRow, media: MediaMap): ContentBlockItem {
  return {
    title: row.title,
    description: row.description,
    icon: row.icon,
    media: mediaFor(media, row.media_id),
    link: toCallToAction(row.link_label, row.link_href),
  };
}

export function toContentBlock(block: ContentBlockRow, items: readonly ContentBlockItemRow[], media: MediaMap): ContentBlock {
  return {
    key: block.block_key,
    eyebrow: block.eyebrow,
    title: block.title,
    description: block.description,
    items: [...items].sort((a, b) => a.sort_order - b.sort_order).map((item) => toContentBlockItem(item, media)),
  };
}
