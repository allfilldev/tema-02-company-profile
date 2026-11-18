import { z } from "zod";
import type { ContentPack } from "@/core/domain/content-pack/content-pack";
import { createArticleSchema } from "@/core/application/schemas/article-schema";
import {
  createPortfolioItemSchema,
  createServiceSchema,
  partnerSchema,
  statSchema,
  teamMemberSchema,
  testimonialSchema,
} from "@/core/application/schemas/catalog-schemas";
import {
  aboutContentSchema,
  companyVisionSchema,
  contentBlockSchema,
  homeContentSchema,
  legalPageSchema,
  sectionIntroSchema,
  siteSettingsSchema,
} from "@/core/application/schemas/site-schemas";

function findDuplicateIndex(slugs: string[]): number {
  const seen = new Set<string>();

  for (const [index, slug] of slugs.entries()) {
    if (seen.has(slug)) {
      return index;
    }
    seen.add(slug);
  }

  return -1;
}

export function createContentPackSchema(siteName: string): z.ZodType<ContentPack> {
  return z
    .object({
      settings: siteSettingsSchema,
      home: homeContentSchema,
      sectionIntros: z.array(sectionIntroSchema),
      about: aboutContentSchema,
      vision: companyVisionSchema,
      services: z.array(createServiceSchema(siteName)),
      portfolio: z.array(createPortfolioItemSchema(siteName)),
      team: z.array(teamMemberSchema),
      stats: z.array(statSchema),
      testimonials: z.array(testimonialSchema),
      partners: z.array(partnerSchema),
      articles: z.array(createArticleSchema(siteName)),
      contentBlocks: z.array(contentBlockSchema),
      legalPages: z.array(legalPageSchema),
    })
    .superRefine((pack, context) => {
      const slugCollections: [string, { slug: string }[]][] = [
        ["services", pack.services],
        ["portfolio", pack.portfolio],
        ["articles", pack.articles],
        ["legalPages", pack.legalPages],
      ];

      for (const [collectionName, items] of slugCollections) {
        const duplicateIndex = findDuplicateIndex(items.map((item) => item.slug));
        if (duplicateIndex !== -1) {
          context.addIssue({
            code: "custom",
            message: "Slug harus unik dalam satu koleksi.",
            path: [collectionName, duplicateIndex, "slug"],
          });
        }
      }

      const teamIds = new Set(pack.team.map((member) => member.id));
      for (const [index, article] of pack.articles.entries()) {
        if (!teamIds.has(article.authorId)) {
          context.addIssue({
            code: "custom",
            message: "Penulis artikel harus ada di daftar tim.",
            path: ["articles", index, "authorId"],
          });
        }
      }
    });
}
