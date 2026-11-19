import { describe, expect, it, vi } from "vitest";
import { MAX_UPLOAD_BYTES, uploadMediaImage, type MediaStorage } from "@/core/application/admin/media-upload";
import type { MediaAdminRepository } from "@/core/domain/admin/admin-repositories";
import type { MediaRecord } from "@/core/domain/admin/records";

function buildHarness(overrides: { optimize?: () => Promise<{ data: Buffer; width: number; height: number; bytes: number }>; create?: MediaAdminRepository["create"] } = {}) {
  const storage: MediaStorage = {
    upload: vi.fn(async (path: string) => ({ publicUrl: `https://files.example/${path}` })),
    remove: vi.fn(async () => undefined),
  };
  const repository = {
    create: overrides.create ?? vi.fn(async (record: Omit<MediaRecord, "id" | "createdAt">) => ({ ...record, id: "media-1", createdAt: "2026-11-20T03:00:00.000Z" })),
  } as unknown as MediaAdminRepository;
  const optimize = vi.fn(overrides.optimize ?? (async () => ({ data: Buffer.from("webp"), width: 1920, height: 1440, bytes: 4 })));
  const deps = { repository, storage, optimize, newId: () => "abc123" };
  return { deps, storage, optimize, repository };
}

function buildFile(overrides: Partial<{ type: string; size: number }> = {}) {
  return { type: "image/jpeg", size: 900_000, bytes: async () => Buffer.from("raw"), ...overrides };
}

describe("uploadMediaImage", () => {
  it("optimizes by kind, uploads to uploads/<id>.webp, and registers the public url with the real size", async () => {
    const { deps, storage, optimize, repository } = buildHarness();

    const result = await uploadMediaImage(deps, { file: buildFile(), alt: "  Tim sedang rapat  ", kind: "photo" });

    expect(optimize).toHaveBeenCalledWith(Buffer.from("raw"), "photo");
    expect(storage.upload).toHaveBeenCalledWith("uploads/abc123.webp", Buffer.from("webp"), "image/webp");
    expect(repository.create).toHaveBeenCalledWith({
      url: "https://files.example/uploads/abc123.webp",
      alt: "Tim sedang rapat",
      width: 1920,
      height: 1440,
      sizeBytes: 4,
      storagePath: "uploads/abc123.webp",
    });
    expect(result).toMatchObject({ ok: true, affected: { kind: "media" } });
  });

  it("rejects a missing alt before touching storage", async () => {
    const { deps, storage, optimize } = buildHarness();

    const result = await uploadMediaImage(deps, { file: buildFile(), alt: "   ", kind: "photo" });

    expect(result).toMatchObject({ ok: false, fieldErrors: { alt: "Isi teks alternatif gambar." } });
    expect(optimize).not.toHaveBeenCalled();
    expect(storage.upload).not.toHaveBeenCalled();
  });

  it("rejects a file that is not an image", async () => {
    const { deps, storage } = buildHarness();

    const result = await uploadMediaImage(deps, { file: buildFile({ type: "application/pdf" }), alt: "Dokumen", kind: "photo" });

    expect(result).toMatchObject({ ok: false, fieldErrors: { file: "Berkas harus berupa gambar." } });
    expect(storage.upload).not.toHaveBeenCalled();
  });

  it("rejects an empty file and a file over the upload limit", async () => {
    const { deps } = buildHarness();

    const empty = await uploadMediaImage(deps, { file: buildFile({ size: 0 }), alt: "Foto", kind: "photo" });
    const tooBig = await uploadMediaImage(deps, { file: buildFile({ size: MAX_UPLOAD_BYTES + 1 }), alt: "Foto", kind: "photo" });

    expect(empty).toMatchObject({ ok: false, fieldErrors: { file: "Pilih berkas gambar." } });
    expect(tooBig).toMatchObject({ ok: false, fieldErrors: { file: "Ukuran gambar maksimal 4 MB." } });
  });

  it("reports an unreadable image as a file error without uploading", async () => {
    const { deps, storage } = buildHarness({
      optimize: async () => {
        throw new Error("Input buffer contains unsupported image format");
      },
    });

    const result = await uploadMediaImage(deps, { file: buildFile(), alt: "Foto", kind: "photo" });

    expect(result).toMatchObject({ ok: false, fieldErrors: { file: "Berkas gambar tidak bisa diproses." } });
    expect(storage.upload).not.toHaveBeenCalled();
  });

  it("removes the uploaded object again when saving the record fails", async () => {
    const { deps, storage } = buildHarness({
      create: async () => {
        throw new Error("database down");
      },
    });

    await expect(uploadMediaImage(deps, { file: buildFile(), alt: "Foto", kind: "photo" })).rejects.toThrow("database down");
    expect(storage.remove).toHaveBeenCalledWith("uploads/abc123.webp");
  });
});
