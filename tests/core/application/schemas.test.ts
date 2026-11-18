import { describe, expect, it } from "vitest";
import { createArticleSchema } from "@/core/application/schemas/article-schema";
import { createServiceSchema, partnerSchema, statSchema, teamMemberSchema } from "@/core/application/schemas/catalog-schemas";
import { createContentPackSchema } from "@/core/application/schemas/content-pack-schema";
import { callToActionSchema, mediaAssetSchema } from "@/core/application/schemas/shared-fields";
import { LEGAL_SLUGS } from "@/core/domain/page/legal-page";
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

  it.each(LEGAL_SLUGS)("accepts the legal slug %s", (slug) => {
    expect(legalPageSchema.safeParse({ ...pack.legalPages[0], slug }).success).toBe(true);
  });

  it("rejects an article with the reserved slug halaman", () => {
    expect(createArticleSchema("Nusa Karya").safeParse({ ...pack.articles[0], slug: "halaman" }).success).toBe(false);
    expect(createArticleSchema("Nusa Karya").safeParse({ ...pack.articles[0], slug: "halaman-baru" }).success).toBe(true);
  });

  it("rejects a pack without the contact section intro", () => {
    const broken = buildTestPack();
    broken.sectionIntros = broken.sectionIntros.filter((intro) => intro.key !== "contact");
    expect(createContentPackSchema("Nusa Karya").safeParse(broken).success).toBe(false);
  });

  it("rejects a pack with a duplicated section intro", () => {
    const broken = buildTestPack();
    broken.sectionIntros = [...broken.sectionIntros.slice(0, 9), broken.sectionIntros[0]];
    expect(createContentPackSchema("Nusa Karya").safeParse(broken).success).toBe(false);
  });

  it("rejects a home meta title of 48 characters for Nusa Karya", () => {
    const broken = buildTestPack();
    broken.home.metaTitle = "a".repeat(48);
    expect(createContentPackSchema("Nusa Karya").safeParse(broken).success).toBe(false);
  });

  it("rejects a home meta description of 119 characters", () => {
    const broken = buildTestPack();
    broken.home.metaDescription = "x".repeat(119);
    expect(createContentPackSchema("Nusa Karya").safeParse(broken).success).toBe(false);
  });

  it("rejects a section intro meta title that is too short", () => {
    const broken = buildTestPack();
    broken.sectionIntros[0].metaTitle = "Layanan";
    expect(createContentPackSchema("Nusa Karya").safeParse(broken).success).toBe(false);
  });

  it("rejects a section intro meta description of 156 characters", () => {
    const broken = buildTestPack();
    broken.sectionIntros[0].metaDescription = "x".repeat(156);
    expect(createContentPackSchema("Nusa Karya").safeParse(broken).success).toBe(false);
  });

  it("rejects an about meta title that is too long", () => {
    const broken = buildTestPack();
    broken.about.metaTitle = "a".repeat(48);
    expect(createContentPackSchema("Nusa Karya").safeParse(broken).success).toBe(false);
  });

  it("rejects a pack with an article that uses the reserved slug", () => {
    const broken = buildTestPack();
    broken.articles[0].slug = "halaman";
    expect(createContentPackSchema("Nusa Karya").safeParse(broken).success).toBe(false);
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

  const unsafeUrls = ["javascript:alert(1)", "data:text/html,x", "mailto:a@b.id", "ftp://x.id/f"];
  const safeUrls = ["https://www.linkedin.com/in/x", "http://example.id"];

  it.each(unsafeUrls)("rejects %s as a social link url", (url) => {
    const settings = { ...pack.settings, socialLinks: [{ platform: "LinkedIn", url }] };
    expect(siteSettingsSchema.safeParse(settings).success).toBe(false);
  });

  it.each(safeUrls)("accepts %s as a social link url", (url) => {
    const settings = { ...pack.settings, socialLinks: [{ platform: "LinkedIn", url }] };
    expect(siteSettingsSchema.safeParse(settings).success).toBe(true);
  });

  it.each(unsafeUrls)("rejects %s as a maps embed url", (url) => {
    expect(siteSettingsSchema.safeParse({ ...pack.settings, mapsEmbedUrl: url }).success).toBe(false);
  });

  it.each(safeUrls)("accepts %s as a maps embed url", (url) => {
    expect(siteSettingsSchema.safeParse({ ...pack.settings, mapsEmbedUrl: url }).success).toBe(true);
  });

  it.each(unsafeUrls)("rejects %s as a partner url", (url) => {
    expect(partnerSchema.safeParse({ ...pack.partners[0], url }).success).toBe(false);
  });

  it.each(safeUrls)("accepts %s as a partner url", (url) => {
    expect(partnerSchema.safeParse({ ...pack.partners[0], url }).success).toBe(true);
  });

  it.each(unsafeUrls)("rejects %s as a team profile", (url) => {
    expect(teamMemberSchema.safeParse({ ...pack.team[0], profiles: [url] }).success).toBe(false);
  });

  it.each(safeUrls)("accepts %s as a team profile", (url) => {
    expect(teamMemberSchema.safeParse({ ...pack.team[0], profiles: [url] }).success).toBe(true);
  });

  it.each(["//evil.com/x", "/\\evil.com"])("rejects %s as a call to action href", (href) => {
    expect(callToActionSchema.safeParse({ label: "Kontak", href }).success).toBe(false);
  });

  it.each(["/kontak", "#faq", "https://example.id/x"])("accepts %s as a call to action href", (href) => {
    expect(callToActionSchema.safeParse({ label: "Kontak", href }).success).toBe(true);
  });

  it.each(["//evil.com/x", "/\\evil.com"])("rejects %s as a media url", (url) => {
    expect(mediaAssetSchema.safeParse({ id: "m1", url, alt: "Foto", width: 10, height: 10 }).success).toBe(false);
  });

  it("accepts a rooted media url", () => {
    expect(mediaAssetSchema.safeParse({ id: "m1", url: "/demo/general/a.webp", alt: "Foto", width: 10, height: 10 }).success).toBe(true);
  });

  it.each(["2026-11-18T10:00:00+00:00", "2026-11-18T10:00:00.123456+00:00", "2026-11-18T10:00:00Z"])(
    "accepts %s as a timestamp",
    (updatedAt) => {
      expect(createServiceSchema("Nusa Karya").safeParse({ ...service, updatedAt }).success).toBe(true);
      expect(createArticleSchema("Nusa Karya").safeParse({ ...pack.articles[0], publishedAt: updatedAt, updatedAt }).success).toBe(true);
    },
  );

  it.each(["2026-11-18", "not-a-date"])("rejects %s as a timestamp", (updatedAt) => {
    expect(createServiceSchema("Nusa Karya").safeParse({ ...service, updatedAt }).success).toBe(false);
    expect(createArticleSchema("Nusa Karya").safeParse({ ...pack.articles[0], updatedAt }).success).toBe(false);
  });
});
