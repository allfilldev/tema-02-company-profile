import { z } from "zod";
import type { CallToAction } from "@/core/domain/shared/call-to-action";
import type { FaqItem } from "@/core/domain/shared/faq-item";
import type { MediaAsset } from "@/core/domain/shared/media-asset";
import {
  META_DESCRIPTION_MAX,
  META_DESCRIPTION_MIN,
  TITLE_MAX,
  TITLE_MIN,
} from "@/lib/seo/limits";
import { buildPageTitle, maxMetaTitleLength } from "@/lib/seo/title";
import { isValidSlug } from "@/lib/text/slug";

const ROOTED_URL_PATTERN = /^(\/(?![\/\\])|https:\/\/)/;
const CALL_TO_ACTION_HREF_PATTERN = /^(\/(?![\/\\])|#|https:\/\/)/;

export const httpUrlField: z.ZodType<string> = z.httpUrl();

export const timestampField: z.ZodType<string> = z.iso.datetime({ offset: true });

export const requiredText: z.ZodType<string> = z
  .string()
  .refine((value) => value.trim().length > 0, "Teks tidak boleh kosong.");

export const slugField: z.ZodType<string> = z
  .string()
  .refine(isValidSlug, "Slug hanya boleh huruf kecil, angka, dan tanda hubung.");

export function metaTitleField(siteName: string): z.ZodType<string> {
  const maxLength = maxMetaTitleLength(siteName);

  return z.string().refine((metaTitle) => {
    const fullLength = buildPageTitle(metaTitle, siteName).length;
    return (
      metaTitle.trim().length > 0 &&
      maxLength > 0 &&
      fullLength >= TITLE_MIN &&
      fullLength <= TITLE_MAX
    );
  }, `Meta title maksimal ${maxLength} karakter agar judul lengkap tetap ${TITLE_MIN}–${TITLE_MAX} karakter.`);
}

export const metaDescriptionField: z.ZodType<string> = z
  .string()
  .min(META_DESCRIPTION_MIN, `Meta description minimal ${META_DESCRIPTION_MIN} karakter.`)
  .max(META_DESCRIPTION_MAX, `Meta description maksimal ${META_DESCRIPTION_MAX} karakter.`);

export const mediaAssetSchema: z.ZodType<MediaAsset> = z.object({
  id: requiredText,
  url: z.string().regex(ROOTED_URL_PATTERN, "URL gambar harus diawali / atau https://."),
  alt: requiredText,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const faqItemSchema: z.ZodType<FaqItem> = z.object({
  question: requiredText,
  answer: requiredText,
});

export const callToActionSchema: z.ZodType<CallToAction> = z.object({
  label: requiredText,
  href: z.string().regex(CALL_TO_ACTION_HREF_PATTERN, "Href harus diawali /, #, atau https://."),
});
