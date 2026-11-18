import type { MediaAsset } from "@/core/domain/shared/media-asset";

export type Partner = {
  id: string;
  name: string;
  logo: MediaAsset | null;
  url: string | null;
  sortOrder: number;
};
