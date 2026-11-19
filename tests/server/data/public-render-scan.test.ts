import { mkdtemp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

const FORBIDDEN_IMPORTS = ["next/headers", "@supabase/ssr"];
const PUBLIC_ROOTS = ["src/app", "src/components/site", "src/server/site", "src/server/data"];
const ADMIN_PREFIX = path.join("src", "app", "admin");

async function collectFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const fullPath = path.join(directory, entry.name);
      return entry.isDirectory() ? collectFiles(fullPath) : Promise.resolve([fullPath]);
    }),
  );
  return nested.flat();
}

async function findForbiddenImports(root: string, directories: string[], skipPrefix: string): Promise<string[]> {
  const offenders: string[] = [];
  for (const directory of directories) {
    for (const file of await collectFiles(path.join(root, directory))) {
      if (path.relative(root, file).startsWith(skipPrefix)) {
        continue;
      }
      const content = await readFile(file, "utf8");
      if (FORBIDDEN_IMPORTS.some((name) => content.includes(`"${name}"`))) {
        offenders.push(path.relative(root, file));
      }
    }
  }
  return offenders;
}

function countCachedLoaders(source: string): { directives: number; loaders: number } {
  return {
    directives: (source.match(/["']use cache["']/g) ?? []).length,
    loaders: (source.match(/^async function load[A-Z]\w*/gm) ?? []).length,
  };
}

describe("public render paths", () => {
  it("never read cookies or the session on public pages", async () => {
    expect(await findForbiddenImports(process.cwd(), PUBLIC_ROOTS, ADMIN_PREFIX)).toEqual([]);
  });

  it("detects a forbidden import in a sample tree", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "render-scan-"));
    try {
      await mkdir(path.join(root, "pages"), { recursive: true });
      await mkdir(path.join(root, "src", "app", "admin"), { recursive: true });
      await writeFile(path.join(root, "pages", "bad.tsx"), 'import { cookies } from "next/headers";\n');
      await writeFile(path.join(root, "src", "app", "admin", "ok.tsx"), 'import { cookies } from "next/headers";\n');

      expect(await findForbiddenImports(root, ["pages", "src/app"], ADMIN_PREFIX)).toEqual([path.join("pages", "bad.tsx")]);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("caches every supabase read loader", async () => {
    const source = await readFile(path.join(process.cwd(), "src/server/data/cached-repositories.ts"), "utf8");
    const { directives, loaders } = countCachedLoaders(source);

    expect(loaders).toBeGreaterThanOrEqual(18);
    expect(directives).toBe(loaders);
  });

  it("counts loaders and directives in a sample source", () => {
    expect(countCachedLoaders('async function loadA() {\n  "use cache";\n}\nasync function loadB() {\n}\n')).toEqual({
      directives: 1,
      loaders: 2,
    });
  });
});
