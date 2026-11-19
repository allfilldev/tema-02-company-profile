import { describe, expect, it } from "vitest";
import { createCollectionAdmin } from "@/core/application/admin/collection-admin";
import type { ArticleRecord, ServiceRecord } from "@/core/domain/admin/records";
import type { ModuleKey } from "@/core/domain/shared/module-key";
import { buildTeamMemberRecord, createMemoryArticleCounts, createMemoryCollection } from "../../../fixtures/admin-repositories";

const ALL_MODULES: ModuleKey[] = ["services", "portfolio", "articles", "team", "stats", "testimonials", "partners", "vision"];
const NOW = "2026-11-20T03:00:00.000Z";

const validService = {
  slug: "penyusunan-sop",
  title: "Penyusunan SOP",
  summary: "Kami membantu menyusun SOP yang bisa dijalankan tim Anda.",
  bodyMd: "## Apa itu SOP?\n\nSOP adalah panduan kerja.",
  cover: null,
  metaTitle: "Penyusunan SOP Perusahaan Anda",
  metaDescription: "Layanan penyusunan SOP untuk usaha kecil dan menengah yang ingin proses kerjanya rapi, terdokumentasi, dan mudah diajarkan ke karyawan baru di tim Anda.",
  faq: [] as { question: string; answer: string }[],
};

const validArticle = {
  slug: "cara-menyusun-sop",
  title: "Cara menyusun SOP",
  metaTitle: "Cara Menyusun SOP yang Efektif",
  metaDescription: "Panduan praktis menyusun SOP untuk usaha kecil: mulai dari menentukan proses, menulis langkah, sampai menguji SOP bersama tim agar benar-benar dipakai.",
  lead: "SOP yang baik pendek dan bisa diikuti.",
  bodyMd: "## Mulai dari proses\n\nTulis langkahnya.",
  cover: null,
  authorId: "team-1",
  faq: [
    { question: "Apa itu SOP?", answer: "Panduan kerja." },
    { question: "Siapa yang menulis?", answer: "Pelaku proses." },
    { question: "Berapa lama?", answer: "Tergantung proses." },
  ],
};

function buildAdmin(options: { services?: ServiceRecord[]; articles?: ArticleRecord[]; team?: ReturnType<typeof buildTeamMemberRecord>[]; modules?: ModuleKey[] } = {}) {
  const services = createMemoryCollection("services", options.services ?? []);
  const articles = createMemoryCollection("articles", options.articles ?? []);
  const team = createMemoryCollection("team", options.team ?? [buildTeamMemberRecord()]);
  const shared = {
    articles: createMemoryArticleCounts(articles),
    team,
    siteName: async () => "Nusa Karya",
    enabledModules: options.modules ?? ALL_MODULES,
  };
  return {
    services,
    articles,
    team,
    serviceAdmin: createCollectionAdmin({ module: "services", repository: services, ...shared }),
    articleAdmin: createCollectionAdmin({ module: "articles", repository: articles, ...shared }),
    teamAdmin: createCollectionAdmin({ module: "team", repository: team, ...shared }),
  };
}

describe("save", () => {
  it("saves a draft service that has no meta data yet", async () => {
    const { serviceAdmin, services } = buildAdmin();

    const result = await serviceAdmin.save({ values: { ...validService, summary: null, metaTitle: null, metaDescription: null } });

    expect(result.ok).toBe(true);
    expect(services.records).toHaveLength(1);
    expect(services.records[0].isPublished).toBe(false);
  });

  it("rejects an invalid slug with a field error and stores nothing", async () => {
    const { serviceAdmin, services } = buildAdmin();

    const result = await serviceAdmin.save({ values: { ...validService, slug: "Halo Dunia" } });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(Object.keys(result.fieldErrors)).toContain("slug");
    }
    expect(services.records).toHaveLength(0);
  });

  it("publishes a complete service in one step", async () => {
    const { serviceAdmin, services } = buildAdmin();

    const result = await serviceAdmin.save({ values: validService, publish: true });

    expect(result.ok).toBe(true);
    expect(services.records[0].isPublished).toBe(true);
  });

  it("blocks publishing a service whose meta description is too short and leaves the stored item untouched", async () => {
    const stored: ServiceRecord = { id: "s1", ...validService, sortOrder: 1, isPublished: false, updatedAt: NOW };
    const { serviceAdmin, services } = buildAdmin({ services: [stored] });

    const result = await serviceAdmin.save({ id: "s1", values: { ...validService, metaDescription: "x".repeat(80) }, publish: true });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.metaDescription).toMatch(/minimal 120/);
    }
    expect(services.records[0].metaDescription).toBe(validService.metaDescription);
    expect(services.records[0].isPublished).toBe(false);
  });

  it("applies the publish rules when saving an item that is already published", async () => {
    const stored: ServiceRecord = { id: "s1", ...validService, sortOrder: 1, isPublished: true, updatedAt: NOW };
    const { serviceAdmin } = buildAdmin({ services: [stored] });

    const result = await serviceAdmin.save({ id: "s1", values: { ...validService, metaTitle: null } });

    expect(result.ok).toBe(false);
  });

  it("reports the old and the new slug when a published slug changes", async () => {
    const stored: ServiceRecord = { id: "s1", ...validService, sortOrder: 1, isPublished: true, updatedAt: NOW };
    const { serviceAdmin } = buildAdmin({ services: [stored] });

    const result = await serviceAdmin.save({ id: "s1", values: { ...validService, slug: "sop-baru" } });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.affected).toEqual({ module: "services", slugs: ["penyusunan-sop", "sop-baru"] });
    }
  });

  it("returns warnings such as an http link on success", async () => {
    const { serviceAdmin } = buildAdmin();

    const result = await serviceAdmin.save({ values: { ...validService, bodyMd: "Baca [sumber](http://contoh.id)." }, publish: true });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.warnings).toContain("Tautan http://contoh.id belum memakai https.");
    }
  });

  it("blocks a link to a module the theme turned off", async () => {
    const { serviceAdmin } = buildAdmin({ modules: ALL_MODULES.filter((module) => module !== "portfolio") });

    const result = await serviceAdmin.save({ values: { ...validService, bodyMd: "Lihat [proyek](/portofolio)." }, publish: true });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.blocking.join(" ")).toContain("/portofolio");
    }
  });
});

