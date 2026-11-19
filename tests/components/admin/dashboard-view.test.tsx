import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DashboardView } from "@/components/admin/dashboard/dashboard-view";
import type { DashboardCounts } from "@/core/application/admin/dashboard";
import { buildMessageActivity, buildMessageHeatmap } from "@/core/application/admin/message-activity";

const counts: DashboardCounts = {
  modules: [
    { module: "services", total: 6, published: 5 },
    { module: "stats", total: 4, published: null },
    { module: "articles", total: 0, published: 0 },
  ],
  unreadMessages: 2,
};

function render(messages: { createdAt: string }[]) {
  const today = new Date("2026-11-19T05:00:00.000Z");
  return renderToStaticMarkup(
    <DashboardView
      counts={counts}
      moduleActivity={{}}
      messageActivity={buildMessageActivity(messages, today)}
      heatmap={buildMessageHeatmap(messages)}
      messages={[]}
    />,
  );
}

describe("DashboardView", () => {
  it("has one h1 and no breadcrumb", () => {
    const markup = render([]);

    expect(markup.match(/<h1/g)).toHaveLength(1);
    expect(markup).not.toContain("Breadcrumb");
  });

  it("composes the stat cards, message chart, module table, heatmap and recent messages", () => {
    const markup = render([]);

    for (const title of ["Pesan masuk", "Konten per modul", "Pesan per jam", "Pesan terbaru"]) {
      expect(markup).toContain(`>${title}<`);
    }
    expect(markup).toContain("Terbit");
    expect(markup).toContain("Sen");
    expect(markup).toContain("Min");
  });

  it("stays finite and shows 0% without any message data", () => {
    const markup = render([]);

    expect(markup).not.toContain("NaN");
    expect(markup).not.toContain("Infinity");
    expect(markup).toContain(">0%<");
    expect(markup).not.toContain("lucide-trending");
    expect(markup).not.toContain("bg-success/10");
  });

  it("renders the stat card labels as paragraphs so the message heading stays unique", () => {
    const markup = render([]);

    expect(markup.match(/<h2[^>]*>Pesan masuk<\/h2>/g)).toHaveLength(1);
  });

  it("shades heatmap cells from real message timestamps", () => {
    const markup = render([{ createdAt: "2026-11-17T02:00:00.000Z" }]);

    expect(markup).toContain('rounded-md bg-primary"');
    expect(markup).toContain("Sel 09.00: 1 pesan");
  });
});
