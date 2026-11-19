import type { ReactNode } from "react";

export type AdminTableColumn<Row> = {
  header: string;
  cell: (row: Row) => ReactNode;
};

type AdminTableProps<Row> = {
  rows: Row[];
  columns: AdminTableColumn<Row>[];
  rowKey: (row: Row) => string;
  empty: string;
};

export function AdminTable<Row>({ rows, columns, rowKey, empty }: AdminTableProps<Row>) {
  if (rows.length === 0) {
    return <p className="rounded-2xl bg-surface p-6 text-muted-foreground shadow-soft">{empty}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl bg-surface shadow-soft">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-surface-muted text-muted-foreground">
          <tr>
            {columns.map((column) => (
              <th key={column.header} scope="col" className="whitespace-nowrap px-4 py-3 font-semibold">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className="border-t border-border align-top even:bg-surface-muted">
              {columns.map((column) => (
                <td key={column.header} className="px-4 py-3">
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
