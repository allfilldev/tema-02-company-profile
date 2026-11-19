import { beforeEach, describe, expect, it, vi } from "vitest";
import { INITIAL_ADMIN_FORM_STATE } from "@/lib/admin/form-state";

const mocks = vi.hoisted(() => ({
  getAdminDeps: vi.fn(),
  revalidate: vi.fn(),
  optimize: vi.fn(),
}));

vi.mock("@/server/admin/admin-deps", () => ({ getAdminDeps: mocks.getAdminDeps }));
vi.mock("@/server/data/revalidation", () => ({ revalidateAdminChange: mocks.revalidate }));
vi.mock("@/infrastructure/images/optimize-webp", () => ({
  PHOTO_MAX_WIDTH: 1920,
  LOGO_MAX_WIDTH: 600,
  MAX_IMAGE_BYTES: 102400,
  optimizeToWebp: mocks.optimize,
}));

import { removeMedia, saveMediaAlt, uploadMedia } from "@/server/actions/admin/media";

function buildDeps(overrides: { usages?: string[]; storagePath?: string | null } = {}) {
  const repository = {
    create: vi.fn(async (record: object) => ({ ...record, id: "m1", createdAt: "2026-11-20T03:00:00.000Z" })),
    updateAlt: vi.fn(async (id: string, alt: string) => ({ id, alt })),
    findById: vi.fn(async () => ({ id: "m1", storagePath: overrides.storagePath === undefined ? "uploads/a.webp" : overrides.storagePath })),
    findUsages: vi.fn(async () => overrides.usages ?? []),
    remove: vi.fn(async () => undefined),
  };
  const storage = {
    upload: vi.fn(async (path: string) => ({ publicUrl: `https://files.example/${path}` })),
    remove: vi.fn(async () => undefined),
  };
  return { repos: { media: repository }, storage, repository };
}

function uploadForm(entries: { alt?: string; kind?: string; file?: File | null } = {}): FormData {
  const formData = new FormData();
  formData.set("alt", entries.alt ?? "Tim sedang rapat");
  formData.set("kind", entries.kind ?? "photo");
  if (entries.file !== null) {
    formData.set("file", entries.file ?? new File(["raw"], "foto.jpg", { type: "image/jpeg" }));
  }
  return formData;
}

beforeEach(() => {
  mocks.getAdminDeps.mockReset();
  mocks.revalidate.mockReset();
  mocks.optimize.mockReset();
  mocks.optimize.mockResolvedValue({ data: Buffer.from("webp"), width: 1920, height: 1440, bytes: 4 });
});

describe("uploadMedia", () => {
  it("does nothing when the session is not an admin", async () => {
    mocks.getAdminDeps.mockRejectedValue(new Error("NEXT_REDIRECT:/admin/login"));

    await expect(uploadMedia(INITIAL_ADMIN_FORM_STATE, uploadForm())).rejects.toThrow("NEXT_REDIRECT:/admin/login");
    expect(mocks.optimize).not.toHaveBeenCalled();
    expect(mocks.revalidate).not.toHaveBeenCalled();
  });

  it("optimizes a photo to its width limit, stores it, and revalidates media", async () => {
    const deps = buildDeps();
    mocks.getAdminDeps.mockResolvedValue(deps);

    const state = await uploadMedia(INITIAL_ADMIN_FORM_STATE, uploadForm());

    expect(mocks.optimize).toHaveBeenCalledWith(expect.any(Buffer), { maxWidth: 1920, maxBytes: 102400 });
    expect(deps.storage.upload).toHaveBeenCalledWith(expect.stringMatching(/^uploads\/[0-9a-f-]+\.webp$/), Buffer.from("webp"), "image/webp");
    expect(state.status).toBe("saved");
    expect(mocks.revalidate).toHaveBeenCalledWith({ kind: "media" });
  });

  it("uses the logo width limit for logos", async () => {
    mocks.getAdminDeps.mockResolvedValue(buildDeps());

    await uploadMedia(INITIAL_ADMIN_FORM_STATE, uploadForm({ kind: "logo" }));

    expect(mocks.optimize).toHaveBeenCalledWith(expect.any(Buffer), { maxWidth: 600, maxBytes: 102400 });
  });

  it("returns an invalid state with the field error and does not revalidate when alt is empty", async () => {
    mocks.getAdminDeps.mockResolvedValue(buildDeps());

    const state = await uploadMedia(INITIAL_ADMIN_FORM_STATE, uploadForm({ alt: "" }));

    expect(state.status).toBe("invalid");
    expect(state.fieldErrors.alt).toBe("Isi teks alternatif gambar.");
    expect(mocks.revalidate).not.toHaveBeenCalled();
  });

  it("asks for a file when the form carries none", async () => {
    mocks.getAdminDeps.mockResolvedValue(buildDeps());

    const state = await uploadMedia(INITIAL_ADMIN_FORM_STATE, uploadForm({ file: null }));

    expect(state.fieldErrors.file).toBe("Pilih berkas gambar.");
  });

  it("turns an unexpected storage error into a failed state with the generic message", async () => {
    const deps = buildDeps();
    deps.storage.upload.mockRejectedValue(new Error("bucket down"));
    mocks.getAdminDeps.mockResolvedValue(deps);

    const state = await uploadMedia(INITIAL_ADMIN_FORM_STATE, uploadForm());

    expect(state.status).toBe("failed");
    expect(state.message).toBe("Gagal menyimpan. Coba lagi.");
    expect(mocks.revalidate).not.toHaveBeenCalled();
  });
});

