import { spawn } from "node:child_process";
import { loadEnvLocal, requireEnv } from "./lib/load-env";

async function main(): Promise<void> {
  await loadEnvLocal();
  const dbUrl = requireEnv("SUPABASE_DB_URL");

  const exitCode = await new Promise<number>((resolve, reject) => {
    const child = spawn("npx", ["supabase", "db", "push", "--db-url", dbUrl], { stdio: "inherit" });
    child.on("error", reject);
    child.on("close", (code) => resolve(code ?? 1));
  });

  if (exitCode !== 0) {
    throw new Error(`supabase db push exited with code ${exitCode}`);
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
