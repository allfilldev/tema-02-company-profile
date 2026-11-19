import { readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { themeConfig } from "../src/config/theme";
import { CONTENT_PACKS } from "../src/content/packs";
import { buildSeedSql } from "./supabase/seed-sql";

const SEED_PATH = path.join(process.cwd(), "supabase", "seed.sql");

async function main(): Promise<void> {
  const pack = CONTENT_PACKS[themeConfig.contentPack];

  if (!pack) {
    throw new Error(`Content pack "${themeConfig.contentPack}" is not registered in CONTENT_PACKS`);
  }

  const sizes = new Map<string, number>();
  const probe = buildSeedSql(pack);
  const urls = [...probe.matchAll(/'(\/demo\/[^']+\.webp)'/g)].map((match) => match[1]);

  for (const url of new Set(urls)) {
    try {
      sizes.set(url, (await stat(path.join(process.cwd(), "public", url))).size);
    } catch {
      sizes.set(url, 0);
    }
  }

  await writeFile(SEED_PATH, buildSeedSql(pack, { mediaSizeBytes: (asset) => sizes.get(asset.url) ?? 0 }));
  console.log(`seed.sql written for pack "${themeConfig.contentPack}" (${(await readFile(SEED_PATH, "utf8")).length} characters)`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
