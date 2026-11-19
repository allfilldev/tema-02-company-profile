import { ItemList } from "@/components/admin/lists/item-list";
import type { TestimonialRecord } from "@/core/domain/admin/records";
import type { ListActions } from "@/lib/admin/list-actions";
import { ADMIN_MODULE_PATHS } from "@/lib/site/routes";

export function TestimonialList({ records, actions }: { records: TestimonialRecord[]; actions: ListActions }) {
  const rows = records.map((record) => ({ id: record.id, name: record.name, detail: record.company, isPublished: record.isPublished }));

  return <ItemList rows={rows} editBasePath={ADMIN_MODULE_PATHS.testimonials} showStatus showOrder actions={actions} empty="Belum ada testimoni." />;
}
