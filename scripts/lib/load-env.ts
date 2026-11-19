import { readFile } from "node:fs/promises";
import path from "node:path";
import { parseEnvFile } from "./parse-env";

export async function loadEnvLocal(directory: string = process.cwd()): Promise<void> {
  try {
    const text = await readFile(path.join(directory, ".env.local"), "utf8");
    for (const [name, value] of Object.entries(parseEnvFile(text))) {
      if (process.env[name] === undefined) {
        process.env[name] = value;
      }
    }
  } catch {
    return;
  }
}

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set. Add it to .env.local.`);
  }
  return value;
}
