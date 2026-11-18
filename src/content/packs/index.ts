import type { ContentPack } from "@/core/domain/content-pack/content-pack";
import { generalPack } from "@/content/packs/general";

export const CONTENT_PACKS: Record<string, ContentPack> = {
  general: generalPack,
};
