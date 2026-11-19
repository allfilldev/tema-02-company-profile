import { ModuleForm } from "@/components/admin/pages/module-views";
import type { AdminModule } from "@/core/domain/admin/records";
import { ADMIN_MODULE_ITEM_NAMES } from "@/lib/admin/admin-menu";
import { getAdminDeps } from "@/server/admin/admin-deps";
import { assertModuleVisible, loadFormContext } from "@/server/admin/form-context";
import { saveItem } from "@/server/actions/admin/collections";

export async function ModuleNewPage({ module }: { module: AdminModule }) {
  const deps = await getAdminDeps();
  assertModuleVisible(deps, module);
  const context = await loadFormContext(deps, module);

  return (
    <section className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">{`Tambah ${ADMIN_MODULE_ITEM_NAMES[module]}`}</h1>
      <ModuleForm module={module} record={null} context={context} action={saveItem.bind(null, module, null)} />
    </section>
  );
}
