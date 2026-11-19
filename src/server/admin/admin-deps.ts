import "server-only";
import type { MediaAsset } from "@/core/domain/shared/media-asset";
import type { ModuleKey } from "@/core/domain/shared/module-key";
import { themeConfig } from "@/config/theme";
import type { MediaStorage } from "@/core/application/admin/media-upload";
import type { AdminClient } from "@/infrastructure/supabase/admin-client";
import { createSupabaseMediaStorage } from "@/infrastructure/supabase/media-storage";
import { createSupabaseAdminRepositories, type SupabaseAdminRepositories } from "@/infrastructure/supabase/admin-repositories";
import { requireAdmin, type AdminSession } from "@/server/admin/admin-session";
import { createSessionSupabaseClient } from "@/server/supabase/session-client";

export type SiteBrand = { name: string; logo: MediaAsset | null };

export type AdminDeps = {
  session: AdminSession;
  repos: SupabaseAdminRepositories;
  storage: MediaStorage;
  siteName: () => Promise<string>;
  siteBrand: () => Promise<SiteBrand>;
  enabledModules: readonly ModuleKey[];
};

export async function getAdminDeps(): Promise<AdminDeps> {
  const session = await requireAdmin();
  const sessionClient = await createSessionSupabaseClient();
  const repos = createSupabaseAdminRepositories(sessionClient as unknown as AdminClient);

  return {
    session,
    repos,
    storage: createSupabaseMediaStorage(sessionClient),
    siteName: async () => (await repos.settings.get()).siteName,
    siteBrand: async () => {
      const { siteName, logo } = await repos.settings.get();
      return { name: siteName, logo };
    },
    enabledModules: themeConfig.enabledModules,
  };
}
