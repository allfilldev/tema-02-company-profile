import type { FaqItem } from "@/core/domain/shared/faq-item";
import type { MediaAsset } from "@/core/domain/shared/media-asset";

export type Service = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  bodyMd: string;
  cover: MediaAsset | null;
  metaTitle: string;
  metaDescription: string;
  faq: FaqItem[];
  sortOrder: number;
  updatedAt: string;
};
