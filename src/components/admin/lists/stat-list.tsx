import { ItemList } from "@/components/admin/lists/item-list";
import type { StatRecord } from "@/core/domain/admin/records";
import type { ListActions } from "@/lib/admin/list-actions";
import { ADMIN_MODULE_PATHS } from "@/lib/site/routes";

export function StatList({ records, actions }: { records: StatRecord[]; actions: ListActions }) {
  const rows = records.map((record) => ({ id: record.id, name: record.label, detail: `${record.value}${record.suffix ?? ""}`, isPublished: true }));

  return <ItemList rows={rows} editBasePath={ADMIN_MODULE_PATHS.stats} showStatus={false} showOrder actions={actions} empty="Belum ada statistik." />;
}
