import { ModuleList } from "@/components/admin/pages/module-views";
import { ButtonLink } from "@/components/ui/button";
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold text-foreground">{ADMIN_MODULE_LABELS[module]}</h1>
        <ButtonLink href={`${ADMIN_MODULE_PATHS[module]}/baru`}>{`Tambah ${ADMIN_MODULE_ITEM_NAMES[module]}`}</ButtonLink>
      </div>
      <ModuleList module={module} records={records} actions={listActionsFor(module)} />
    </section>
  );
}
