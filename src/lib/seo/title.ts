import { TITLE_MAX } from "@/lib/seo/limits";

export function titleSuffix(siteName: string): string {
  return ` | ${siteName}`;
}

export function maxMetaTitleLength(siteName: string): number {
  return Math.max(0, TITLE_MAX - titleSuffix(siteName).length);
}

export function buildPageTitle(title: string, siteName: string): string {
  return `${title}${titleSuffix(siteName)}`;
}
