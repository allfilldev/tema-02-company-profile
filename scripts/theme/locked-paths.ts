export const LOCKED_PATHS: readonly string[] = [
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
];

export const REVIEW_PATHS: readonly string[] = [
  "src/components/site/contract/",
  "package.json",
  "package-lock.json",
  "tests/",
];

export interface ThemeCheckReport {
  locked: string[];
  review: string[];
}

function matchesAny(file: string, entries: readonly string[]): boolean {
  return entries.some((entry) => (entry.endsWith("/") ? file.startsWith(entry) : file === entry));
}

export function classifyChangedFiles(files: readonly string[]): ThemeCheckReport {
  const unique = [...new Set(files)].sort();

  return {
    locked: unique.filter((file) => matchesAny(file, LOCKED_PATHS)),
    review: unique.filter((file) => matchesAny(file, REVIEW_PATHS)),
  };
}
