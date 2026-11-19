import { describe, expect, it, vi } from "vitest";
import { deleteMessage, listMessages, markMessageRead } from "@/core/application/admin/message-admin";

const message = { id: "c1", name: "Rina", email: "rina@contoh.id", phone: null, message: "Halo", isRead: false, createdAt: "2026-11-20T03:00:00.000Z" };

describe("message admin use cases", () => {
  const repository = {
    list: vi.fn(async () => [message]),
    markRead: vi.fn(async () => undefined),
    remove: vi.fn(async () => undefined),
    countUnread: vi.fn(async () => 1),
  };

  it("lists, marks read, and deletes messages through the repository", async () => {
    expect(await listMessages({ repository })).toEqual([message]);
    await markMessageRead({ repository }, "c1");
    await deleteMessage({ repository }, "c1");

    expect(repository.markRead).toHaveBeenCalledWith("c1");
    expect(repository.remove).toHaveBeenCalledWith("c1");
  });
});
