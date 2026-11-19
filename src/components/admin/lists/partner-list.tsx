import { ItemList } from "@/components/admin/lists/item-list";
import type { PartnerRecord } from "@/core/domain/admin/records";
import type { ListActions } from "@/lib/admin/list-actions";
import { ADMIN_MODULE_PATHS } from "@/lib/site/routes";

export function PartnerList({ records, actions }: { records: PartnerRecord[]; actions: ListActions }) {
  const rows = records.map((record) => ({ id: record.id, name: record.name, detail: record.url, isPublished: record.isPublished }));

  return <ItemList rows={rows} editBasePath={ADMIN_MODULE_PATHS.partners} showStatus showOrder actions={actions} empty="Belum ada partner." />;
}
