import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ArticleList } from "@/components/admin/lists/article-list";
import { PartnerList } from "@/components/admin/lists/partner-list";
import { PortfolioList } from "@/components/admin/lists/portfolio-list";
import { ServiceList } from "@/components/admin/lists/service-list";
import { StatList } from "@/components/admin/lists/stat-list";
import { TeamList } from "@/components/admin/lists/team-list";
import { TestimonialList } from "@/components/admin/lists/testimonial-list";
import type { ListActions } from "@/lib/admin/list-actions";
import { headingsOf } from "../../../fixtures/markup";
import {
  buildArticleRecord,
  buildPartnerRecord,
  buildPortfolioRecord,
  buildServiceRecord,
  buildStatRecord,
  buildTestimonialRecord,
} from "../../../fixtures/admin-records";
import { buildTeamMemberRecord } from "../../../fixtures/admin-repositories";

const actions: ListActions = {
  move: async () => ({ ok: true }),
  setPublished: async () => ({ ok: true }),
  remove: async () => ({ ok: true }),
};

function columnHeaders(markup: string): string[] {
  return [...markup.matchAll(/<th scope="col"[^>]*>([^<]*)<\/th>/g)].map((match) => match[1]);
}

describe("service list", () => {
  const records = [
    buildServiceRecord({ id: "a", title: "Penyusunan SOP", isPublished: true }),
    buildServiceRecord({ id: "b", title: "Audit Proses", isPublished: false }),
  ];

  it("shows the name, status, order, and action columns with one row per record", () => {
    const markup = renderToStaticMarkup(<ServiceList records={records} actions={actions} />);

    expect(columnHeaders(markup)).toEqual(["Nama", "Keterangan", "Status", "Urutan", "Aksi"]);
    expect(markup).toContain("Penyusunan SOP");
    expect(markup).toContain("Audit Proses");
    expect(markup).toContain("Terbit");
    expect(markup).toContain("Draf");
  });

  it("links each row to its edit page and offers the publish toggle matching its status", () => {
    const markup = renderToStaticMarkup(<ServiceList records={records} actions={actions} />);

    expect(markup).toContain('href="/admin/layanan/a"');
    expect(markup).toContain('href="/admin/layanan/b"');
    expect(markup).toContain(">Tarik<");
    expect(markup).toContain(">Terbitkan<");
  });

  it("disables moving the first row up and the last row down", () => {
    const markup = renderToStaticMarkup(<ServiceList records={records} actions={actions} />);
    const buttons = [...markup.matchAll(/<button[^>]*>(Naik|Turun)<\/button>/g)].map((match) => ({
      label: match[1],
      disabled: /\bdisabled=""/.test(match[0]),
    }));

    expect(buttons).toEqual([
      { label: "Naik", disabled: true },
      { label: "Turun", disabled: false },
      { label: "Naik", disabled: false },
      { label: "Turun", disabled: true },
    ]);
  });

  it("shows a message instead of a table when there are no records", () => {
    const markup = renderToStaticMarkup(<ServiceList records={[]} actions={actions} />);

    expect(markup).not.toContain("<table");
    expect(markup).toContain("Belum ada layanan.");
  });
});

describe("article list", () => {
  it("has no move buttons because articles are ordered by publication date", () => {
    const markup = renderToStaticMarkup(<ArticleList records={[buildArticleRecord(), buildArticleRecord({ id: "article-2", status: "published" })]} actions={actions} />);

    expect(markup).not.toContain(">Naik<");
    expect(markup).not.toContain(">Turun<");
    expect(columnHeaders(markup)).toEqual(["Nama", "Keterangan", "Status", "Aksi"]);
  });

  it("reports a published article as Terbit and offers to withdraw it", () => {
    const markup = renderToStaticMarkup(<ArticleList records={[buildArticleRecord({ status: "published" })]} actions={actions} />);

    expect(markup).toContain(">Tarik<");
  });
});

describe("stat list", () => {
  it("has no status column and no publish toggle", () => {
    const markup = renderToStaticMarkup(<StatList records={[buildStatRecord()]} actions={actions} />);

    expect(columnHeaders(markup)).toEqual(["Nama", "Keterangan", "Urutan", "Aksi"]);
    expect(markup).not.toContain(">Terbitkan<");
    expect(markup).not.toContain(">Tarik<");
    expect(markup).toContain("120+");
  });
});

describe("remaining lists", () => {
  it("render one row with an edit link for portfolio, team, testimonials, and partners", () => {
    const markups = [
      renderToStaticMarkup(<PortfolioList records={[buildPortfolioRecord()]} actions={actions} />),
      renderToStaticMarkup(<TeamList records={[buildTeamMemberRecord()]} actions={actions} />),
      renderToStaticMarkup(<TestimonialList records={[buildTestimonialRecord()]} actions={actions} />),
      renderToStaticMarkup(<PartnerList records={[buildPartnerRecord()]} actions={actions} />),
    ];

    expect(markups[0]).toContain('href="/admin/portofolio/portfolio-1"');
    expect(markups[1]).toContain('href="/admin/tim/team-1"');
    expect(markups[2]).toContain('href="/admin/testimoni/testimonial-1"');
    expect(markups[3]).toContain('href="/admin/partner/partner-1"');
    for (const markup of markups) {
      expect(headingsOf(markup)).toEqual([]);
      expect(markup.match(/<tbody>[\s\S]*<\/tbody>/)?.[0].match(/<tr/g)).toHaveLength(1);
    }
  });
});
