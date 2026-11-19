export type MediaRow = {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
};

export type SiteSettingsRow = {
  site_name: string;
  tagline: string;
  logo_media_id: string | null;
  default_og_media_id: string | null;
  email: string;
  phone: string;
  whatsapp_number: string;
  whatsapp_message: string;
  address_street: string;
  address_city: string;
  address_region: string;
  postal_code: string;
  address_country: string;
  maps_embed_url: string | null;
  opening_hours: string | null;
  social_links: unknown;
  schema_type: "Organization" | "LocalBusiness";
  founded_year: number | null;
  google_site_verification: string | null;
  ga_measurement_id: string | null;
  updated_at: string;
};

export type HomeContentRow = {
  hero_eyebrow: string | null;
  meta_title: string;
  meta_description: string;
  hero_title: string;
  hero_subtitle: string;
  hero_media_id: string | null;
  hero_primary_cta_label: string | null;
  hero_primary_cta_href: string | null;
  hero_secondary_cta_label: string | null;
  hero_secondary_cta_href: string | null;
  updated_at: string;
};

export type SectionIntroRow = {
  section_key: string;
  eyebrow: string | null;
  title: string;
  description: string | null;
  meta_title: string;
  meta_description: string;
};

export type AboutContentRow = {
  summary: string;
  body_md: string;
  media_id: string | null;
  meta_title: string;
  meta_description: string;
  updated_at: string;
};

export type CompanyVisionRow = { vision: string };
export type MissionItemRow = { content: string; sort_order: number };
export type CompanyValueRow = { title: string; description: string; sort_order: number };

export type ServiceRow = {
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
  updated_at: string;
};

export type PortfolioRow = {
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
  updated_at: string;
};

export type TeamMemberRow = {
  id: string;
  name: string;
  job_title: string | null;
  bio: string | null;
  photo_media_id: string | null;
  years_experience: number | null;
  profiles: unknown;
  sort_order: number;
};

export type StatRow = {
  key: string;
  label: string;
  value: number;
  suffix: string | null;
  sort_order: number;
};

export type TestimonialRow = {
  id: string;
  name: string;
  job_title: string | null;
  company: string | null;
  quote: string | null;
  photo_media_id: string | null;
  sort_order: number;
};

export type PartnerRow = {
  id: string;
  name: string;
  logo_media_id: string | null;
  url: string | null;
  sort_order: number;
};

export type ArticleRow = {
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
  published_at: string | null;
  updated_at: string;
};

export type ContentBlockRow = {
  id: string;
  block_key: string;
  eyebrow: string | null;
  title: string;
  description: string | null;
};

export type ContentBlockItemRow = {
  id: string;
  block_id: string;
  title: string | null;
  description: string | null;
  icon: string | null;
  media_id: string | null;
  link_label: string | null;
  link_href: string | null;
  sort_order: number;
};

export type LegalPageRow = {
  slug: string;
  title: string;
  intro: string;
  sections: unknown;
  meta_description: string;
  updated_at: string;
};
