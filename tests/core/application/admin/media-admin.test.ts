import { describe, expect, it, vi } from "vitest";
import { deleteMedia, registerMedia, updateMediaAlt } from "@/core/application/admin/media-admin";
import type { MediaRecord } from "@/core/domain/admin/records";

const stored: MediaRecord = {
  id: "m1",
  url: "https://abc.supabase.co/storage/v1/object/public/media/uploads/a.webp",
  alt: "Tim sedang rapat",
  width: 1200,
  height: 800,
  sizeBytes: 54000,
  storagePath: "uploads/a.webp",
  createdAt: "2026-11-20T03:00:00.000Z",
};

function repository(usages: string[] = []) {
  return {
    list: vi.fn(async () => [stored]),
    findById: vi.fn(async (id: string) => (id === "m1" ? stored : null)),
    create: vi.fn(async (record: Omit<MediaRecord, "id" | "createdAt">) => ({ ...record, id: "m2", createdAt: stored.createdAt })),
    updateAlt: vi.fn(async (_id: string, alt: string) => ({ ...stored, alt })),
    remove: vi.fn(async () => undefined),
    findUsages: vi.fn(async () => usages),
  };
}

describe("registerMedia", () => {
  it("stores a valid image and reports a media change", async () => {
    const repo = repository();

    const result = await registerMedia({ repository: repo }, { url: stored.url, alt: "Foto baru", width: 800, height: 600, sizeBytes: 40000, storagePath: "uploads/b.webp" });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.affected).toEqual({ kind: "media" });
      expect(result.value.id).toBe("m2");
    }
  });

  it("requires alt text and refuses an over long one", async () => {
    const repo = repository();
    const base = { url: stored.url, width: 800, height: 600, sizeBytes: 40000, storagePath: "uploads/b.webp" };

    expect((await registerMedia({ repository: repo }, { ...base, alt: "   " })).ok).toBe(false);
    expect((await registerMedia({ repository: repo }, { ...base, alt: "x".repeat(201) })).ok).toBe(false);
    expect(repo.create).not.toHaveBeenCalled();
  });
});

describe("updateMediaAlt", () => {
  it("changes the alt text but never to an empty one", async () => {
    const repo = repository();

    expect((await updateMediaAlt({ repository: repo }, "m1", "Alt baru")).ok).toBe(true);
    expect((await updateMediaAlt({ repository: repo }, "m1", "")).ok).toBe(false);
    expect(repo.updateAlt).toHaveBeenCalledTimes(1);
  });
});

describe("deleteMedia", () => {
  it("refuses to delete an image that is still used and names where", async () => {
    const repo = repository(["Layanan: Penyusunan SOP", "Artikel: Cara menyusun SOP"]);

    const result = await deleteMedia({ repository: repo }, "m1");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.blocking).toEqual(["Gambar ini masih dipakai di: Layanan: Penyusunan SOP, Artikel: Cara menyusun SOP."]);
    }
    expect(repo.remove).not.toHaveBeenCalled();
  });

  it("deletes an unused image and returns its storage path for cleanup", async () => {
    const repo = repository();

    const result = await deleteMedia({ repository: repo }, "m1");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({ storagePath: "uploads/a.webp" });
    }
    expect(repo.remove).toHaveBeenCalledWith("m1");
  });

  it("reports an unknown image", async () => {
    expect((await deleteMedia({ repository: repository() }, "nope")).ok).toBe(false);
  });
});
