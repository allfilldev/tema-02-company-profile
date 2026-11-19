import type {
  ArticleInput,
  ArticleRecord,
  ContactMessage,
  MediaRecord,
  PartnerInput,
  PartnerRecord,
  PortfolioInput,
  PortfolioRecord,
  ServiceInput,
  ServiceRecord,
  StatInput,
  StatRecord,
  TeamMemberInput,
  TeamMemberRecord,
  TestimonialInput,
  TestimonialRecord,
} from "@/core/domain/admin/records";
import type { SiteSettings } from "@/core/domain/settings/site-settings";
import type { FaqItem } from "@/core/domain/shared/faq-item";
import type { MediaMap } from "@/infrastructure/supabase/mappers";

export type AdminServiceRow = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  body_md: string;
  cover_media_id: string | null;
  meta_title: string | null;
  meta_description: string | null;
  faq: unknown;
  sort_order: number;
  is_published: boolean;
  updated_at: string;
};

export type AdminPortfolioRow = {
  id: string;
  slug: string;
  title: string;
  client_name: string | null;
  category: string | null;
  summary: string | null;
  body_md: string;
  cover_media_id: string | null;
  gallery_media_ids: string[];
  completed_on: string | null;
  meta_title: string | null;
  meta_description: string | null;
  sort_order: number;
  is_published: boolean;
  updated_at: string;
};

export type AdminTeamRow = {
  id: string;
  name: string;
  job_title: string | null;
  bio: string | null;
  photo_media_id: string | null;
  years_experience: number | null;
  profiles: unknown;
  sort_order: number;
  is_published: boolean;
  updated_at: string;
};

export type AdminStatRow = {
  id: string;
  key: string;
  label: string;
  value: number;
  suffix: string | null;
  sort_order: number;
  updated_at: string;
};

export type AdminTestimonialRow = {
  id: string;
  name: string;
  job_title: string | null;
  company: string | null;
  quote: string | null;
  photo_media_id: string | null;
  sort_order: number;
  is_published: boolean;
  updated_at: string;
};

export type AdminPartnerRow = {
  id: string;
  name: string;
  logo_media_id: string | null;
  url: string | null;
  sort_order: number;
  is_published: boolean;
  updated_at: string;
};

export type AdminArticleRow = {
  id: string;
  slug: string;
  title: string;
  meta_title: string | null;
  meta_description: string | null;
  lead: string | null;
  body_md: string;
  cover_media_id: string | null;
  author_id: string | null;
  faq: unknown;
  status: "draft" | "published";
  published_at: string | null;
  updated_at: string;
};

export type AdminMediaRow = {
  id: string;
  storage_path: string | null;
  url: string;
  alt: string;
  width: number;
  height: number;
  size_bytes: number;
  created_at: string;
};

export type AdminMessageRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

function faqOf(value: unknown): FaqItem[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((item) =>
    item && typeof item.question === "string" && typeof item.answer === "string" ? [{ question: item.question, answer: item.answer }] : [],
  );
}

function stringsOf(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function mediaFor(media: MediaMap, id: string | null) {
  return id ? (media.get(id) ?? null) : null;
}

export function toServiceRecord(row: AdminServiceRow, media: MediaMap): ServiceRecord {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    bodyMd: row.body_md,
    cover: mediaFor(media, row.cover_media_id),
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    faq: faqOf(row.faq),
    sortOrder: row.sort_order,
    isPublished: row.is_published,
    updatedAt: row.updated_at,
  };
}

export function serviceInputToRow(input: ServiceInput): Record<string, unknown> {
  return {
    slug: input.slug,
    title: input.title,
    summary: input.summary,
    body_md: input.bodyMd,
    cover_media_id: input.cover?.id ?? null,
    meta_title: input.metaTitle,
    meta_description: input.metaDescription,
    faq: input.faq,
  };
}

export function toPortfolioRecord(row: AdminPortfolioRow, media: MediaMap): PortfolioRecord {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    clientName: row.client_name,
    category: row.category,
    summary: row.summary,
    bodyMd: row.body_md,
    cover: mediaFor(media, row.cover_media_id),
    gallery: row.gallery_media_ids.flatMap((id) => {
      const asset = media.get(id);
      return asset ? [asset] : [];
    }),
    completedOn: row.completed_on,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    sortOrder: row.sort_order,
    isPublished: row.is_published,
    updatedAt: row.updated_at,
  };
}

export function portfolioInputToRow(input: PortfolioInput): Record<string, unknown> {
  return {
    slug: input.slug,
    title: input.title,
    client_name: input.clientName,
    category: input.category,
    summary: input.summary,
    body_md: input.bodyMd,
    cover_media_id: input.cover?.id ?? null,
    gallery_media_ids: input.gallery.map((asset) => asset.id),
    completed_on: input.completedOn,
    meta_title: input.metaTitle,
    meta_description: input.metaDescription,
  };
}

