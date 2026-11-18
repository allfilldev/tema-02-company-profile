import type { MediaAsset } from "@/core/domain/shared/media-asset";

export type PortfolioItem = {
  id: string;
  slug: string;
  title: string;
  clientName: string;
  category: string;
  summary: string;
  bodyMd: string;
  cover: MediaAsset | null;
  gallery: MediaAsset[];
  completedOn: string | null;
  metaTitle: string;
  metaDescription: string;
  sortOrder: number;
  updatedAt: string;
};
