import type { CallToAction } from "@/core/domain/shared/call-to-action";
import type { MediaAsset } from "@/core/domain/shared/media-asset";

export type ContentBlockItem = {
  title: string | null;
  description: string | null;
  icon: string | null;
  media: MediaAsset | null;
  link: CallToAction | null;
};

export type ContentBlock = {
  key: string;
  eyebrow: string | null;
  title: string;
  description: string | null;
  items: ContentBlockItem[];
};
