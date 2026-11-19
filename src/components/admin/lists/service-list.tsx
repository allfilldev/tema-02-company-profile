import { ItemList } from "@/components/admin/lists/item-list";
import type { ServiceRecord } from "@/core/domain/admin/records";
import type { ListActions } from "@/lib/admin/list-actions";
import { ADMIN_MODULE_PATHS } from "@/lib/site/routes";

export function ServiceList({ records, actions }: { records: ServiceRecord[]; actions: ListActions }) {
  const rows = records.map((record) => ({ id: record.id, name: record.title, detail: record.slug, isPublished: record.isPublished }));

  return <ItemList rows={rows} editBasePath={ADMIN_MODULE_PATHS.services} showStatus showOrder actions={actions} empty="Belum ada layanan." />;
}
