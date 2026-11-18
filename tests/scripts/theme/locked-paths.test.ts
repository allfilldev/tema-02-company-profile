import { describe, expect, it } from "vitest";
import { classifyChangedFiles, LOCKED_PATHS, REVIEW_PATHS } from "../../../scripts/theme/locked-paths";

describe("classifyChangedFiles", () => {
  it("lists the documented locked and review paths", () => {
    expect([...LOCKED_PATHS]).toEqual([
      "src/core/",
      "src/infrastructure/",
      "src/server/",
      "src/lib/",
      "src/app/",
      "src/proxy.ts",
      "src/content/packs/",
      "src/components/admin/",
      "supabase/",
      "docs/rules/",
      "scripts/",
      "next.config.ts",
    ]);
    expect([...REVIEW_PATHS]).toEqual([
      "src/components/site/contract/",
      "package.json",
      "package-lock.json",
      "tests/",
    ]);
  });

  it("marks files in locked folders as locked", () => {
    const files = [
      "src/core/domain/x.ts",
      "src/proxy.ts",
      "src/app/layout.tsx",
      "src/content/packs/general/home.ts",
      "supabase/migrations/1.sql",
      "docs/rules/rules.md",
      "src/components/admin/a.tsx",
      "src/server/container.ts",
      "src/lib/seo/title.ts",
      "src/infrastructure/images/optimize-webp.ts",
      "scripts/create-theme.ts",
      "next.config.ts",
    ];

    expect(classifyChangedFiles(files)).toEqual({ locked: [...files].sort(), review: [] });
  });

  it("marks contract components, dependencies, and tests for review", () => {
    const files = ["src/components/site/contract/x.tsx", "package.json", "package-lock.json", "tests/lib/a.test.ts"];

    expect(classifyChangedFiles(files)).toEqual({ locked: [], review: [...files].sort() });
  });

  it("ignores files the theme may change", () => {
    const files = [
      "src/config/theme.ts",
      "src/styles/fonts.ts",
      "src/components/ui/button.tsx",
      "src/components/site/views/home-view.tsx",
      "src/components/skeletons/route-skeleton.tsx",
      "public/favicon.ico",
      "THEME.md",
    ];

    expect(classifyChangedFiles(files)).toEqual({ locked: [], review: [] });
  });

  it("does not confuse look-alike names with locked paths", () => {
    expect(classifyChangedFiles(["src/library/a.ts", "src/core-extras/a.ts", "src/proxy.tsx"])).toEqual({
      locked: [],
      review: [],
    });
  });

  it("returns sorted results without duplicates", () => {
    const report = classifyChangedFiles(["src/lib/b.ts", "src/core/a.ts", "src/lib/b.ts"]);

    expect(report.locked).toEqual(["src/core/a.ts", "src/lib/b.ts"]);
  });
});
