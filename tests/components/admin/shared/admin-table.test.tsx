import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AdminTable } from "@/components/admin/shared/admin-table";

type Row = { id: string; title: string };
const columns = [
  { header: "Judul", cell: (row: Row) => row.title },
  { header: "Aksi", cell: (row: Row) => <a href={`/admin/${row.id}`}>Ubah</a> },
];

describe("AdminTable", () => {
  it("renders column headers with scope and one row per item", () => {
    const markup = renderToStaticMarkup(<AdminTable rows={[{ id: "1", title: "A" }, { id: "2", title: "B" }]} columns={columns} rowKey={(row) => row.id} empty="Belum ada data." />);

    expect(markup.match(/<th scope="col"/g)).toHaveLength(2);
    expect(markup.match(/<tbody>[\s\S]*<\/tbody>/)?.[0].match(/<tr/g)).toHaveLength(2);
    expect(markup).toContain('href="/admin/2"');
  });

  it("shows the empty message instead of a table when there are no rows", () => {
    const markup = renderToStaticMarkup(<AdminTable rows={[]} columns={columns} rowKey={(row) => row.id} empty="Belum ada data." />);

    expect(markup).toContain("Belum ada data.");
    expect(markup).not.toContain("<table");
  });

  it("scrolls inside its own wrapper so a wide table never widens the page", () => {
    const markup = renderToStaticMarkup(<AdminTable rows={[{ id: "1", title: "A" }]} columns={columns} rowKey={(row) => row.id} empty="x" />);

    expect(markup).toContain("overflow-x-auto");
  });

  it("adds a hint to the empty state and keeps the last column pinned", () => {
    const empty = renderToStaticMarkup(<AdminTable rows={[]} columns={columns} rowKey={(row) => row.id} empty="Belum ada data." emptyHint="Tambah data pertama." />);
    const filled = renderToStaticMarkup(<AdminTable rows={[{ id: "1", title: "A" }]} columns={columns} rowKey={(row) => row.id} empty="x" />);

    expect(empty).toContain("Tambah data pertama.");
    expect(empty).toContain("<svg");
    expect(filled.match(/sticky right-0/g)).toHaveLength(2);
  });
});
