import { describe, expect, it } from "vitest";
import { parseMigrationFileName, pendingMigrations } from "../../../scripts/supabase/migration-runner";

describe("parseMigrationFileName", () => {
  it("splits the version and the name", () => {
    expect(parseMigrationFileName("20261120000100_schema.sql")).toEqual({ version: "20261120000100", name: "schema", fileName: "20261120000100_schema.sql" });
  });

  it.each(["schema.sql", "2026112000010_schema.sql", "20261120000100_Schema.sql", "20261120000100_schema.txt"])("rejects %s", (fileName) => {
    expect(parseMigrationFileName(fileName)).toBeNull();
  });
});

describe("pendingMigrations", () => {
  const names = ["20261120000300_functions.sql", "20261120000100_schema.sql", "notes.md", "20261120000200_rls.sql"];

  it("returns every migration in version order when none is applied", () => {
    expect(pendingMigrations(names, []).map((migration) => migration.version)).toEqual([
      "20261120000100",
      "20261120000200",
      "20261120000300",
    ]);
  });

  it("skips the applied versions", () => {
    expect(pendingMigrations(names, ["20261120000100", "20261120000200"]).map((migration) => migration.name)).toEqual(["functions"]);
  });

  it("refuses to run when an applied version is missing on disk", () => {
    expect(() => pendingMigrations(names, ["20250101000000"])).toThrow(/20250101000000/);
  });
});