export function toTeamMemberRecord(row: AdminTeamRow, media: MediaMap): TeamMemberRecord {
  return {
    id: row.id,
    name: row.name,
    jobTitle: row.job_title,
    bio: row.bio,
    photo: mediaFor(media, row.photo_media_id),
    yearsExperience: row.years_experience,
    profiles: stringsOf(row.profiles),
    sortOrder: row.sort_order,
    isPublished: row.is_published,
    updatedAt: row.updated_at,
  };
}

export function teamMemberInputToRow(input: TeamMemberInput): Record<string, unknown> {
  return {
    name: input.name,
    job_title: input.jobTitle,
    bio: input.bio,
    photo_media_id: input.photo?.id ?? null,
    years_experience: input.yearsExperience,
    profiles: input.profiles,
  };
}

export function toStatRecord(row: AdminStatRow): StatRecord {
  return { id: row.id, key: row.key, label: row.label, value: row.value, suffix: row.suffix, sortOrder: row.sort_order, updatedAt: row.updated_at };
}

export function statInputToRow(input: StatInput): Record<string, unknown> {
  return { key: input.key, label: input.label, value: input.value, suffix: input.suffix };
}

export function toTestimonialRecord(row: AdminTestimonialRow, media: MediaMap): TestimonialRecord {
  return {
    id: row.id,
    name: row.name,
    jobTitle: row.job_title,
    company: row.company,
    quote: row.quote,
    photo: mediaFor(media, row.photo_media_id),
    sortOrder: row.sort_order,
    isPublished: row.is_published,
    updatedAt: row.updated_at,
  };
}

export function testimonialInputToRow(input: TestimonialInput): Record<string, unknown> {
  return {
    name: input.name,
    job_title: input.jobTitle,
    company: input.company,
    quote: input.quote,
    photo_media_id: input.photo?.id ?? null,
  };
}

export function toPartnerRecord(row: AdminPartnerRow, media: MediaMap): PartnerRecord {
  return {
    id: row.id,
    name: row.name,
    logo: mediaFor(media, row.logo_media_id),
    url: row.url,
    sortOrder: row.sort_order,
    isPublished: row.is_published,
    updatedAt: row.updated_at,
  };
}

export function partnerInputToRow(input: PartnerInput): Record<string, unknown> {
  return { name: input.name, logo_media_id: input.logo?.id ?? null, url: input.url };
}

export function toArticleRecord(row: AdminArticleRow, media: MediaMap): ArticleRecord {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    lead: row.lead,
    bodyMd: row.body_md,
    cover: mediaFor(media, row.cover_media_id),
    authorId: row.author_id,
    faq: faqOf(row.faq),
    status: row.status,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
  };
}

export function articleInputToRow(input: ArticleInput): Record<string, unknown> {
  return {
    slug: input.slug,
    title: input.title,
    meta_title: input.metaTitle,
    meta_description: input.metaDescription,
    lead: input.lead,
    body_md: input.bodyMd,
    cover_media_id: input.cover?.id ?? null,
    author_id: input.authorId,
    faq: input.faq,
  };
}

export function toMediaRecord(row: AdminMediaRow): MediaRecord {
  return {
    id: row.id,
    url: row.url,
    alt: row.alt,
    width: row.width,
    height: row.height,
    sizeBytes: row.size_bytes,
    storagePath: row.storage_path,
    createdAt: row.created_at,
  };
}

export function toContactMessage(row: AdminMessageRow): ContactMessage {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    message: row.message,
    isRead: row.is_read,
    createdAt: row.created_at,
  };
}

export function settingsToRow(settings: SiteSettings): Record<string, unknown> {
  return {
    site_name: settings.siteName,
    tagline: settings.tagline,
    logo_media_id: settings.logo?.id ?? null,
    default_og_media_id: settings.defaultOgImage?.id ?? null,
    email: settings.email,
    phone: settings.phone,
    whatsapp_number: settings.whatsappNumber,
    whatsapp_message: settings.whatsappMessage,
    address_street: settings.address.street,
    address_city: settings.address.city,
    address_region: settings.address.region,
    postal_code: settings.address.postalCode,
    address_country: settings.address.country,
    maps_embed_url: settings.mapsEmbedUrl,
    opening_hours: settings.openingHours,
    social_links: settings.socialLinks,
    schema_type: settings.schemaType,
    founded_year: settings.foundedYear,
    google_site_verification: settings.googleSiteVerification,
    ga_measurement_id: settings.gaMeasurementId,
  };
}
