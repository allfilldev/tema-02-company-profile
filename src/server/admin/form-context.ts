import { notFound } from "next/navigation";
import { visibleAdminModules } from "@/core/application/admin/visible-modules";
import type { AdminModule, TeamMemberRecord } from "@/core/domain/admin/records";
import type { MediaAsset } from "@/core/domain/shared/media-asset";
import type { AdminDeps } from "@/server/admin/admin-deps";
import { toMediaAsset } from "@/server/admin/resolve-media";

export type FormContext = {
  media: MediaAsset[];
  siteName: string;
  authors: TeamMemberRecord[];
};

export function assertModuleVisible(deps: AdminDeps, module: AdminModule): void {
  if (!visibleAdminModules(deps.enabledModules).includes(module)) {
    notFound();
  }
}

export async function loadFormContext(deps: AdminDeps, module: AdminModule): Promise<FormContext> {
  const [mediaRecords, siteName, authors] = await Promise.all([
    deps.repos.media.list(),
    deps.siteName(),
    module === "articles" ? deps.repos.collections.team.list() : Promise.resolve([]),
  ]);

  return { media: mediaRecords.map(toMediaAsset), siteName, authors };
}
