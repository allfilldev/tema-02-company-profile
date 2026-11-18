import type { MediaAsset } from "@/core/domain/shared/media-asset";

export type TeamMember = {
  id: string;
  name: string;
  jobTitle: string;
  bio: string;
  photo: MediaAsset | null;
  yearsExperience: number | null;
  profiles: string[];
  sortOrder: number;
};
