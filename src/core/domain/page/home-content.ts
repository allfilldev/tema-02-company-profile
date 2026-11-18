import type { CallToAction } from "@/core/domain/shared/call-to-action";
import type { MediaAsset } from "@/core/domain/shared/media-asset";

export type HomeContent = {
  heroEyebrow: string | null;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: MediaAsset | null;
  primaryCta: CallToAction | null;
  secondaryCta: CallToAction | null;
  updatedAt: string;
};
