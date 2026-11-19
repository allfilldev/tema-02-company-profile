import Link from "next/link";
import { AdminTable, type AdminTableColumn } from "@/components/admin/shared/admin-table";
import { ConfirmDelete } from "@/components/admin/shared/confirm-delete";
import { MoveButtons } from "@/components/admin/shared/move-buttons";
import { PublishToggle } from "@/components/admin/shared/publish-toggle";
import type { ListActions } from "@/lib/admin/list-actions";
import { ROW_ACTION_CLASS_NAME } from "@/lib/admin/row-action-class-names";

export type ItemListRow = {
  id: string;
  name: string;
  detail: string | null;
  isPublished: boolean;
};

type ItemListProps = {
  rows: ItemListRow[];
  editBasePath: string;
  showStatus: boolean;
  showOrder: boolean;
  actions: ListActions;
  empty: string;
};

export function ItemList({ rows, editBasePath, showStatus, showOrder, actions, empty }: ItemListProps) {
  const lastIndex = rows.length - 1;
  const indexOf = (row: ItemListRow) => rows.findIndex((candidate) => candidate.id === row.id);

  const columns: AdminTableColumn<ItemListRow>[] = [
    { header: "Nama", cell: (row) => <span className="font-semibold text-foreground">{row.name}</span> },
    { header: "Keterangan", cell: (row) => row.detail ?? "-" },
  ];

  if (showStatus) {
    columns.push({ header: "Status", cell: (row) => (row.isPublished ? "Terbit" : "Draf") });
  }

  if (showOrder) {
    columns.push({
      header: "Urutan",
      cell: (row) => <MoveButtons id={row.id} itemName={row.name} isFirst={indexOf(row) === 0} isLast={indexOf(row) === lastIndex} action={actions.move} />,
    });
  }

  columns.push({
    header: "Aksi",
    cell: (row) => (
      <div className="flex flex-wrap items-center gap-2">
        <Link href={`${editBasePath}/${row.id}`} aria-label={`Ubah ${row.name}`} className={ROW_ACTION_CLASS_NAME}>
          Ubah
        </Link>
        {showStatus ? <PublishToggle id={row.id} itemName={row.name} isPublished={row.isPublished} action={actions.setPublished} /> : null}
        <ConfirmDelete itemName={row.name} action={actions.remove.bind(null, row.id)} />
      </div>
    ),
  });

  return <AdminTable rows={rows} columns={columns} rowKey={(row) => row.id} empty={empty} />;
}
