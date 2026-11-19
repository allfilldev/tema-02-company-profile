import type { MediaAsset } from "@/core/domain/shared/media-asset";

export interface MediaRepository {
  listAll(): Promise<MediaAsset[]>;
}
