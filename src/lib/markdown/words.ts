import { removeFencedCode } from "@/lib/markdown/code-blocks";

const IMAGE_PATTERN = /!\[[^\]]*\]\([^)]*\)/g;
const LINK_PATTERN = /\[([^\]]*)\]\([^)]*\)/g;
const WORD_PATTERN = /[\p{L}\p{N}]/u;

export function countWords(markdown: string): number {
  return removeFencedCode(markdown)
    .replace(IMAGE_PATTERN, " ")
    .replace(LINK_PATTERN, "$1")
    .split(/\s+/)
    .filter((token) => WORD_PATTERN.test(token)).length;
}
