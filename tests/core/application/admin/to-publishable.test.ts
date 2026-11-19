import { describe, expect, it } from "vitest";
import {
  missingPublishFields,
  toPublishableArticle,
  toPublishablePartner,
  toPublishableService,
  toPublishableTeamMember,
} from "@/core/application/admin/to-publishable";
import type { ArticleRecord, ServiceRecord, TeamMemberRecord } from "@/core/domain/admin/records";

const service: ServiceRecord = {
  id: "s1",
  slug: "penyusunan-sop",
  title: "Penyusunan SOP",
  summary: "Ringkasan",
  bodyMd: "Isi",
  cover: null,
  metaTitle: "Penyusunan SOP Perusahaan",
  metaDescription: "x".repeat(130),
  faq: [],
  sortOrder: 1,
  isPublished: false,
  updatedAt: "2026-11-20T03:00:00.000Z",
};

const article: ArticleRecord = {
  id: "a1",
  slug: "cara-menyusun-sop",
  title: "Cara menyusun SOP",
  metaTitle: "Cara Menyusun SOP",
  metaDescription: "x".repeat(130),
  lead: "Lead",
  bodyMd: "Isi",
  cover: null,
  authorId: "t1",
  faq: [],
  status: "draft",
  publishedAt: null,
  updatedAt: "2026-11-20T03:00:00.000Z",
};

describe("toPublishableService", () => {
  it("returns the public entity when every required field is filled", () => {
    expect(toPublishableService(service)).toEqual({
      id: "s1",
      slug: "penyusunan-sop",
      title: "Penyusunan SOP",
      summary: "Ringkasan",
      bodyMd: "Isi",
      cover: null,
      metaTitle: "Penyusunan SOP Perusahaan",
      metaDescription: "x".repeat(130),
      faq: [],
      sortOrder: 1,
      updatedAt: "2026-11-20T03:00:00.000Z",
    });
  });

  it("returns null and lists the missing fields when something is empty", () => {
    const incomplete = { ...service, metaTitle: null, summary: "" };

    expect(toPublishableService(incomplete)).toBeNull();
    expect(missingPublishFields("services", incomplete)).toEqual(["summary", "metaTitle"]);
  });
});

describe("toPublishableArticle", () => {
  it("is null without an author or a meta title", () => {
    expect(toPublishableArticle({ ...article, authorId: null })).toBeNull();
    expect(toPublishableArticle({ ...article, metaTitle: null })).toBeNull();
    expect(missingPublishFields("articles", { ...article, authorId: null, lead: null })).toEqual(["lead", "authorId"]);
  });

  it("falls back to the update time when the article has never been published", () => {
    expect(toPublishableArticle(article)?.publishedAt).toBe("2026-11-20T03:00:00.000Z");
    expect(toPublishableArticle({ ...article, publishedAt: "2026-01-01T00:00:00.000Z" })?.publishedAt).toBe("2026-01-01T00:00:00.000Z");
  });
});

describe("other modules", () => {
  it("needs a job title and bio for a team member", () => {
    const member: TeamMemberRecord = { id: "t1", name: "Rina", jobTitle: null, bio: "Bio", photo: null, yearsExperience: null, profiles: [], sortOrder: 1, isPublished: false, updatedAt: "2026-11-20T03:00:00.000Z" };

    expect(toPublishableTeamMember(member)).toBeNull();
    expect(missingPublishFields("team", member)).toEqual(["jobTitle"]);
    expect(toPublishableTeamMember({ ...member, jobTitle: "Konsultan" })?.jobTitle).toBe("Konsultan");
  });

  it("always publishes a partner", () => {
    expect(toPublishablePartner({ id: "p1", name: "Mitra", logo: null, url: null, sortOrder: 1, isPublished: false, updatedAt: "2026-11-20T03:00:00.000Z" })).toEqual({
      id: "p1",
      name: "Mitra",
      logo: null,
      url: null,
      sortOrder: 1,
    });
  });
});
