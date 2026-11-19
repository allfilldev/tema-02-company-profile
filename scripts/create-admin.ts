import { createClient } from "@supabase/supabase-js";
import { loadEnvLocal, requireEnv } from "./lib/load-env";
import { validateAdminEmail, validateAdminPassword } from "./supabase/admin-input";
import { applyKeystrokes, INITIAL_HIDDEN_INPUT } from "./supabase/hidden-input";

const USAGE = "Usage: npm run admin:create -- <email>";

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
    let state = INITIAL_HIDDEN_INPUT;

    function onData(chunk: string): void {
      state = applyKeystrokes(state, chunk);
      if (!state.done) {
        return;
      }
      stdin.removeListener("data", onData);
      stdin.setRawMode(false);
      stdin.pause();
      process.stdout.write("\n");
      if (state.cancelled) {
        reject(new Error("Cancelled."));
        return;
      }
      resolve(state.value);
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
