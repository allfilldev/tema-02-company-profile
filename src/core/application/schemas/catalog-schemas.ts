import { z } from "zod";
import type { Partner } from "@/core/domain/partner/partner";
import type { PortfolioItem } from "@/core/domain/portfolio/portfolio-item";
import type { Service } from "@/core/domain/service/service";
import type { Stat } from "@/core/domain/stat/stat";
import type { TeamMember } from "@/core/domain/team/team-member";
import type { Testimonial } from "@/core/domain/testimonial/testimonial";
import {
  faqItemSchema,
  httpUrlField,
  mediaAssetSchema,
  metaDescriptionField,
  metaTitleField,
  requiredText,
  slugField,
  timestampField,
} from "@/core/application/schemas/shared-fields";
import { FAQ_MAX, FAQ_MIN } from "@/lib/seo/limits";

const STAT_KEY_PATTERN = /^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/;

const sortOrderField = z.number().int().min(0);

export function createServiceSchema(siteName: string): z.ZodType<Service> {
  return z.object({
    id: requiredText,
    slug: slugField,
    title: requiredText,
    summary: requiredText,
    bodyMd: requiredText,
    cover: mediaAssetSchema.nullable(),
    metaTitle: metaTitleField(siteName),
    metaDescription: metaDescriptionField,
    faq: z
      .array(faqItemSchema)
      .refine(
        (items) => items.length === 0 || (items.length >= FAQ_MIN && items.length <= FAQ_MAX),
        `FAQ layanan boleh kosong, atau berisi ${FAQ_MIN}–${FAQ_MAX} pertanyaan.`,
      ),
    sortOrder: sortOrderField,
    updatedAt: timestampField,
  });
}

export function createPortfolioItemSchema(siteName: string): z.ZodType<PortfolioItem> {
  return z.object({
    id: requiredText,
    slug: slugField,
    title: requiredText,
    clientName: requiredText,
    category: requiredText,
    summary: requiredText,
    bodyMd: requiredText,
    cover: mediaAssetSchema.nullable(),
    gallery: z.array(mediaAssetSchema),
    completedOn: z.iso.date().nullable(),
    metaTitle: metaTitleField(siteName),
    metaDescription: metaDescriptionField,
    sortOrder: sortOrderField,
    updatedAt: timestampField,
  });
}

export const teamMemberSchema: z.ZodType<TeamMember> = z.object({
  id: requiredText,
  name: requiredText,
  jobTitle: requiredText,
  bio: requiredText,
  photo: mediaAssetSchema.nullable(),
  yearsExperience: z.number().int().min(0).nullable(),
  profiles: z.array(httpUrlField),
  sortOrder: sortOrderField,
});

export const statSchema: z.ZodType<Stat> = z.object({
  key: z.string().regex(STAT_KEY_PATTERN, "Key statistik harus snake_case huruf kecil, contoh completed_projects."),
  label: requiredText,
  value: z.number().min(0),
  suffix: z.string().nullable(),
  sortOrder: sortOrderField,
});

export const testimonialSchema: z.ZodType<Testimonial> = z.object({
  id: requiredText,
  name: requiredText,
  jobTitle: requiredText,
  company: requiredText,
  quote: requiredText,
  photo: mediaAssetSchema.nullable(),
  sortOrder: sortOrderField,
});

export const partnerSchema: z.ZodType<Partner> = z.object({
  id: requiredText,
  name: requiredText,
  logo: mediaAssetSchema.nullable(),
  url: httpUrlField.nullable(),
  sortOrder: sortOrderField,
});
