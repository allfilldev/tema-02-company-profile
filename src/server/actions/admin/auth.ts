"use server";

import { notFound, redirect } from "next/navigation";
import { loginErrorMessage, NOT_ADMIN_MESSAGE, parseLoginForm, type LoginFormState } from "@/lib/admin/login-form";
import { ADMIN_ROUTES } from "@/lib/site/routes";
import { isDemoDataSource } from "@/server/site/site-env";
import { createSessionSupabaseClient } from "@/server/supabase/session-client";

export async function signIn(_state: LoginFormState, formData: FormData): Promise<LoginFormState> {
  if (isDemoDataSource()) {
    notFound();
  }

  const parsed = parseLoginForm(formData);
  if ("error" in parsed) {
    return { error: parsed.error, email: String(formData.get("email") ?? "").trim() };
  }

  const client = await createSessionSupabaseClient();
  const { error } = await client.auth.signInWithPassword(parsed);
  if (error) {
    return { error: loginErrorMessage(error.code), email: parsed.email };
  }

  const { data: isAdmin } = await client.rpc("is_admin");
  if (isAdmin !== true) {
    await client.auth.signOut();
    return { error: NOT_ADMIN_MESSAGE, email: parsed.email };
  }

  redirect(ADMIN_ROUTES.root);
}

export async function signOut(): Promise<void> {
  if (isDemoDataSource()) {
    notFound();
  }

  const client = await createSessionSupabaseClient();
  await client.auth.signOut();
  redirect(ADMIN_ROUTES.login);
}
