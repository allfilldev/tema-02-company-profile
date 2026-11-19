import { readFile } from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";
import { loadEnvLocal, requireEnv } from "./lib/load-env";

const CONFIRM_FLAG = "--yes";

async function main(): Promise<void> {
  if (!process.argv.includes(CONFIRM_FLAG)) {
    throw new Error(
      `This empties every content table, the media table, and the contact messages of the project in SUPABASE_DB_URL. Run again with ${CONFIRM_FLAG} to continue.`,
    );
  }

  await loadEnvLocal();
  const dbUrl = requireEnv("SUPABASE_DB_URL");
  const seed = await readFile(path.join(process.cwd(), "supabase", "seed.sql"), "utf8");
  const sql = postgres(dbUrl, { max: 1 });

  try {
    await sql.unsafe(seed);
    console.log("seed.sql applied");
  } finally {
    await sql.end();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
