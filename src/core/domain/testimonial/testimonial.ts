import type { MediaAsset } from "@/core/domain/shared/media-asset";

export type Testimonial = {
  id: string;
  name: string;
  jobTitle: string;
  company: string;
  quote: string;
  photo: MediaAsset | null;
  sortOrder: number;
};
