import type { MediaAsset } from "@/core/domain/shared/media-asset";

export type AboutContent = {
  summary: string;
  bodyMd: string;
  image: MediaAsset | null;
  metaTitle: string;
  metaDescription: string;
  updatedAt: string;
};
