import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { RecentMessagesTable } from "@/components/admin/dashboard/recent-messages-table";
import type { ContactMessage } from "@/core/domain/admin/records";

function message(id: string, createdAt: string, isRead: boolean): ContactMessage {
  return { id, name: `Pengirim ${id}`, email: "a@x.id", phone: null, message: "Halo", isRead, createdAt };
}

describe("RecentMessagesTable", () => {
  it("shows an empty state without a table", () => {
    const markup = renderToStaticMarkup(<RecentMessagesTable messages={[]} />);

    expect(markup).toContain("Belum ada pesan masuk.");
    expect(markup).not.toContain("<table");
  });

  it("lists at most five messages, newest first, with unread status", () => {
    const messages = Array.from({ length: 7 }, (_, index) => message(String(index), `2026-11-0${index + 1}T03:00:00.000Z`, index !== 6));
    const markup = renderToStaticMarkup(<RecentMessagesTable messages={messages} />);

    expect(markup.match(/<tbody>[\s\S]*<\/tbody>/)?.[0].match(/<tr/g)).toHaveLength(5);
    expect(markup.indexOf("Pengirim 6")).toBeLessThan(markup.indexOf("Pengirim 5"));
    expect(markup).not.toContain("Pengirim 0");
    expect(markup).toContain("Belum dibaca");
  });
});
