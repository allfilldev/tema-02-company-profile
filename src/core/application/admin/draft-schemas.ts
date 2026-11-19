import { z } from "zod";
import type { AdminInputByModule, AdminModule } from "@/core/domain/admin/records";
import {
  faqItemSchema,
  httpUrlField,
  mediaAssetSchema,
  requiredText,
  slugField,
} from "@/core/application/schemas/shared-fields";
import { isReservedArticleSlug } from "@/lib/text/slug";

const STAT_KEY_PATTERN = /^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/;

const optionalText = z.string().nullable();
const optionalMedia = mediaAssetSchema.nullable();
const articleSlugField = slugField.refine((slug) => !isReservedArticleSlug(slug), "Slug artikel ini dicadangkan untuk paginasi.");

const serviceDraft = z.object({
  slug: slugField,
  title: requiredText,
  summary: optionalText,
  bodyMd: z.string(),
  cover: optionalMedia,
  metaTitle: optionalText,
  metaDescription: optionalText,
  faq: z.array(faqItemSchema),
});

const portfolioDraft = z.object({
  slug: slugField,
  title: requiredText,
  clientName: optionalText,
  category: optionalText,
  summary: optionalText,
  bodyMd: z.string(),
  cover: optionalMedia,
  gallery: z.array(mediaAssetSchema),
  completedOn: z.iso.date({ error: "Tanggal tidak valid." }).nullable(),
  metaTitle: optionalText,
  metaDescription: optionalText,
});

const teamDraft = z.object({
  name: requiredText,
  jobTitle: optionalText,
  bio: optionalText,
  photo: optionalMedia,
  yearsExperience: z.number({ error: "Isi dengan angka." }).int().min(0).nullable(),
  profiles: z.array(httpUrlField),
});

const statDraft = z.object({
  key: z.string().regex(STAT_KEY_PATTERN, "Key statistik harus snake_case huruf kecil, contoh completed_projects."),
  label: requiredText,
  value: z.number({ error: "Isi dengan angka." }).min(0),
  suffix: optionalText,
});

const testimonialDraft = z.object({
  name: requiredText,
  jobTitle: optionalText,
  company: optionalText,
  quote: optionalText,
  photo: optionalMedia,
});

const partnerDraft = z.object({
  name: requiredText,
  logo: optionalMedia,
  url: httpUrlField.nullable(),
});

const articleDraft = z.object({
  slug: articleSlugField,
  title: requiredText,
  metaTitle: optionalText,
  metaDescription: optionalText,
  lead: optionalText,
  bodyMd: z.string(),
  cover: optionalMedia,
  authorId: optionalText,
  faq: z.array(faqItemSchema),
});

const DRAFT_SCHEMAS = {
  services: serviceDraft,
  portfolio: portfolioDraft,
  team: teamDraft,
  stats: statDraft,
  testimonials: testimonialDraft,
  partners: partnerDraft,
  articles: articleDraft,
};

export function draftSchemaFor<Module extends AdminModule>(module: Module): z.ZodType<AdminInputByModule[Module]> {
  return DRAFT_SCHEMAS[module] as unknown as z.ZodType<AdminInputByModule[Module]>;
}
