import { notFound } from "next/navigation";
import { ModuleForm } from "@/components/admin/pages/module-views";
import type { AdminModule } from "@/core/domain/admin/records";
import { ADMIN_MODULE_ITEM_NAMES } from "@/lib/admin/admin-menu";
import { isUuid } from "@/lib/admin/uuid";
import { getAdminDeps } from "@/server/admin/admin-deps";
import { assertModuleVisible, loadFormContext } from "@/server/admin/form-context";
import { saveItem } from "@/server/actions/admin/collections";

type ModuleEditPageProps = {
  module: AdminModule;
  params: Promise<{ id: string }>;
};

export async function ModuleEditPage({ module, params }: ModuleEditPageProps) {
  const { id } = await params;
  if (!isUuid(id)) {
    notFound();
  }
  const deps = await getAdminDeps();
  assertModuleVisible(deps, module);
  const [record, context] = await Promise.all([deps.repos.collections[module].findById(id), loadFormContext(deps, module)]);

  if (!record) {
    notFound();
  }

  return (
    <section className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">{`Ubah ${ADMIN_MODULE_ITEM_NAMES[module]}`}</h1>
      <ModuleForm module={module} record={record} context={context} action={saveItem.bind(null, module, id)} />
    </section>
  );
}
