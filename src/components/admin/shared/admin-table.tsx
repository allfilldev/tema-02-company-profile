import { Inbox } from "lucide-react";
import type { ReactNode } from "react";
import { EmptyState } from "@/components/admin/shared/empty-state";
import { joinClassNames } from "@/lib/ui/class-names";

export type AdminTableColumn<Row> = {
  header: string;
  cell: (row: Row) => ReactNode;
};

type AdminTableProps<Row> = {
  rows: Row[];
  columns: AdminTableColumn<Row>[];
  rowKey: (row: Row) => string;
  empty: string;
  emptyHint?: string;
};

const DEFAULT_EMPTY_HINT = "Gunakan tombol tambah di atas untuk membuat data pertama.";
const STICKY_CELL_CLASS_NAME = "sticky right-0 border-l border-secondary";

export function AdminTable<Row>({ rows, columns, rowKey, empty, emptyHint = DEFAULT_EMPTY_HINT }: AdminTableProps<Row>) {
  if (rows.length === 0) {
    return <EmptyState icon={Inbox} message={empty} hint={emptyHint} />;
  }

  const lastColumnIndex = columns.length - 1;

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-surface-muted text-xs text-foreground">
          <tr>
            {columns.map((column, index) => (
              <th key={column.header} scope="col" className={joinClassNames("whitespace-nowrap bg-surface-muted px-5 py-3 font-semibold", index === lastColumnIndex && STICKY_CELL_CLASS_NAME)}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className="border-t border-secondary align-top">
              {columns.map((column, index) => (
                <td key={column.header} className={joinClassNames("bg-surface px-5 py-3", index === lastColumnIndex && STICKY_CELL_CLASS_NAME)}>
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
