import { failure, type AdminResult } from "@/core/application/admin/admin-result";
import { mediaAltError, registerMedia, type MediaAffected } from "@/core/application/admin/media-admin";
import type { MediaAdminRepository } from "@/core/domain/admin/admin-repositories";
import type { MediaRecord } from "@/core/domain/admin/records";

export type MediaKind = "photo" | "logo";

export const MAX_UPLOAD_BYTES = 4_000_000;

const INVALID_MESSAGE = "Periksa kembali isian yang ditandai.";

export type MediaStorage = {
  upload(path: string, data: Buffer, contentType: string): Promise<{ publicUrl: string }>;
  remove(path: string): Promise<void>;
};

export type UploadableFile = {
  type: string;
  size: number;
  bytes(): Promise<Buffer>;
};

export type OptimizedUpload = {
  data: Buffer;
  width: number;
  height: number;
  bytes: number;
};

export type MediaUploadDeps = {
  repository: MediaAdminRepository;
  storage: MediaStorage;
  optimize: (input: Buffer, kind: MediaKind) => Promise<OptimizedUpload>;
  newId: () => string;
};

export type MediaUploadInput = {
  file: UploadableFile;
  alt: string;
  kind: MediaKind;
};

function fileError(file: UploadableFile): string | null {
  if (file.size === 0) return "Pilih berkas gambar.";
  if (!file.type.startsWith("image/")) return "Berkas harus berupa gambar.";
  if (file.size > MAX_UPLOAD_BYTES) return "Ukuran gambar maksimal 4 MB.";
  return null;
}

export async function uploadMediaImage(deps: MediaUploadDeps, input: MediaUploadInput): Promise<AdminResult<MediaRecord, MediaAffected>> {
  const errors: Record<string, string> = {};
  const fileProblem = fileError(input.file);
  const altProblem = mediaAltError(input.alt);
  if (fileProblem) errors.file = fileProblem;
  if (altProblem) errors.alt = altProblem;
  if (Object.keys(errors).length > 0) {
    return failure([INVALID_MESSAGE], errors);
  }

  let optimized: OptimizedUpload;
  try {
    optimized = await deps.optimize(await input.file.bytes(), input.kind);
  } catch {
    return failure([INVALID_MESSAGE], { file: "Berkas gambar tidak bisa diproses." });
  }

  const storagePath = `uploads/${deps.newId()}.webp`;
  const { publicUrl } = await deps.storage.upload(storagePath, optimized.data, "image/webp");

  try {
    const registered = await registerMedia(
      { repository: deps.repository },
      { url: publicUrl, alt: input.alt, width: optimized.width, height: optimized.height, sizeBytes: optimized.bytes, storagePath },
    );
    if (!registered.ok) {
      await deps.storage.remove(storagePath);
    }
    return registered;
  } catch (error) {
    await deps.storage.remove(storagePath);
    throw error;
  }
}

