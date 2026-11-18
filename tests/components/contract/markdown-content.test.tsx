import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MarkdownContent } from "@/components/site/contract/markdown-content";

function render(source: string, className?: string): string {
  return renderToStaticMarkup(<MarkdownContent source={source} className={className} />);
}

describe("MarkdownContent headings", () => {
  it("demotes a level 1 heading to h2 so the page keeps a single h1", () => {
    const markup = render("# Judul");

    expect(markup).toContain("<h2");
    expect(markup).toContain("Judul");
    expect(markup).not.toContain("<h1");
  });

  it("renders level 4 to 6 headings as bold paragraphs", () => {
    const markup = render("#### Rinci\n\n##### Lebih rinci\n\n###### Paling rinci");

    expect(markup).toContain("<strong>Rinci</strong>");
    expect(markup).toContain("<strong>Lebih rinci</strong>");
    expect(markup).toContain("<strong>Paling rinci</strong>");
    expect(markup).not.toMatch(/<h[456]/);
    expect(markup.match(/<p[ >]/g)).toHaveLength(3);
  });

  it("keeps the order of h2 and h3 headings", () => {
    const markup = render("## Satu\n\n### Satu A\n\n## Dua\n\n### Dua A");
    const order = [...markup.matchAll(/<h([23])[^>]*>([^<]*)</g)].map((match) => `${match[1]}:${match[2]}`);

    expect(order).toEqual(["2:Satu", "3:Satu A", "2:Dua", "3:Dua A"]);
  });

  it("applies the class name to the wrapper", () => {
    expect(render("Halo", "isi-artikel")).toContain("isi-artikel");
  });
});

describe("MarkdownContent images", () => {
  it("renders an image with a title as a figure with a figcaption", () => {
    const markup = render('![Tim sedang rapat](/demo/rapat.webp "Rapat mingguan tim")');

    expect(markup).toContain("<figure");
    expect(markup).toContain("<figcaption");
    expect(markup).toContain("Rapat mingguan tim");
    expect(markup).toContain('alt="Tim sedang rapat"');
    expect(markup).toContain('src="/demo/rapat.webp"');
  });

  it("never nests a figure inside a paragraph", () => {
    const markup = render('Pembuka.\n\n![Alt](/a.webp "Keterangan")\n\nPenutup.');

    expect(markup).not.toMatch(/<p[^>]*>(?:(?!<\/p>)[\s\S])*<figure/);
    expect(markup).toContain("<figure");
  });

  it("renders an image without a title without a figcaption", () => {
    const markup = render("![Alt saja](/a.webp)");

    expect(markup).toContain("<figure");
    expect(markup).not.toContain("figcaption");
  });

  it("declares dimensions, lazy loading, and async decoding on every image", () => {
    const markup = render("![Alt](/a.webp)");

    expect(markup).toContain('loading="lazy"');
    expect(markup).toContain('decoding="async"');
    expect(markup).toContain('width="1200"');
    expect(markup).toContain('height="800"');
    expect(markup).toContain("height:auto");
  });

  it("keeps an image mixed with text inline without a figure", () => {
    const markup = render('Lihat ![ikon](/i.webp "Judul") di sini.');

    expect(markup).toContain("<img");
    expect(markup).not.toContain("<figure");
    expect(markup).not.toContain("figcaption");
    expect(markup).toMatch(/<p[^>]*>Lihat <img[^>]*> di sini\.<\/p>/);
  });

  it("keeps an image inside a link inline without a figure", () => {
    const markup = render("[![Alt](/a.webp)](/layanan/x)");

    expect(markup).toContain("<img");
    expect(markup).not.toContain("<figure");
  });

  it("drops images whose source is an unsafe protocol", () => {
    for (const source of ["javascript:alert(1)", "data:text/html;base64,PHNjcmlwdD4=", "vbscript:msgbox(1)"]) {
      const markup = render(`![x](${source})`);

      expect(markup).not.toContain("<img");
      expect(markup).not.toContain("javascript:");
      expect(markup).not.toContain("data:");
      expect(markup).not.toContain("vbscript:");
    }
  });
});

describe("MarkdownContent links", () => {
  it("opens external links safely in a new tab", () => {
    const markup = render("[BPS](https://bps.go.id)");

    expect(markup).toContain('href="https://bps.go.id"');
    expect(markup).toContain('rel="noopener noreferrer"');
    expect(markup).toContain('target="_blank"');
  });

  it("treats protocol-relative links as external", () => {
    const markup = render("[Luar](//contoh.com/x)");

    expect(markup).toContain('rel="noopener noreferrer"');
    expect(markup).toContain('target="_blank"');
  });

  it("keeps internal and hash links plain", () => {
    const markup = render("[Layanan](/layanan/x) dan [Bagian](#bagian)");

    expect(markup).toContain('href="/layanan/x"');
    expect(markup).toContain('href="#bagian"');
    expect(markup).not.toContain("rel=");
    expect(markup).not.toContain("target=");
  });

  it("never produces an href with an unsafe protocol", () => {
    for (const href of ["javascript:alert(1)", "JaVaScRiPt:alert(1)", "data:text/html;base64,PHNjcmlwdD4=", "vbscript:msgbox(1)"]) {
      const markup = render(`[x](${href})`);

      expect(markup.toLowerCase()).not.toContain("javascript:");
      expect(markup.toLowerCase()).not.toContain("data:");
      expect(markup.toLowerCase()).not.toContain("vbscript:");
      expect(markup).not.toContain("href=");
      expect(markup).toContain("x");
    }
  });
});

describe("MarkdownContent tables and raw html", () => {
  it("renders GFM tables inside a horizontally scrollable wrapper", () => {
    const markup = render("| Paket | Harga |\n| --- | --- |\n| Dasar | 5 juta |");

    expect(markup).toContain("<table");
    expect(markup).toContain("<th");
    expect(markup).toContain("<td");
    expect(markup).toMatch(/<div class="[^"]*overflow-x-auto[^"]*"><table/);
  });

  it("does not turn raw html into elements", () => {
    const markup = render('<script>alert(1)</script>\n\n<img src="/x.webp" onerror="alert(1)">\n\n<div onclick="x()">kotak</div>');

    expect(markup).not.toContain("<script");
    expect(markup).not.toContain("<img");
    expect(markup).not.toContain("<div onclick");
    expect(markup).toContain("&lt;script&gt;");
  });

  it("renders lists and emphasis", () => {
    const markup = render("- satu\n- dua\n\n1. a\n2. b\n\n**tebal** dan *miring*");

    expect(markup).toContain("<ul");
    expect(markup).toContain("<ol");
    expect(markup).toContain("<strong>tebal</strong>");
    expect(markup).toContain("<em>miring</em>");
  });
});
