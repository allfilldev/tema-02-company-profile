import { removeFencedCode } from "@/lib/markdown/code-blocks";

const IMAGE_PATTERN = /!\[[^\]]*\]\([^)]*\)/g;
const LINK_PATTERN = /\[[^\]]*\]\(\s*([^)\s]*)[^)]*\)/g;

export function countLinks(markdown: string): { internal: number; external: number } {
  const withoutImages = removeFencedCode(markdown).replace(IMAGE_PATTERN, " ");
  let internal = 0;
  let external = 0;

  for (const match of withoutImages.matchAll(LINK_PATTERN)) {
    const href = match[1];
    if (href.startsWith("/")) internal += 1;
    else if (href.startsWith("http://") || href.startsWith("https://")) external += 1;
  }

  return { internal, external };
}
