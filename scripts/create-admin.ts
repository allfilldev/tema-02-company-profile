import { createClient } from "@supabase/supabase-js";
import { loadEnvLocal, requireEnv } from "./lib/load-env";
import { validateAdminEmail, validateAdminPassword } from "./supabase/admin-input";

const USAGE = "Usage: npm run admin:create -- <email>";
const CTRL_C = "\u0003";

function promptHidden(question: string): Promise<string> {
  if (!process.stdin.isTTY) {
    throw new Error("Run this command in an interactive terminal so the password is not echoed.");
  }

  process.stdout.write(question);
  const stdin = process.stdin;
  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding("utf8");

  return new Promise((resolve, reject) => {
    let value = "";

    function finish(): void {
      stdin.removeListener("data", onData);
      stdin.setRawMode(false);
      stdin.pause();
      process.stdout.write("\n");
    }

    function onData(chunk: string): void {
      for (const character of chunk) {
        if (character === CTRL_C) {
          finish();
          reject(new Error("Cancelled."));
          return;
        }
        if (character === "\r" || character === "\n") {
          finish();
          resolve(value);
          return;
        }
        value = character === "\u007f" || character === "\b" ? value.slice(0, -1) : value + character;
      }
    }

    stdin.on("data", onData);
  });
}

async function main(): Promise<void> {
  const email = process.argv[2]?.trim();
  if (!email) {
    throw new Error(USAGE);
  }
  const emailError = validateAdminEmail(email);
  if (emailError) {
    throw new Error(emailError);
  }

  await loadEnvLocal();
  const url = requireEnv("SUPABASE_URL");
  const secretKey = requireEnv("SUPABASE_SECRET_KEY");

  const password = await promptHidden("Password: ");
  const confirmation = await promptHidden("Repeat password: ");
  const passwordError = validateAdminPassword(password, confirmation);
  if (passwordError) {
    throw new Error(passwordError);
  }

  const supabase = createClient(url, secretKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
  if (error || !data.user) {
    throw new Error(`Could not create the user: ${error?.message ?? "unknown error"}`);
  }

  const { error: adminError } = await supabase.from("admins").insert({ user_id: data.user.id });
  if (adminError) {
    throw new Error(`The user was created but could not be made an admin: ${adminError.message}`);
  }

  console.log(`Admin created: ${email}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
