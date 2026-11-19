import { ItemList } from "@/components/admin/lists/item-list";
import type { ArticleRecord } from "@/core/domain/admin/records";
import type { ListActions } from "@/lib/admin/list-actions";
import { ADMIN_MODULE_PATHS } from "@/lib/site/routes";

export function ArticleList({ records, actions }: { records: ArticleRecord[]; actions: ListActions }) {
  const rows = records.map((record) => ({ id: record.id, name: record.title, detail: record.slug, isPublished: record.status === "published" }));

  return <ItemList rows={rows} editBasePath={ADMIN_MODULE_PATHS.articles} showStatus showOrder={false} actions={actions} empty="Belum ada artikel." />;
}
