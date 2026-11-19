import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DashboardCards } from "@/components/admin/dashboard/dashboard-cards";
import type { DashboardCounts } from "@/core/application/admin/dashboard";

const counts: DashboardCounts = {
  modules: [
    { module: "services", total: 6, published: 5 },
    { module: "articles", total: 12, published: 9 },
  ],
  unreadMessages: 3,
};

describe("dashboard cards", () => {
  it("shows a linked card per module with its total and published count", () => {
    const markup = renderToStaticMarkup(<DashboardCards counts={counts} />);

    expect(markup).toContain('href="/admin/layanan"');
    expect(markup).toContain('href="/admin/artikel"');
    expect(markup).toContain(">6<");
    expect(markup).toContain("5 terbit");
    expect(markup).toContain("9 terbit");
  });

  it("does not show a card for a module that is not in the counts", () => {
    const markup = renderToStaticMarkup(<DashboardCards counts={counts} />);

    expect(markup).not.toContain("Statistik");
    expect(markup).not.toContain("/admin/statistik");
  });

  it("omits the published line for statistics, which have no publish state", () => {
    const markup = renderToStaticMarkup(<DashboardCards counts={{ modules: [{ module: "stats", total: 4, published: null }], unreadMessages: 0 }} />);

    expect(markup).toContain("Statistik");
    expect(markup).not.toContain("terbit");
  });

  it("links the unread message count to the messages page", () => {
    const markup = renderToStaticMarkup(<DashboardCards counts={counts} />);

    expect(markup).toContain('href="/admin/pesan"');
    expect(markup).toContain("3 belum dibaca");
  });
});
