import { z } from "zod";
import type { Article } from "@/core/domain/article/article";
import {
  faqItemSchema,
  mediaAssetSchema,
  metaDescriptionField,
  metaTitleField,
  requiredText,
  slugField,
} from "@/core/application/schemas/shared-fields";
import { FAQ_MAX, FAQ_MIN } from "@/lib/seo/limits";

export function createArticleSchema(siteName: string): z.ZodType<Article> {
  return z.object({
    id: requiredText,
    slug: slugField,
    title: requiredText,
    metaTitle: metaTitleField(siteName),
    metaDescription: metaDescriptionField,
    lead: requiredText,
    bodyMd: requiredText,
    cover: mediaAssetSchema.nullable(),
    authorId: requiredText,
    faq: z
      .array(faqItemSchema)
      .min(FAQ_MIN, `FAQ artikel minimal ${FAQ_MIN} pertanyaan.`)
      .max(FAQ_MAX, `FAQ artikel maksimal ${FAQ_MAX} pertanyaan.`),
    publishedAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  });
}
