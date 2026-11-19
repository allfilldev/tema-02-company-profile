import { ModuleForm } from "@/components/admin/pages/module-views";
import { PageHeader } from "@/components/admin/shared/page-header";
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
      <PageHeader title={`Tambah ${ADMIN_MODULE_ITEM_NAMES[module]}`} />
      <ModuleForm module={module} record={null} context={context} action={saveItem.bind(null, module, null)} />
    </section>
  );
}
