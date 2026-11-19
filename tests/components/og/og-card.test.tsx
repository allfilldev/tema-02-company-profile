import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { OgCard } from "@/components/site/og/og-card";
import { OG_FOOTER_MAX_LENGTH, OG_SUBTITLE_MAX_LENGTH, OG_TITLE_MAX_LENGTH } from "@/lib/seo/og";
import { ogTheme } from "@/styles/tokens";

function render(props: Parameters<typeof OgCard>[0]): string {
  return renderToStaticMarkup(<OgCard {...props} />);
}

function textOf(markup: string): string {
  return markup.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

describe("OgCard", () => {
  it("fills the frame with the og theme background and foreground", () => {
    const markup = render({ title: "Judul", footer: "Contoh Solusi" });

    expect(markup).toContain(`background-color:${ogTheme.background}`);
    expect(markup).toContain(`color:${ogTheme.foreground}`);
    expect(markup).toContain(`${ogTheme.primary}`);
  });

  it("shows the title, the eyebrow, and the site name in the footer", () => {
    const markup = render({ eyebrow: "Layanan", title: "Penyusunan SOP", footer: "Contoh Solusi" });

    expect(textOf(markup)).toBe("Layanan Penyusunan SOP Contoh Solusi");
  });

  it("shows the subtitle for the default image", () => {
    const markup = render({ title: "Contoh Solusi", subtitle: "Mitra operasional UMKM" });

    expect(textOf(markup)).toBe("Contoh Solusi Mitra operasional UMKM");
  });

  it("omits optional parts that are not given", () => {
    const markup = render({ title: "Hanya judul" });

    expect(textOf(markup)).toBe("Hanya judul");
    expect(textOf(render({ title: "Hanya judul", footer: "Situs" }))).not.toBe("Hanya judul");
  });

  it("wraps long words and truncates very long titles", () => {
    const markup = render({ title: "kata ".repeat(80) });

    expect(markup).toContain("word-break:break-word");
    expect(textOf(markup).length).toBeLessThanOrEqual(OG_TITLE_MAX_LENGTH);
    expect(textOf(markup).endsWith("...")).toBe(true);
  });

  it("truncates a long subtitle and footer", () => {
    const markup = render({ title: "Judul", subtitle: "kalimat ".repeat(60), footer: "nama ".repeat(40) });
    const parts = [...markup.matchAll(/<div[^>]*>([^<]*)<\/div>/g)].map((match) => match[1]).filter(Boolean);

    expect(parts).toHaveLength(3);
    expect(parts[1].length).toBeLessThanOrEqual(OG_SUBTITLE_MAX_LENGTH);
    expect(parts[1].endsWith("...")).toBe(true);
    expect(parts[2].length).toBeLessThanOrEqual(OG_FOOTER_MAX_LENGTH);
    expect(parts[2].endsWith("...")).toBe(true);
  });

  it("escapes markup in the title", () => {
    const markup = render({ title: "<script>alert(1)</script>" });

    expect(markup).not.toContain("<script>");
    expect(markup).toContain("&lt;script&gt;");
  });
});
