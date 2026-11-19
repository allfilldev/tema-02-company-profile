import "server-only";
import { notFound, redirect } from "next/navigation";
import { ADMIN_ROUTES } from "@/lib/site/routes";
import { isDemoDataSource } from "@/server/site/site-env";
import { createSessionSupabaseClient } from "@/server/supabase/session-client";

export type AdminSession = {
  userId: string;
  email: string;
};

type AdminState = { kind: "anonymous" } | { kind: "not-admin" } | { kind: "admin"; session: AdminSession };

async function readAdminState(): Promise<AdminState> {
  const client = await createSessionSupabaseClient();
  const { data, error } = await client.auth.getUser();

  if (error || !data.user) {
    return { kind: "anonymous" };
  }

  const { data: isAdmin, error: rpcError } = await client.rpc("is_admin");
  if (rpcError || isAdmin !== true) {
    return { kind: "not-admin" };
  }

  return { kind: "admin", session: { userId: data.user.id, email: data.user.email ?? "" } };
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const state = await readAdminState();
  return state.kind === "admin" ? state.session : null;
}

export async function requireAdmin(): Promise<AdminSession> {
  if (isDemoDataSource()) {
    notFound();
  }

  const state = await readAdminState();

  if (state.kind === "anonymous") {
    redirect(ADMIN_ROUTES.login);
  }
  if (state.kind === "not-admin") {
    notFound();
  }
  return state.session;
}
