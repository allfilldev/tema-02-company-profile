import { z } from "zod";
import type { ContentBlock, ContentBlockItem } from "@/core/domain/content-block/content-block";
import type { AboutContent } from "@/core/domain/page/about-content";
import type { CompanyVision } from "@/core/domain/page/company-vision";
import type { HomeContent } from "@/core/domain/page/home-content";
import type { LegalPage } from "@/core/domain/page/legal-page";
import type { SectionIntro } from "@/core/domain/page/section-intro";
import type { SiteSettings } from "@/core/domain/settings/site-settings";
import { SECTION_KEYS } from "@/core/domain/shared/section-key";
import {
  callToActionSchema,
  httpUrlField,
  mediaAssetSchema,
  metaDescriptionField,
  requiredText,
  slugField,
  timestampField,
} from "@/core/application/schemas/shared-fields";

const WHATSAPP_NUMBER_PATTERN = /^62\d{8,13}$/;

export const siteSettingsSchema: z.ZodType<SiteSettings> = z.object({
  siteName: requiredText,
  tagline: requiredText,
  logo: mediaAssetSchema.nullable(),
  defaultOgImage: mediaAssetSchema.nullable(),
  email: z.email(),
  phone: requiredText,
  whatsappNumber: z.string().regex(WHATSAPP_NUMBER_PATTERN, "Nomor WhatsApp harus diawali 62 dan hanya berisi angka."),
  whatsappMessage: requiredText,
  address: z.object({
    street: requiredText,
    city: requiredText,
    region: requiredText,
    postalCode: requiredText,
    country: requiredText,
  }),
  mapsEmbedUrl: httpUrlField.nullable(),
  openingHours: z.string().nullable(),
  socialLinks: z.array(z.object({ platform: requiredText, url: httpUrlField })),
  schemaType: z.enum(["Organization", "LocalBusiness"]),
  foundedYear: z.number().int().positive().nullable(),
  googleSiteVerification: z.string().nullable(),
  gaMeasurementId: z.string().nullable(),
  updatedAt: timestampField,
});

export const homeContentSchema: z.ZodType<HomeContent> = z.object({
  heroEyebrow: z.string().nullable(),
  heroTitle: requiredText,
  heroSubtitle: requiredText,
  heroImage: mediaAssetSchema.nullable(),
  primaryCta: callToActionSchema.nullable(),
  secondaryCta: callToActionSchema.nullable(),
  updatedAt: timestampField,
});

export const sectionIntroSchema: z.ZodType<SectionIntro> = z.object({
  key: z.enum(SECTION_KEYS),
  eyebrow: z.string().nullable(),
  title: requiredText,
  description: z.string().nullable(),
});

export const aboutContentSchema: z.ZodType<AboutContent> = z.object({
  summary: requiredText,
  bodyMd: requiredText,
  image: mediaAssetSchema.nullable(),
  metaDescription: metaDescriptionField,
  updatedAt: timestampField,
});

export const companyVisionSchema: z.ZodType<CompanyVision> = z.object({
  vision: requiredText,
  missions: z.array(requiredText),
  values: z.array(z.object({ title: requiredText, description: requiredText })),
});

export const legalPageSchema: z.ZodType<LegalPage> = z.object({
  slug: z.enum(["privasi", "syarat-ketentuan", "kebijakan-editorial"]),
  title: requiredText,
  intro: requiredText,
  sections: z.array(z.object({ heading: requiredText, bodyMd: requiredText })).min(1),
  metaDescription: metaDescriptionField,
  updatedAt: timestampField,
});

const contentBlockItemSchema: z.ZodType<ContentBlockItem> = z.object({
  title: z.string().nullable(),
  description: z.string().nullable(),
  icon: z.string().nullable(),
  media: mediaAssetSchema.nullable(),
  link: callToActionSchema.nullable(),
});

export const contentBlockSchema: z.ZodType<ContentBlock> = z.object({
  key: slugField,
  eyebrow: z.string().nullable(),
  title: requiredText,
  description: z.string().nullable(),
  items: z.array(contentBlockItemSchema),
});
