import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BarChart } from "@/components/admin/dashboard/bar-chart";
import { Sparkline } from "@/components/admin/dashboard/sparkline";

describe("Sparkline", () => {
  it("renders an accessible svg for data", () => {
    const markup = renderToStaticMarkup(<Sparkline values={[1, 3, 2, 5]} label="Pembaruan layanan" />);

    expect(markup).toContain('role="img"');
    expect(markup).toContain('aria-label="Pembaruan layanan"');
    expect(markup).not.toContain("NaN");
  });

  it.each([[[]], [[0, 0, 0]], [[4]]])("stays finite for %j", (values) => {
    const markup = renderToStaticMarkup(<Sparkline values={values} label="Tren" />);

    expect(markup).toContain('aria-label="Tren"');
    expect(markup).not.toContain("NaN");
    expect(markup).not.toContain("Infinity");
  });
});

describe("BarChart", () => {
  it("renders an accessible svg with one bar per datum", () => {
    const markup = renderToStaticMarkup(
      <BarChart label="Pesan 14 hari" data={[{ label: "1 Nov", value: 2 }, { label: "2 Nov", value: 5 }]} />,
    );

    expect(markup).toContain('role="img"');
    expect(markup).toContain('aria-label="Pesan 14 hari"');
    expect(markup.match(/<rect/g)).toHaveLength(2);
  });

  it.each([[[]], [[{ label: "a", value: 0 }, { label: "b", value: 0 }]]])("stays finite for %j", (data) => {
    const markup = renderToStaticMarkup(<BarChart label="Kosong" data={data} />);

    expect(markup).toContain('aria-label="Kosong"');
    expect(markup).not.toContain("NaN");
    expect(markup).not.toContain("Infinity");
  });
});
