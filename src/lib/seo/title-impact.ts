import { TITLE_MAX, TITLE_MIN } from "@/lib/seo/limits";
import { rawPageTitle } from "@/lib/seo/title";

export type TitleImpact = {
  label: string;
  title: string;
  result: "truncated" | "too-short";
};

export function findTitleImpacts(entries: readonly { label: string; title: string }[], siteName: string): TitleImpact[] {
  const impacts: TitleImpact[] = [];

  for (const { label, title } of entries) {
    const fullLength = rawPageTitle(title, siteName).length;
    if (fullLength > TITLE_MAX) {
      impacts.push({ label, title, result: "truncated" });
    } else if (fullLength < TITLE_MIN) {
      impacts.push({ label, title, result: "too-short" });
    }
  }

  return impacts;
}
