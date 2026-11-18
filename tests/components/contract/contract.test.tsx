import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ArticleDates } from "@/components/site/contract/article-dates";
import { AuthorBox } from "@/components/site/contract/author-box";
import { AuthorByline } from "@/components/site/contract/author-byline";
import { Breadcrumbs } from "@/components/site/contract/breadcrumbs";
import { DemoNotice } from "@/components/site/contract/demo-notice";
import { FaqList } from "@/components/site/contract/faq-list";
import { JsonLd } from "@/components/site/contract/json-ld";
import { LegalFooterNav } from "@/components/site/contract/legal-footer-nav";
import { buildTestPack } from "../../fixtures/content-pack";

function buildAuthor() {
  return { ...buildTestPack().team[0], yearsExperience: 7 };
}

function findAnchor(markup: string, href: string): string {
  const anchor = [...markup.matchAll(/<a\b[^>]*>[^<]*<\/a>/g)].map((match) => match[0]).find((tag) => tag.includes(`href="${href}"`));
  if (!anchor) {
    throw new Error(`No anchor found for ${href}`);
  }
  return anchor;
}

function countOccurrences(text: string, part: string): number {
  return text.split(part).length - 1;
}

describe("AuthorByline", () => {
  it("links the author name to the about page with rel author", () => {
    const markup = renderToStaticMarkup(<AuthorByline authorName="Rina Wulandari" />);

    expect(markup).toContain("Oleh ");
    expect(markup).toContain('href="/tentang"');
    expect(markup).toContain('rel="author"');
    expect(markup).toContain(">Rina Wulandari</a>");
  });
});

describe("AuthorBox", () => {
  it("renders the labelled author bio landmark with name, role, bio, and facts", () => {
    const author = buildAuthor();
    const markup = renderToStaticMarkup(
      <AuthorBox author={author} facts={{ completedProjects: 137, yearsExperience: 7 }} />,
    );

    expect(markup).toContain('id="author-bio"');
    expect(markup).toContain("<aside");
    expect(markup).toContain('aria-labelledby="author-bio-heading"');
    expect(markup).toMatch(/<h2[^>]*id="author-bio-heading"[^>]*>Tentang penulis<\/h2>/);
    expect(markup).toContain(author.name);
    expect(markup).toContain(author.jobTitle);
    expect(markup).toContain(author.bio);
    expect(markup).toMatch(/<dt[^>]*>Pengalaman<\/dt><dd[^>]*>7 tahun<\/dd>/);
    expect(markup).toMatch(/<dt[^>]*>Proyek selesai<\/dt><dd[^>]*>137<\/dd>/);
    expect(markup).toContain("<img");
  });

  it("links to the about, contact, and editorial policy pages", () => {
    const markup = renderToStaticMarkup(
      <AuthorBox author={buildAuthor()} facts={{ completedProjects: 137, yearsExperience: 7 }} />,
    );

    expect(markup).toContain('href="/tentang"');
    expect(markup).toContain('href="/kontak"');
    expect(markup).toContain('href="/kebijakan-editorial"');
  });

  it("omits the completed projects row when the count is null", () => {
    const markup = renderToStaticMarkup(
      <AuthorBox author={buildAuthor()} facts={{ completedProjects: null, yearsExperience: 7 }} />,
    );

    expect(markup).not.toContain("Proyek selesai");
    expect(markup).toMatch(/<dt[^>]*>Pengalaman<\/dt><dd[^>]*>7 tahun<\/dd>/);
  });

  it("omits the experience row and the photo when they are missing", () => {
    const author = { ...buildAuthor(), yearsExperience: null, photo: null };
    const markup = renderToStaticMarkup(
      <AuthorBox author={author} facts={{ completedProjects: 137, yearsExperience: null }} />,
    );

    expect(markup).not.toContain("Pengalaman");
    expect(markup).not.toContain("<img");
    expect(markup).toMatch(/<dt[^>]*>Proyek selesai<\/dt><dd[^>]*>137<\/dd>/);
  });
});

describe("LegalFooterNav", () => {
  it("renders the legal navigation with machine-readable rel values", () => {
    const markup = renderToStaticMarkup(<LegalFooterNav />);

    expect(markup).toContain('<nav aria-label="Informasi hukum"');
    expect(findAnchor(markup, "/privasi")).toContain('rel="privacy-policy"');
    expect(findAnchor(markup, "/syarat-ketentuan")).toContain('rel="terms-of-service"');
    expect(findAnchor(markup, "/kebijakan-editorial")).not.toContain("rel=");
    expect(findAnchor(markup, "/kontak")).not.toContain("rel=");
    expect(findAnchor(markup, "/kontak")).toContain(">Kontak</a>");
    expect(countOccurrences(markup, "rel=")).toBe(2);
  });

  it("puts the contact link last", () => {
    const markup = renderToStaticMarkup(<LegalFooterNav />);
    const hrefs = [...markup.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);

    expect(hrefs).toEqual(["/privasi", "/syarat-ketentuan", "/kebijakan-editorial", "/kontak"]);
  });
});

