import { ItemList } from "@/components/admin/lists/item-list";
import type { PortfolioRecord } from "@/core/domain/admin/records";
import type { ListActions } from "@/lib/admin/list-actions";
import { ADMIN_MODULE_PATHS } from "@/lib/site/routes";

export function PortfolioList({ records, actions }: { records: PortfolioRecord[]; actions: ListActions }) {
  const rows = records.map((record) => ({ id: record.id, name: record.title, detail: record.category, isPublished: record.isPublished }));

  return <ItemList rows={rows} editBasePath={ADMIN_MODULE_PATHS.portfolio} showStatus showOrder actions={actions} empty="Belum ada portofolio." />;
}
