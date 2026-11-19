import { describe, expect, it } from "vitest";
import { draftSchemaFor } from "@/core/application/admin/draft-schemas";

describe("draftSchemaFor", () => {
  it("accepts a service with only a title and a slug", () => {
    const result = draftSchemaFor("services").safeParse({
      slug: "penyusunan-sop",
      title: "Penyusunan SOP",
      summary: null,
      bodyMd: "",
      cover: null,
      metaTitle: null,
      metaDescription: null,
      faq: [],
    });

    expect(result.success).toBe(true);
  });

  it("rejects a slug that is not lowercase with hyphens", () => {
    const result = draftSchemaFor("services").safeParse({ slug: "Halo Dunia", title: "Layanan", summary: null, bodyMd: "", cover: null, metaTitle: null, metaDescription: null, faq: [] });

    expect(result.success).toBe(false);
  });

  it("rejects an article with the reserved slug halaman", () => {
    const result = draftSchemaFor("articles").safeParse({
      slug: "halaman",
      title: "Artikel",
      metaTitle: null,
      metaDescription: null,
      lead: null,
      bodyMd: "",
      cover: null,
      authorId: null,
      faq: [],
    });

    expect(result.success).toBe(false);
  });

  it("rejects a stat without a value", () => {
    expect(draftSchemaFor("stats").safeParse({ key: "completed_projects", label: "Proyek selesai", suffix: null }).success).toBe(false);
    expect(draftSchemaFor("stats").safeParse({ key: "completed_projects", label: "Proyek selesai", value: 120, suffix: "+" }).success).toBe(true);
  });

  it("requires a name for people and partners, and nothing else", () => {
    expect(draftSchemaFor("team").safeParse({ name: "Rina", jobTitle: null, bio: null, photo: null, yearsExperience: null, profiles: [] }).success).toBe(true);
    expect(draftSchemaFor("team").safeParse({ name: "  ", jobTitle: null, bio: null, photo: null, yearsExperience: null, profiles: [] }).success).toBe(false);
    expect(draftSchemaFor("testimonials").safeParse({ name: "Budi", jobTitle: null, company: null, quote: null, photo: null }).success).toBe(true);
    expect(draftSchemaFor("partners").safeParse({ name: "Mitra", logo: null, url: null }).success).toBe(true);
    expect(draftSchemaFor("partners").safeParse({ name: "Mitra", logo: null, url: "bukan-url" }).success).toBe(false);
  });
});