describe("saveMediaAlt", () => {
  it("rejects an empty alt without writing", async () => {
    const deps = buildDeps();
    mocks.getAdminDeps.mockResolvedValue(deps);

    const outcome = await saveMediaAlt("m1", " ");

    expect(outcome).toEqual({ ok: false, message: "Isi teks alternatif gambar." });
    expect(deps.repository.updateAlt).not.toHaveBeenCalled();
  });

  it("saves a new alt and revalidates media", async () => {
    const deps = buildDeps();
    mocks.getAdminDeps.mockResolvedValue(deps);

    const outcome = await saveMediaAlt("m1", "Tim baru");

    expect(outcome).toEqual({ ok: true });
    expect(deps.repository.updateAlt).toHaveBeenCalledWith("m1", "Tim baru");
    expect(mocks.revalidate).toHaveBeenCalledWith({ kind: "media" });
  });
});

describe("removeMedia", () => {
  it("refuses to delete an image that is still used and names where", async () => {
    const deps = buildDeps({ usages: ["Layanan: Penyusunan SOP"] });
    mocks.getAdminDeps.mockResolvedValue(deps);

    const outcome = await removeMedia("m1");

    expect(outcome).toEqual({ ok: false, message: "Gambar ini masih dipakai di: Layanan: Penyusunan SOP." });
    expect(deps.repository.remove).not.toHaveBeenCalled();
    expect(deps.storage.remove).not.toHaveBeenCalled();
    expect(mocks.revalidate).not.toHaveBeenCalled();
  });

  it("deletes the record first and then the storage object", async () => {
    const deps = buildDeps();
    mocks.getAdminDeps.mockResolvedValue(deps);

    const outcome = await removeMedia("m1");

    expect(outcome).toEqual({ ok: true });
    expect(deps.repository.remove).toHaveBeenCalledWith("m1");
    expect(deps.storage.remove).toHaveBeenCalledWith("uploads/a.webp");
    expect(mocks.revalidate).toHaveBeenCalledWith({ kind: "media" });
  });

  it("skips storage for a bundled demo image that has no storage path", async () => {
    const deps = buildDeps({ storagePath: null });
    mocks.getAdminDeps.mockResolvedValue(deps);

    await removeMedia("m1");

    expect(deps.storage.remove).not.toHaveBeenCalled();
  });

  it("still succeeds when removing the storage object fails, because the record is already gone", async () => {
    const deps = buildDeps();
    deps.storage.remove.mockRejectedValue(new Error("denied"));
    mocks.getAdminDeps.mockResolvedValue(deps);

    expect(await removeMedia("m1")).toEqual({ ok: true });
  });
});
