import { describe, expect, it, vi } from "vitest";
import { createSupabaseMediaStorage, type StorageClient } from "@/infrastructure/supabase/media-storage";

function buildClient(uploadError: { message: string } | null = null, removeError: { message: string } | null = null) {
  const bucket = {
    upload: vi.fn(async () => ({ data: { path: "uploads/a.webp" }, error: uploadError })),
    getPublicUrl: vi.fn((path: string) => ({ data: { publicUrl: `https://project.supabase.co/storage/v1/object/public/media/${path}` } })),
    remove: vi.fn(async () => ({ data: [], error: removeError })),
  };
  const from = vi.fn(() => bucket);
  return { client: { storage: { from } } as unknown as StorageClient, bucket, from };
}

describe("createSupabaseMediaStorage", () => {
  it("uploads to the media bucket without overwriting and returns the public url", async () => {
    const { client, bucket, from } = buildClient();

    const result = await createSupabaseMediaStorage(client).upload("uploads/a.webp", Buffer.from("x"), "image/webp");

    expect(from).toHaveBeenCalledWith("media");
    expect(bucket.upload).toHaveBeenCalledWith("uploads/a.webp", Buffer.from("x"), { contentType: "image/webp", upsert: false });
    expect(result).toEqual({ publicUrl: "https://project.supabase.co/storage/v1/object/public/media/uploads/a.webp" });
  });

  it("throws the storage error message when the upload fails", async () => {
    const { client } = buildClient({ message: "bucket not found" });

    await expect(createSupabaseMediaStorage(client).upload("uploads/a.webp", Buffer.from("x"), "image/webp")).rejects.toThrow("bucket not found");
  });

  it("removes one object by path and throws when removal fails", async () => {
    const ok = buildClient();
    await createSupabaseMediaStorage(ok.client).remove("uploads/a.webp");
    expect(ok.bucket.remove).toHaveBeenCalledWith(["uploads/a.webp"]);

    const failing = buildClient(null, { message: "denied" });
    await expect(createSupabaseMediaStorage(failing.client).remove("uploads/a.webp")).rejects.toThrow("denied");
  });
});
