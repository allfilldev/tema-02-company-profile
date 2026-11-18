import type { MediaAsset } from "@/core/domain/shared/media-asset";

export type AboutContent = {
  summary: string;
  bodyMd: string;
  image: MediaAsset | null;
  metaDescription: string;
  updatedAt: string;
};
