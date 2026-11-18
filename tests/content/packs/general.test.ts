import { describe, expect, it } from "vitest";
import { createContentPackSchema } from "@/core/application/schemas/content-pack-schema";
import type { ContentBlockItemField } from "@/core/domain/theme/theme-config";
import { SECTION_KEYS } from "@/core/domain/shared/section-key";
import { generalPack } from "@/content/packs/general";
import { themeConfig } from "@/config/theme";
import { countWords } from "@/lib/markdown/words";
import { hasBlockingErrors, runContentChecks } from "@/lib/seo/content-checks";

const siteName = generalPack.settings.siteName;
const ITEM_FIELDS: ContentBlockItemField[] = ["title", "description", "icon", "media", "link"];
const catalogEntries = [...generalPack.services, ...generalPack.portfolio].map((item) => [item.slug, item] as const);

describe("general content pack", () => {
  it("matches the content pack schema", () => {
    expect(createContentPackSchema(siteName).safeParse(generalPack).success).toBe(true);
  });

  it("uses the demo identity and WhatsApp defaults", () => {
    expect(generalPack.settings).toMatchObject({
      siteName: "Arunika Solusi",
      whatsappNumber: "62895326422692",
      whatsappMessage: "Halo, saya ingin konsultasi pembuatan website. Paket mana yang cocok untuk usaha saya?",
    });
  });

  it("has the required amount of content", () => {
    expect(generalPack.services).toHaveLength(6);
    expect(generalPack.portfolio).toHaveLength(6);
    expect(generalPack.team).toHaveLength(4);
    expect(generalPack.stats).toHaveLength(4);
    expect(generalPack.testimonials).toHaveLength(5);
    expect(generalPack.partners).toHaveLength(8);
    expect(generalPack.articles).toHaveLength(3);
    expect(generalPack.vision.missions).toHaveLength(4);
    expect(generalPack.vision.values).toHaveLength(4);
    expect(generalPack.legalPages.map((page) => page.slug).sort()).toEqual(["kebijakan-editorial", "privasi", "syarat-ketentuan"]);
  });

  it("provides the stats the author box needs", () => {
    expect(generalPack.stats.map((stat) => stat.key)).toEqual(expect.arrayContaining(["completed_projects", "years_experience"]));
  });

  it("introduces every section", () => {
    expect(generalPack.sectionIntros.map((intro) => intro.key).sort()).toEqual([...SECTION_KEYS].sort());
  });

  it.each(generalPack.articles.map((article) => [article.slug, article] as const))("article %s passes every content check", (_slug, article) => {
    const checks = runContentChecks({
      kind: "article",
      siteName,
      metaTitle: article.metaTitle,
      metaDescription: article.metaDescription,
      slug: article.slug,
      bodyMd: article.bodyMd,
      lead: article.lead,
      faqCount: article.faq.length,
      imageAlts: [article.cover?.alt ?? ""],
    });
    expect(checks.filter((check) => !check.passed)).toEqual([]);
  });

  it.each(catalogEntries)("%s has no blocking error", (_slug, item) => {
    const checks = runContentChecks({
      kind: "service",
      siteName,
      metaTitle: item.metaTitle,
      metaDescription: item.metaDescription,
      slug: item.slug,
      bodyMd: item.bodyMd,
      lead: null,
      faqCount: 0,
      imageAlts: [item.cover?.alt ?? ""],
    });
    expect(hasBlockingErrors(checks)).toBe(false);
  });

  it.each(catalogEntries)("%s keeps a 150-400 word body with clean headings", (_slug, item) => {
    const checks = runContentChecks({
      kind: "service",
      siteName,
      metaTitle: item.metaTitle,
      metaDescription: item.metaDescription,
      slug: item.slug,
      bodyMd: item.bodyMd,
      lead: null,
      faqCount: 0,
      imageAlts: [item.cover?.alt ?? ""],
    });
    const words = countWords(item.bodyMd);
    expect(words).toBeGreaterThanOrEqual(150);
    expect(words).toBeLessThanOrEqual(400);
    expect(checks.filter((check) => !check.passed)).toEqual([]);
  });

  it("fills every content block the theme declares within its limits", () => {
    for (const definition of themeConfig.contentBlocks) {
      const block = generalPack.contentBlocks.find((candidate) => candidate.key === definition.key);
      expect(block).toBeDefined();
      expect(block!.items.length).toBeGreaterThanOrEqual(definition.minItems);
      expect(block!.items.length).toBeLessThanOrEqual(definition.maxItems);
    }
  });

  it("fills only the item fields each content block declares", () => {
    for (const definition of themeConfig.contentBlocks) {
      const block = generalPack.contentBlocks.find((candidate) => candidate.key === definition.key);
      for (const item of block?.items ?? []) {
        for (const field of ITEM_FIELDS) {
          if (definition.itemFields.includes(field)) {
            expect(item[field], `${definition.key}.${field}`).not.toBeNull();
          } else {
            expect(item[field], `${definition.key}.${field}`).toBeNull();
          }
        }
      }
    }
  });
});
