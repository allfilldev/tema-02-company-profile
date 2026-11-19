import "server-only";
import type { ModuleKey } from "@/core/domain/shared/module-key";
import { themeConfig } from "@/config/theme";
import type { AdminClient } from "@/infrastructure/supabase/admin-client";
import { createSupabaseAdminRepositories, type SupabaseAdminRepositories } from "@/infrastructure/supabase/admin-repositories";
import { requireAdmin, type AdminSession } from "@/server/admin/admin-session";
import { createSessionSupabaseClient } from "@/server/supabase/session-client";

export type AdminDeps = {
  session: AdminSession;
  repos: SupabaseAdminRepositories;
  siteName: () => Promise<string>;
  enabledModules: readonly ModuleKey[];
};

export async function getAdminDeps(): Promise<AdminDeps> {
  const session = await requireAdmin();
  const client = (await createSessionSupabaseClient()) as unknown as AdminClient;
  const repos = createSupabaseAdminRepositories(client);

  return {
    session,
    repos,
    siteName: async () => (await repos.settings.get()).siteName,
    enabledModules: themeConfig.enabledModules,
  };
}
