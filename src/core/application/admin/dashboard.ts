import type { AdminCollections, MessageAdminRepository } from "@/core/domain/admin/admin-repositories";
import type { AdminModule } from "@/core/domain/admin/records";
import type { ModuleKey } from "@/core/domain/shared/module-key";
import { visibleAdminModules } from "@/core/application/admin/visible-modules";

export type DashboardCount = {
  module: AdminModule;
  total: number;
  published: number | null;
};

export type DashboardCounts = {
  modules: DashboardCount[];
  unreadMessages: number;
};

function isPublishedRecord(record: object): boolean {
  if ("isPublished" in record) return record.isPublished === true;
  if ("status" in record) return record.status === "published";
  return false;
}

export async function getDashboardCounts(
  deps: { collections: AdminCollections; messages: MessageAdminRepository },
  enabledModules: readonly ModuleKey[],
): Promise<DashboardCounts> {
  const [modules, unreadMessages] = await Promise.all([
    Promise.all(
      visibleAdminModules(enabledModules).map(async (module): Promise<DashboardCount> => {
        const records: object[] = await deps.collections[module].list();
        return {
          module,
          total: records.length,
          published: module === "stats" ? null : records.filter(isPublishedRecord).length,
        };
      }),
    ),
    deps.messages.countUnread(),
  ]);

  return { modules, unreadMessages };
}
