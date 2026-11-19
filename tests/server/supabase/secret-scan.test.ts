import { mkdtemp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

const FORBIDDEN = ["SUPABASE_SECRET_KEY", "SUPABASE_DB_URL"];

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

async function findOffenders(directory: string): Promise<string[]> {
  const offenders: string[] = [];
  for (const file of await collectFiles(directory)) {
    const content = await readFile(file, "utf8");
    if (FORBIDDEN.some((name) => content.includes(name))) {
      offenders.push(file);
    }
  }
  return offenders;
}

describe("secret key scan", () => {
  it("finds no secret key names anywhere in src", async () => {
    expect(await findOffenders(path.join(process.cwd(), "src"))).toEqual([]);
  });

  it("detects a secret key name in a sample tree", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "secret-scan-"));
    try {
      await mkdir(path.join(root, "nested"), { recursive: true });
      await writeFile(path.join(root, "nested", "leak.ts"), "const key = process.env.SUPABASE_SECRET_KEY;\n");
      await writeFile(path.join(root, "clean.ts"), "export const ok = 1;\n");

      expect(await findOffenders(root)).toEqual([path.join(root, "nested", "leak.ts")]);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
