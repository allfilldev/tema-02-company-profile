import type { Article } from "@/core/domain/article/article";
import type {
  AdminModule,
  AdminRecordByModule,
  ArticleRecord,
  PartnerRecord,
  PortfolioRecord,
  ServiceRecord,
  StatRecord,
  TeamMemberRecord,
  TestimonialRecord,
} from "@/core/domain/admin/records";
import type { Partner } from "@/core/domain/partner/partner";
import type { PortfolioItem } from "@/core/domain/portfolio/portfolio-item";
import type { Service } from "@/core/domain/service/service";
import type { Stat } from "@/core/domain/stat/stat";
import type { TeamMember } from "@/core/domain/team/team-member";
import type { Testimonial } from "@/core/domain/testimonial/testimonial";

const REQUIRED_FIELDS: Record<AdminModule, readonly string[]> = {
  services: ["summary", "metaTitle", "metaDescription"],
  portfolio: ["clientName", "category", "summary", "metaTitle", "metaDescription"],
  team: ["jobTitle", "bio"],
  stats: [],
  testimonials: ["jobTitle", "company", "quote"],
  partners: [],
  articles: ["metaTitle", "metaDescription", "lead", "authorId"],
};

function isFilled(value: unknown): boolean {
  return typeof value === "string" ? value.trim().length > 0 : value !== null && value !== undefined;
}

export function missingPublishFields<Module extends AdminModule>(module: Module, record: AdminRecordByModule[Module]): string[] {
  const values = record as unknown as Record<string, unknown>;
  return REQUIRED_FIELDS[module].filter((field) => !isFilled(values[field]));
}

export function toPublishableService(record: ServiceRecord): Service | null {
  if (missingPublishFields("services", record).length > 0) {
    return null;
  }
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    summary: record.summary as string,
    bodyMd: record.bodyMd,
    cover: record.cover,
    metaTitle: record.metaTitle as string,
    metaDescription: record.metaDescription as string,
    faq: record.faq,
    sortOrder: record.sortOrder,
    updatedAt: record.updatedAt,
  };
}

export function toPublishablePortfolioItem(record: PortfolioRecord): PortfolioItem | null {
  if (missingPublishFields("portfolio", record).length > 0) {
    return null;
  }
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    clientName: record.clientName as string,
    category: record.category as string,
    summary: record.summary as string,
    bodyMd: record.bodyMd,
    cover: record.cover,
    gallery: record.gallery,
    completedOn: record.completedOn,
    metaTitle: record.metaTitle as string,
    metaDescription: record.metaDescription as string,
    sortOrder: record.sortOrder,
    updatedAt: record.updatedAt,
  };
}

export function toPublishableTeamMember(record: TeamMemberRecord): TeamMember | null {
  if (missingPublishFields("team", record).length > 0) {
    return null;
  }
  return {
    id: record.id,
    name: record.name,
    jobTitle: record.jobTitle as string,
    bio: record.bio as string,
    photo: record.photo,
    yearsExperience: record.yearsExperience,
    profiles: record.profiles,
    sortOrder: record.sortOrder,
  };
}

export function toPublishableStat(record: StatRecord): Stat {
  return { key: record.key, label: record.label, value: record.value, suffix: record.suffix, sortOrder: record.sortOrder };
}

export function toPublishableTestimonial(record: TestimonialRecord): Testimonial | null {
  if (missingPublishFields("testimonials", record).length > 0) {
    return null;
  }
  return {
    id: record.id,
    name: record.name,
    jobTitle: record.jobTitle as string,
    company: record.company as string,
    quote: record.quote as string,
    photo: record.photo,
    sortOrder: record.sortOrder,
  };
}

export function toPublishablePartner(record: PartnerRecord): Partner {
  return { id: record.id, name: record.name, logo: record.logo, url: record.url, sortOrder: record.sortOrder };
}

export function toPublishableArticle(record: ArticleRecord): Article | null {
  if (missingPublishFields("articles", record).length > 0) {
    return null;
  }
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    metaTitle: record.metaTitle as string,
    metaDescription: record.metaDescription as string,
    lead: record.lead as string,
    bodyMd: record.bodyMd,
    cover: record.cover,
    authorId: record.authorId as string,
    faq: record.faq,
    publishedAt: record.publishedAt ?? record.updatedAt,
    updatedAt: record.updatedAt,
  };
}
