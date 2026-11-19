import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const MIGRATIONS_DIR = path.join(process.cwd(), "supabase", "migrations");
const fileNames = readdirSync(MIGRATIONS_DIR).filter((name) => name.endsWith(".sql"));
const files = fileNames.map((name) => ({ name, sql: readFileSync(path.join(MIGRATIONS_DIR, name), "utf8").toLowerCase() }));
const allSql = files.map((file) => file.sql).join("\n");

const CONTENT_TABLES = [
  "media",
  "site_settings",
  "home_content",
  "section_intros",
  "about_content",
  "company_vision",
  "mission_items",
  "company_values",
  "services",
  "portfolio_items",
  "team_members",
  "stats",
  "testimonials",
  "partners",
  "articles",
  "content_blocks",
  "content_block_items",
  "legal_pages",
];
const OTHER_TABLES = ["contact_messages", "admins"];

function schemaSql(): string {
  const schema = files.find((file) => file.name.endsWith("_schema.sql"));
  expect(schema).toBeDefined();
  return schema!.sql;
}

function rlsSql(): string {
  const rls = files.find((file) => file.name.endsWith("_rls.sql"));
  expect(rls).toBeDefined();
  return rls!.sql;
}

describe("supabase migrations", () => {
  it.each([...CONTENT_TABLES, ...OTHER_TABLES])("creates %s with row level security", (table) => {
    expect(schemaSql()).toContain(`create table public.${table} (`);
    expect(rlsSql()).toContain(`alter table public.${table} enable row level security`);
  });

  it.each(CONTENT_TABLES)("keeps updated_at current on %s", (table) => {
    expect(schemaSql()).toMatch(new RegExp(`create trigger set_updated_at before update on public\\.${table}\\b`));
  });

  it("lets admins read every row through is_admin()", () => {
    expect(rlsSql()).toContain("public.is_admin()");
    expect(rlsSql()).toMatch(/is_published = true or public\.is_admin\(\)/);
    expect(rlsSql()).toMatch(/status = 'published' or public\.is_admin\(\)/);
  });

  it.each(["is_admin", "set_updated_at", "submit_contact_message", "site_route_catalog", "articles_published_at"])(
    "defines the function %s",
    (name) => {
      expect(allSql).toMatch(new RegExp(`create (or replace )?function public\\.${name}\\(`));
    },
  );

  it("creates the public media bucket", () => {
    expect(allSql).toContain("'media'");
    expect(allSql).toContain("storage.buckets");
    expect(allSql).toContain("storage.objects");
  });

  it("only adds: no drops or renames", () => {
    for (const forbidden of ["drop table", "drop column", "rename column", "rename to"]) {
      expect(allSql).not.toContain(forbidden);
    }
  });

  it("orders file names ascending with the timestamp_name pattern", () => {
    expect(fileNames).toEqual([...fileNames].sort());
    for (const name of fileNames) {
      expect(name).toMatch(/^\d{14}_[a-z_]+\.sql$/);
    }
  });

  it("limits the contact rate by hashed ip", () => {
    expect(allSql).toContain("p_ip_hash");
    expect(allSql).toContain("rate_limited");
  });
});