describe("articles", () => {
  it("cannot be published with only two faq entries", async () => {
    const { articleAdmin } = buildAdmin();

    const result = await articleAdmin.save({ values: { ...validArticle, faq: validArticle.faq.slice(0, 2) }, publish: true });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.faq).toMatch(/minimal 3/);
    }
  });

  it("cannot be published with an author who is not published", async () => {
    const { articleAdmin } = buildAdmin({ team: [buildTeamMemberRecord({ isPublished: false })] });

    const result = await articleAdmin.save({ values: validArticle, publish: true });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.authorId).toMatch(/terbit/);
    }
  });

  it("publishes with a published author and cannot be reordered by hand", async () => {
    const { articleAdmin, articles } = buildAdmin();

    expect((await articleAdmin.save({ values: validArticle, publish: true })).ok).toBe(true);
    expect(articles.records[0].status).toBe("published");

    const moved = await articleAdmin.move(articles.records[0].id, "up");
    expect(moved.ok).toBe(false);
  });
});

describe("setPublished", () => {
  it("refuses to publish a draft service without meta data", async () => {
    const stored: ServiceRecord = { id: "s1", ...validService, metaTitle: null, sortOrder: 1, isPublished: false, updatedAt: NOW };
    const { serviceAdmin, services } = buildAdmin({ services: [stored] });

    const result = await serviceAdmin.setPublished("s1", true);

    expect(result.ok).toBe(false);
    expect(services.records[0].isPublished).toBe(false);
  });

  it("publishes a complete service and withdraws it again", async () => {
    const stored: ServiceRecord = { id: "s1", ...validService, sortOrder: 1, isPublished: false, updatedAt: NOW };
    const { serviceAdmin, services } = buildAdmin({ services: [stored] });

    expect((await serviceAdmin.setPublished("s1", true)).ok).toBe(true);
    expect(services.records[0].isPublished).toBe(true);
    expect((await serviceAdmin.setPublished("s1", false)).ok).toBe(true);
    expect(services.records[0].isPublished).toBe(false);
  });
});

describe("team members who are authors", () => {
  const publishedArticle: ArticleRecord = { id: "a1", ...validArticle, status: "published", publishedAt: NOW, updatedAt: NOW };

  it("cannot be deleted while they wrote articles", async () => {
    const { teamAdmin, team } = buildAdmin({ articles: [publishedArticle] });

    const result = await teamAdmin.remove("team-1");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.blocking[0]).toBe("Anggota tim ini masih menjadi penulis 1 artikel.");
    }
    expect(team.records).toHaveLength(1);
  });

  it("cannot be withdrawn while they wrote a published article", async () => {
    const { teamAdmin, team } = buildAdmin({ articles: [publishedArticle] });

    const result = await teamAdmin.setPublished("team-1", false);

    expect(result.ok).toBe(false);
    expect(team.records[0].isPublished).toBe(true);
  });

  it("can be deleted and withdrawn when they wrote nothing", async () => {
    const { teamAdmin, team } = buildAdmin();

    expect((await teamAdmin.setPublished("team-1", false)).ok).toBe(true);
    expect((await teamAdmin.remove("team-1")).ok).toBe(true);
    expect(team.records).toHaveLength(0);
  });
});
