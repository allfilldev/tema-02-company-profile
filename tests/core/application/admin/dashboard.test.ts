import { describe, expect, it } from "vitest";
import { getDashboardCounts } from "@/core/application/admin/dashboard";
import type { AdminCollections } from "@/core/domain/admin/admin-repositories";
import { buildTeamMemberRecord, createMemoryCollection } from "../../../fixtures/admin-repositories";

function collections(): AdminCollections {
  return {
    services: createMemoryCollection("services", [
      { id: "s1", slug: "a", title: "A", summary: null, bodyMd: "", cover: null, metaTitle: null, metaDescription: null, faq: [], sortOrder: 1, isPublished: true, updatedAt: "2026-11-20T03:00:00.000Z" },
      { id: "s2", slug: "b", title: "B", summary: null, bodyMd: "", cover: null, metaTitle: null, metaDescription: null, faq: [], sortOrder: 2, isPublished: false, updatedAt: "2026-11-20T03:00:00.000Z" },
    ]),
    portfolio: createMemoryCollection("portfolio"),
    team: createMemoryCollection("team", [buildTeamMemberRecord()]),
    stats: createMemoryCollection("stats", [{ id: "st1", key: "completed_projects", label: "Proyek", value: 10, suffix: null, sortOrder: 1, updatedAt: "2026-11-20T03:00:00.000Z" }]),
    testimonials: createMemoryCollection("testimonials"),
    partners: createMemoryCollection("partners"),
    articles: createMemoryCollection("articles"),
  };
}

const messages = { list: async () => [], markRead: async () => undefined, remove: async () => undefined, countUnread: async () => 3 };

describe("getDashboardCounts", () => {
  it("counts totals and published items per visible module and the unread messages", async () => {
    const result = await getDashboardCounts({ collections: collections(), messages }, ["services", "team", "stats"]);

    expect(result.modules).toEqual([
      { module: "services", total: 2, published: 1 },
      { module: "team", total: 1, published: 1 },
      { module: "stats", total: 1, published: null },
    ]);
    expect(result.unreadMessages).toBe(3);
  });

  it("leaves out statistics when the stats module is off and adds team when articles are on", async () => {
    const result = await getDashboardCounts({ collections: collections(), messages }, ["articles"]);

    expect(result.modules.map((entry) => entry.module)).toEqual(["team", "articles"]);
  });
});