describe("Breadcrumbs", () => {
  const items = [
    { name: "Beranda", path: "/" },
    { name: "Artikel", path: "/artikel" },
    { name: "Cara menyusun SOP", path: "/artikel/cara-menyusun-sop" },
  ];

  it("renders an ordered list in a labelled navigation", () => {
    const markup = renderToStaticMarkup(<Breadcrumbs items={items} />);

    expect(markup).toContain('<nav aria-label="Breadcrumb"');
    expect(markup).toContain("<ol");
    expect(countOccurrences(markup, "<li")).toBe(3);
  });

  it("marks only the last item as the current page without a link", () => {
    const markup = renderToStaticMarkup(<Breadcrumbs items={items} />);

    expect(countOccurrences(markup, 'aria-current="page"')).toBe(1);
    expect(markup).toMatch(/<[a-z]+ aria-current="page"[^>]*>Cara menyusun SOP<\/[a-z]+>/);
    expect(markup).not.toContain('href="/artikel/cara-menyusun-sop"');
    expect(markup).toContain('href="/"');
    expect(markup).toContain('href="/artikel"');
  });

  it("gives every breadcrumb link a tap target at least 44 px tall and wide", () => {
    const linkClasses = [...renderToStaticMarkup(<Breadcrumbs items={items} />).matchAll(/<a\b[^>]*\sclass="([^"]*)"/g)].map((match) =>
      match[1].split(" "),
    );

    expect(linkClasses).toHaveLength(2);
    for (const classes of linkClasses) {
      expect(classes).toEqual(expect.arrayContaining(["min-h-11", "min-w-11"]));
    }
  });

  it("renders a single item as the current page", () => {
    const markup = renderToStaticMarkup(<Breadcrumbs items={[{ name: "Beranda", path: "/" }]} />);

    expect(markup).toContain('aria-current="page"');
    expect(markup).not.toContain("<a");
  });
});

describe("ArticleDates", () => {
  it("renders published and updated dates as time elements", () => {
    const markup = renderToStaticMarkup(
      <ArticleDates publishedAt="2026-10-20T08:00:00.000Z" updatedAt="2026-11-05T08:00:00.000Z" />,
    );

    expect(markup).toContain("Diterbitkan");
    expect(markup).toContain("Diperbarui");
    expect(markup).toContain('<time dateTime="2026-10-20T08:00:00.000Z">20 Oktober 2026</time>');
    expect(markup).toContain('<time dateTime="2026-11-05T08:00:00.000Z">5 November 2026</time>');
    expect(countOccurrences(markup, "<time")).toBe(2);
  });
});

describe("DemoNotice", () => {
  it("renders the exact demo statement", () => {
    expect(renderToStaticMarkup(<DemoNotice />)).toMatch(/<p[^>]*>Situs demo\. Perusahaan dan isinya fiktif\.<\/p>/);
  });
});

describe("FaqList", () => {
  const items = [
    { question: "Berapa lama pengerjaan?", answer: "Sekitar empat minggu." },
    { question: "Apakah ada garansi?", answer: "Perbaikan bug gratis selama 30 hari." },
  ];

  it("renders real h3 questions and answer paragraphs under the default h2", () => {
    const markup = renderToStaticMarkup(<FaqList items={items} />);

    expect(markup).toContain("<section");
    expect(markup).toMatch(/<h2[^>]*>Pertanyaan yang sering diajukan<\/h2>/);
    expect(markup).toMatch(/<h3[^>]*>Berapa lama pengerjaan\?<\/h3>/);
    expect(markup).toMatch(/<p[^>]*>Sekitar empat minggu\.<\/p>/);
    expect(markup).not.toContain("<details");
    expect(markup).not.toContain("<summary");
  });

  it("uses a custom heading when given", () => {
    expect(renderToStaticMarkup(<FaqList items={items} heading="Tanya jawab" />)).toMatch(/<h2[^>]*>Tanya jawab<\/h2>/);
  });

  it("renders nothing when there are no items", () => {
    expect(renderToStaticMarkup(<FaqList items={[]} />)).toBe("");
  });
});

describe("JsonLd", () => {
  it("renders a json-ld script with the serialized data", () => {
    const markup = renderToStaticMarkup(<JsonLd data={{ "@context": "https://schema.org", "@type": "Thing", name: "Contoh" }} />);

    expect(markup).toContain('<script type="application/ld+json">');
    expect(markup).toContain('"@type":"Thing"');
    expect(markup).toContain('"name":"Contoh"');
  });

  it("accepts a list of schemas", () => {
    const markup = renderToStaticMarkup(<JsonLd data={[{ "@type": "A" }, { "@type": "B" }]} />);

    expect(markup).toContain('[{"@type":"A"},{"@type":"B"}]');
  });

  it("renders no empty script for an empty list of schemas", () => {
    expect(renderToStaticMarkup(<JsonLd data={[]} />)).toBe("");
    expect(renderToStaticMarkup(<JsonLd data={[{ "@type": "A" }]} />)).toContain('<script type="application/ld+json">');
  });

  it("cannot be broken out of the script tag by data containing a closing script tag", () => {
    const markup = renderToStaticMarkup(
      <JsonLd data={{ name: "</script><script>alert(1)</script>", note: "<!-- x -->" }} />,
    );

    expect(countOccurrences(markup, "</script>")).toBe(1);
    expect(markup.endsWith("</script>")).toBe(true);
    expect(markup).not.toContain("<script>alert");
    expect(markup).not.toContain("<!--");
    expect(markup).toContain("\\u003c/script>");
  });
});
