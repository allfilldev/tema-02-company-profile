import { describe, expect, it } from "vitest";
import { createArticleSchema } from "@/core/application/schemas/article-schema";
import { createServiceSchema, statSchema } from "@/core/application/schemas/catalog-schemas";
import { createContentPackSchema } from "@/core/application/schemas/content-pack-schema";
import { callToActionSchema, mediaAssetSchema } from "@/core/application/schemas/shared-fields";
import { legalPageSchema, siteSettingsSchema } from "@/core/application/schemas/site-schemas";
import { buildTestPack } from "../../fixtures/content-pack";

const pack = buildTestPack();
const service = pack.services[0];

describe("content schemas", () => {
  it("accepts the test pack", () => {
    expect(createContentPackSchema("Nusa Karya").safeParse(pack).success).toBe(true);
  });

  it("returns a fresh pack on every call", () => {
    expect(buildTestPack()).not.toBe(buildTestPack());
  });

  it("rejects a meta title that is too long for the site name", () => {
    expect(createServiceSchema("Nusa Karya").safeParse({ ...service, metaTitle: "a".repeat(48) }).success).toBe(false);
  });

  it("rejects a meta description of 119 characters", () => {
    expect(createServiceSchema("Nusa Karya").safeParse({ ...service, metaDescription: "x".repeat(119) }).success).toBe(false);
  });

  it("rejects an invalid slug", () => {
    expect(createServiceSchema("Nusa Karya").safeParse({ ...service, slug: "Layanan Baru" }).success).toBe(false);
  });

  it("rejects media without alt text", () => {
    expect(mediaAssetSchema.safeParse({ id: "m1", url: "/demo/a.webp", alt: " ", width: 10, height: 10 }).success).toBe(false);
  });

  it("rejects a WhatsApp number that does not start with 62", () => {
    expect(siteSettingsSchema.safeParse({ ...pack.settings, whatsappNumber: "0812345678" }).success).toBe(false);
  });

  it("rejects an unknown legal slug", () => {
    expect(legalPageSchema.safeParse({ ...pack.legalPages[0], slug: "privacy" }).success).toBe(false);
  });

  it("rejects a call to action with a relative href that is not rooted", () => {
    expect(callToActionSchema.safeParse({ label: "Kontak", href: "kontak" }).success).toBe(false);
  });

  it("rejects an article with only two faq items", () => {
    const article = { ...pack.articles[0], faq: pack.articles[0].faq.slice(0, 2) };
    expect(createArticleSchema("Nusa Karya").safeParse(article).success).toBe(false);
  });

  it("rejects a pack with duplicate service slugs", () => {
    const broken = buildTestPack();
    broken.services[1].slug = broken.services[0].slug;
    expect(createContentPackSchema("Nusa Karya").safeParse(broken).success).toBe(false);
  });

  it("rejects a pack with an article whose author is not in the team", () => {
    const broken = buildTestPack();
    broken.articles[0].authorId = "unknown-author";
    expect(createContentPackSchema("Nusa Karya").safeParse(broken).success).toBe(false);
  });

  it("accepts snake case stat keys", () => {
    const stat = pack.stats[0];
    expect(statSchema.safeParse({ ...stat, key: "completed_projects" }).success).toBe(true);
    expect(statSchema.safeParse({ ...stat, key: "years_experience" }).success).toBe(true);
  });

  it("rejects stat keys that are not snake case", () => {
    const stat = pack.stats[0];
    expect(statSchema.safeParse({ ...stat, key: "Completed Projects" }).success).toBe(false);
    expect(statSchema.safeParse({ ...stat, key: "" }).success).toBe(false);
  });
});
