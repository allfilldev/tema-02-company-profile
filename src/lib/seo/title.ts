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

const TRAILING_SEPARATORS = /[\s,;:\-–—]+$/;

export function fitPageTitle(base: string, suffix: string, siteName: string): string {
  const available = TITLE_MAX - titleSuffix(siteName).length - suffix.length;
  if (available <= 0) {
    return suffix;
  }
  if (base.length <= available) {
    return `${base}${suffix}`;
  }

  const words = base.split(" ");
  while (words.length > 1 && words.join(" ").length > available) {
    words.pop();
  }

  const cut = words.join(" ").slice(0, available).replace(TRAILING_SEPARATORS, "");
  return `${cut}${suffix}`;
}
