import type { MediaAdminRepository } from "@/core/domain/admin/admin-repositories";
import type { MediaAsset } from "@/core/domain/shared/media-asset";

export type MediaSelection = Record<string, string | string[] | null>;

export type ResolvedMedia = {
  assets: Record<string, MediaAsset | MediaAsset[] | null>;
  errors: Record<string, string>;
};

const UNKNOWN_MEDIA_MESSAGE = "Gambar tidak ditemukan di pustaka media.";

function toAsset(record: { id: string; url: string; alt: string; width: number; height: number }): MediaAsset {
  return { id: record.id, url: record.url, alt: record.alt, width: record.width, height: record.height };
}

export async function resolveMedia(selection: MediaSelection, repository: Pick<MediaAdminRepository, "findById">): Promise<ResolvedMedia> {
  const assets: ResolvedMedia["assets"] = {};
  const errors: Record<string, string> = {};

  for (const [field, selected] of Object.entries(selection)) {
    if (selected === null) {
      assets[field] = null;
    } else if (Array.isArray(selected)) {
      const found = await Promise.all(selected.map((id) => repository.findById(id)));
      assets[field] = found.flatMap((record) => (record ? [toAsset(record)] : []));
      if (found.some((record) => record === null)) errors[field] = UNKNOWN_MEDIA_MESSAGE;
    } else {
      const record = await repository.findById(selected);
      assets[field] = record ? toAsset(record) : null;
      if (!record) errors[field] = UNKNOWN_MEDIA_MESSAGE;
    }
  }

  return { assets, errors };
}
