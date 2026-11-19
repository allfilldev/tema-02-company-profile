import { META_DESCRIPTION_MAX } from "@/lib/seo/limits";

const TRAILING_SEPARATORS = /[\s,;:\-–—]+$/;

function cutAtWordBoundary(text: string, max: number): string {
  if (text.length <= max) {
    return text;
  }
  const words = text.split(" ");
  while (words.length > 1 && words.join(" ").length > max) {
    words.pop();
  }
  return words.join(" ").slice(0, max).replace(TRAILING_SEPARATORS, "");
}

export function paginatedDescription(base: string, page: number): string {
  if (page <= 1) {
    return base;
  }
  return cutAtWordBoundary(`Halaman ${page}: ${base}`, META_DESCRIPTION_MAX);
}
