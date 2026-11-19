import { ModuleList } from "@/components/admin/pages/module-views";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/shared/page-header";
import type { AdminModule } from "@/core/domain/admin/records";
import { ADMIN_MODULE_ITEM_NAMES, ADMIN_MODULE_LABELS } from "@/lib/admin/admin-menu";
import { ADMIN_MODULE_PATHS } from "@/lib/site/routes";
import { getAdminDeps } from "@/server/admin/admin-deps";
import { assertModuleVisible } from "@/server/admin/form-context";
import { listActionsFor } from "@/server/admin/list-actions";

export async function ModuleListPage({ module }: { module: AdminModule }) {
  const deps = await getAdminDeps();
  assertModuleVisible(deps, module);
  const records = await deps.repos.collections[module].list();

  return (
    <section className="flex flex-col gap-6">
      <PageHeader
        title={ADMIN_MODULE_LABELS[module]}
        action={<ButtonLink href={`${ADMIN_MODULE_PATHS[module]}/baru`}>{`Tambah ${ADMIN_MODULE_ITEM_NAMES[module]}`}</ButtonLink>}
      />
      <ModuleList module={module} records={records} actions={listActionsFor(module)} />
    </section>
  );
}
