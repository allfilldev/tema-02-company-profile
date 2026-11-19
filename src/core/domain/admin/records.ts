import type { FaqItem } from "@/core/domain/shared/faq-item";
import type { MediaAsset } from "@/core/domain/shared/media-asset";

export const ADMIN_MODULES = ["services", "portfolio", "team", "stats", "testimonials", "partners", "articles"] as const;

export type AdminModule = (typeof ADMIN_MODULES)[number];

export function isAdminModule(value: string): value is AdminModule {
  return (ADMIN_MODULES as readonly string[]).includes(value);
}

export type ServiceRecord = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  bodyMd: string;
  cover: MediaAsset | null;
  metaTitle: string | null;
  metaDescription: string | null;
  faq: FaqItem[];
  sortOrder: number;
  isPublished: boolean;
  updatedAt: string;
};

export type PortfolioRecord = {
  id: string;
  slug: string;
  title: string;
  clientName: string | null;
  category: string | null;
  summary: string | null;
  bodyMd: string;
  cover: MediaAsset | null;
  gallery: MediaAsset[];
  completedOn: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  sortOrder: number;
  isPublished: boolean;
  updatedAt: string;
};

export type TeamMemberRecord = {
  id: string;
  name: string;
  jobTitle: string | null;
  bio: string | null;
  photo: MediaAsset | null;
  yearsExperience: number | null;
  profiles: string[];
  sortOrder: number;
  isPublished: boolean;
  updatedAt: string;
};

export type StatRecord = {
  id: string;
  key: string;
  label: string;
  value: number;
  suffix: string | null;
  sortOrder: number;
  updatedAt: string;
};

export type TestimonialRecord = {
  id: string;
  name: string;
  jobTitle: string | null;
  company: string | null;
  quote: string | null;
  photo: MediaAsset | null;
  sortOrder: number;
  isPublished: boolean;
  updatedAt: string;
};

export type PartnerRecord = {
  id: string;
  name: string;
  logo: MediaAsset | null;
  url: string | null;
  sortOrder: number;
  isPublished: boolean;
  updatedAt: string;
};

export type ArticleStatus = "draft" | "published";

export type ArticleRecord = {
  id: string;
  slug: string;
  title: string;
  metaTitle: string | null;
  metaDescription: string | null;
  lead: string | null;
  bodyMd: string;
  cover: MediaAsset | null;
  authorId: string | null;
  faq: FaqItem[];
  status: ArticleStatus;
  publishedAt: string | null;
  updatedAt: string;
};

export type ServiceInput = Omit<ServiceRecord, "id" | "sortOrder" | "isPublished" | "updatedAt">;
export type PortfolioInput = Omit<PortfolioRecord, "id" | "sortOrder" | "isPublished" | "updatedAt">;
export type TeamMemberInput = Omit<TeamMemberRecord, "id" | "sortOrder" | "isPublished" | "updatedAt">;
export type StatInput = Omit<StatRecord, "id" | "sortOrder" | "updatedAt">;
export type TestimonialInput = Omit<TestimonialRecord, "id" | "sortOrder" | "isPublished" | "updatedAt">;
export type PartnerInput = Omit<PartnerRecord, "id" | "sortOrder" | "isPublished" | "updatedAt">;
export type ArticleInput = Omit<ArticleRecord, "id" | "status" | "publishedAt" | "updatedAt">;

export type AdminRecordByModule = {
  services: ServiceRecord;
  portfolio: PortfolioRecord;
  team: TeamMemberRecord;
  stats: StatRecord;
  testimonials: TestimonialRecord;
  partners: PartnerRecord;
  articles: ArticleRecord;
};

export type AdminInputByModule = {
  services: ServiceInput;
  portfolio: PortfolioInput;
  team: TeamMemberInput;
  stats: StatInput;
  testimonials: TestimonialInput;
  partners: PartnerInput;
  articles: ArticleInput;
};

export type MediaRecord = MediaAsset & {
  sizeBytes: number;
  storagePath: string | null;
  createdAt: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
};
