import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MessageList } from "@/components/admin/messages/message-list";
import type { ContactMessage } from "@/core/domain/admin/records";

const actions = {
  markRead: async () => ({ ok: true as const }),
  remove: async () => ({ ok: true as const }),
};

function buildMessage(overrides: Partial<ContactMessage> = {}): ContactMessage {
  return {
    id: "msg-1",
    name: "Budi Santoso",
    email: "budi@contoh.id",
    phone: "081234567890",
    message: "Saya ingin konsultasi SOP.",
    isRead: false,
    createdAt: "2026-11-18T03:00:00.000Z",
    ...overrides,
  };
}

describe("message list", () => {
  it("marks an unread message with visible text and offers to mark it read", () => {
    const markup = renderToStaticMarkup(<MessageList messages={[buildMessage()]} actions={actions} />);

    expect(markup).toContain("Belum dibaca");
    expect(markup).toContain(">Tandai dibaca<");
    expect(markup).toContain("font-bold");
  });

  it("shows a read message without the unread marker or the mark-read button", () => {
    const markup = renderToStaticMarkup(<MessageList messages={[buildMessage({ isRead: true })]} actions={actions} />);

    expect(markup).not.toContain("Belum dibaca");
    expect(markup).not.toContain("Tandai dibaca");
  });

  it("links the email and phone number with mailto and tel", () => {
    const markup = renderToStaticMarkup(<MessageList messages={[buildMessage()]} actions={actions} />);

    expect(markup).toContain('href="mailto:budi@contoh.id"');
    expect(markup).toContain('href="tel:081234567890"');
  });

  it("omits the phone link when the sender gave no phone number", () => {
    const markup = renderToStaticMarkup(<MessageList messages={[buildMessage({ phone: null })]} actions={actions} />);

    expect(markup).not.toContain("tel:");
  });

  it("lists the newest message first and offers delete for each", () => {
    const markup = renderToStaticMarkup(
      <MessageList
        messages={[
          buildMessage({ id: "old", name: "Pengirim Lama", createdAt: "2026-11-01T03:00:00.000Z" }),
          buildMessage({ id: "new", name: "Pengirim Baru", createdAt: "2026-11-19T03:00:00.000Z" }),
        ]}
        actions={actions}
      />,
    );

    expect(markup.indexOf("Pengirim Baru")).toBeLessThan(markup.indexOf("Pengirim Lama"));
    expect(markup.match(/>Hapus</g)).toHaveLength(2);
  });

  it("shows a message when there are no messages", () => {
    expect(renderToStaticMarkup(<MessageList messages={[]} actions={actions} />)).toContain("Belum ada pesan masuk.");
  });
});
