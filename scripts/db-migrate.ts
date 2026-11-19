import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";
import { loadEnvLocal, requireEnv } from "./lib/load-env";
import { pendingMigrations } from "./supabase/migration-runner";

const MIGRATIONS_DIR = path.join(process.cwd(), "supabase", "migrations");

async function main(): Promise<void> {
  await loadEnvLocal();
  const sql = postgres(requireEnv("SUPABASE_DB_URL"), { max: 1, ssl: "require" });

  try {
    await sql`create schema if not exists supabase_migrations`;
    await sql`
      create table if not exists supabase_migrations.schema_migrations (
        version text primary key,
        statements text[],
        name text
      )
    `;

    const applied = (await sql`select version from supabase_migrations.schema_migrations`).map((row) => String(row.version));
    const pending = pendingMigrations(await readdir(MIGRATIONS_DIR), applied);

    if (pending.length === 0) {
      console.log("No pending migrations.");
      return;
    }

    for (const migration of pending) {
      const statements = await readFile(path.join(MIGRATIONS_DIR, migration.fileName), "utf8");
      await sql.begin(async (transaction) => {
        await transaction.unsafe(statements);
        await transaction`
          insert into supabase_migrations.schema_migrations (version, name, statements)
          values (${migration.version}, ${migration.name}, ${[statements]})
        `;
      });
      console.log(`Applied ${migration.fileName}`);
    }
  } finally {
    await sql.end();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
