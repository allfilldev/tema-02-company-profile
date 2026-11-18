import type { SectionKey } from "@/core/domain/shared/section-key";

export type SectionIntro = {
  key: SectionKey;
  eyebrow: string | null;
  title: string;
  description: string | null;
};
