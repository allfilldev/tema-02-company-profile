import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PageHeader } from "@/components/admin/shared/page-header";

describe("PageHeader", () => {
  it("renders one h1, a dashboard breadcrumb and the action", () => {
    const markup = renderToStaticMarkup(<PageHeader title="Layanan" action={<a href="/admin/layanan/baru">Tambah</a>} />);

    expect(markup.match(/<h1/g)).toHaveLength(1);
    expect(markup).toContain('href="/admin"');
    expect(markup).toContain("Tambah");
  });

  it("shows the current page as a non-link marked aria-current after the dashboard link", () => {
    const markup = renderToStaticMarkup(<PageHeader title="Layanan" />);

    expect(markup).toMatch(/<li aria-current="page"[^>]*>\s*Layanan\s*<\/li>/);
    expect(markup).toContain("min-h-11");
  });
});
