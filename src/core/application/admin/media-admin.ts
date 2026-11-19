import type { MediaAdminRepository } from "@/core/domain/admin/admin-repositories";
import type { MediaRecord } from "@/core/domain/admin/records";
import { failure, success, type AdminResult } from "@/core/application/admin/admin-result";

export type MediaAffected = { kind: "media" };

export const MEDIA_ALT_MAX_LENGTH = 200;

export type MediaDraft = Omit<MediaRecord, "id" | "createdAt">;

export function mediaAltError(alt: string): string | null {
  if (alt.trim().length === 0) {
    return "Isi teks alternatif gambar.";
  }
  if (alt.length > MEDIA_ALT_MAX_LENGTH) {
    return `Teks alternatif maksimal ${MEDIA_ALT_MAX_LENGTH} karakter.`;
  }
  return null;
}

function draftErrors(draft: MediaDraft): Record<string, string> {
  const errors: Record<string, string> = {};
  const alt = mediaAltError(draft.alt);
  if (alt) errors.alt = alt;
  if (!/^(\/(?![\/\\])|https:\/\/)/.test(draft.url)) errors.url = "URL gambar harus diawali / atau https://.";
  if (!Number.isInteger(draft.width) || draft.width <= 0 || !Number.isInteger(draft.height) || draft.height <= 0) {
    errors.size = "Ukuran gambar tidak valid.";
  }
  return errors;
}

export async function registerMedia(
  deps: { repository: MediaAdminRepository },
  draft: MediaDraft,
): Promise<AdminResult<MediaRecord, MediaAffected>> {
  const errors = draftErrors(draft);
  if (Object.keys(errors).length > 0) {
    return failure(["Periksa kembali isian yang ditandai."], errors);
  }
  return success(await deps.repository.create({ ...draft, alt: draft.alt.trim() }), { kind: "media" });
}

export async function updateMediaAlt(
  deps: { repository: MediaAdminRepository },
  id: string,
  alt: string,
): Promise<AdminResult<MediaRecord, MediaAffected>> {
  const error = mediaAltError(alt);
  if (error) {
    return failure([error], { alt: error });
  }
  return success(await deps.repository.updateAlt(id, alt.trim()), { kind: "media" });
}

export async function deleteMedia(
  deps: { repository: MediaAdminRepository },
  id: string,
): Promise<AdminResult<{ storagePath: string | null }, MediaAffected>> {
  const record = await deps.repository.findById(id);
  if (!record) {
    return failure(["Gambar tidak ditemukan."]);
  }

  const usages = await deps.repository.findUsages(id);
  if (usages.length > 0) {
    return failure([`Gambar ini masih dipakai di: ${usages.join(", ")}.`]);
  }

  await deps.repository.remove(id);
  return success({ storagePath: record.storagePath }, { kind: "media" });
}
