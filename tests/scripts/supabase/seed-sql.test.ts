import { describe, expect, it } from "vitest";
import { generalPack } from "@/content/packs/general";
import type { ContentPack } from "@/core/domain/content-pack/content-pack";
import { buildSeedSql, SEED_TRUNCATE_TABLES } from "../../../scripts/supabase/seed-sql";
import { stableUuid } from "../../../scripts/supabase/stable-uuid";

const sql = buildSeedSql(generalPack);

function countInserts(table: string): number {
  const match = sql.match(new RegExp(`insert into public\\.${table} \\([^)]*\\) values\\n([\\s\\S]*?);\\n`));
  expect(match, `insert into ${table}`).not.toBeNull();
  return (match![1].match(/^\(/gm) ?? []).length;
}

describe("buildSeedSql", () => {
  it("runs in one transaction", () => {
    expect(sql.startsWith("begin;")).toBe(true);
    expect(sql.trimEnd().endsWith("commit;")).toBe(true);
  });

  it("empties content, media, and messages in one truncate but never admins or auth", () => {
    const truncates = sql.match(/truncate table [^;]+;/g) ?? [];

    expect(truncates).toHaveLength(1);
    for (const table of ["media", "contact_messages", "services", "articles", "site_settings", "content_block_items"]) {
      expect(truncates[0]).toContain(`public.${table}`);
    }
    expect(truncates[0]).not.toContain("admins");
    expect(sql).not.toContain("auth.");
    expect(SEED_TRUNCATE_TABLES).not.toContain("admins");
  });

  it("inserts one row per pack entity", () => {
    expect(countInserts("services")).toBe(generalPack.services.length);
    expect(countInserts("portfolio_items")).toBe(generalPack.portfolio.length);
    expect(countInserts("team_members")).toBe(generalPack.team.length);
    expect(countInserts("stats")).toBe(generalPack.stats.length);
    expect(countInserts("testimonials")).toBe(generalPack.testimonials.length);
    expect(countInserts("partners")).toBe(generalPack.partners.length);
    expect(countInserts("articles")).toBe(generalPack.articles.length);
    expect(countInserts("content_blocks")).toBe(generalPack.contentBlocks.length);
    expect(countInserts("legal_pages")).toBe(generalPack.legalPages.length);
    expect(countInserts("section_intros")).toBe(generalPack.sectionIntros.length);
  });

  it("links each article to the same stable id as its team member insert", () => {
    for (const article of generalPack.articles) {
      const authorId = stableUuid("team", article.authorId);
      expect(sql.split(authorId).length - 1).toBeGreaterThanOrEqual(2);
    }
  });

  it("inserts media before the rows that reference it and uses public paths", () => {
    expect(sql.indexOf("insert into public.media")).toBeLessThan(sql.indexOf("insert into public.services"));
    expect(sql).toContain("'/demo/general/hero.webp'");
  });

  it("publishes everything and keeps the article publish dates from the pack", () => {
    expect(sql).toContain("'published'");
    expect(sql).toContain(generalPack.articles[0].publishedAt);
  });

  it("escapes single quotes in text", () => {
    const pack: ContentPack = structuredClone(generalPack);
    pack.services[0].title = "Layanan 'khusus' kami";

    expect(buildSeedSql(pack)).toContain("Layanan ''khusus'' kami");
  });

  it("uses the supplied media size lookup", () => {
    const withSizes = buildSeedSql(generalPack, { mediaSizeBytes: () => 54321 });

    expect(withSizes).toContain("54321");
  });

  it("skips the insert for every empty collection instead of emitting invalid sql", () => {
    const pack: ContentPack = structuredClone(generalPack);
    pack.partners = [];
    pack.testimonials = [];
    pack.contentBlocks = [];
    pack.stats = [];
    pack.vision.missions = [];

    const emptySql = buildSeedSql(pack);

    expect(emptySql).not.toMatch(/values\n;/);
    for (const table of ["partners", "testimonials", "content_blocks", "content_block_items", "stats", "mission_items"]) {
      expect(emptySql).not.toContain(`insert into public.${table} `);
    }
    expect(emptySql).toContain("insert into public.services ");
  });

  it("rejects a pack that fails the content pack schema", () => {
    const pack: ContentPack = structuredClone(generalPack);
    pack.services[0].slug = "Slug Tidak Valid";

    expect(() => buildSeedSql(pack)).toThrow(/services/);
  });
});
