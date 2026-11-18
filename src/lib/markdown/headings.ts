import { removeFencedCode } from "@/lib/markdown/code-blocks";

export type MarkdownHeading = { level: number; text: string };

export type HeadingAnalysis = {
  h1Count: number;
  h2Count: number;
  h3Count: number;
  deepCount: number;
  skipsLevel: boolean;
};

const HEADING_PATTERN = /^ {0,3}(#{1,6})[ \t]+(.*)$/;
const CLOSING_HASHES_PATTERN = /[ \t]+#+[ \t]*$/;

export function extractHeadings(markdown: string): MarkdownHeading[] {
  const headings: MarkdownHeading[] = [];

  for (const line of removeFencedCode(markdown).split("\n")) {
    const match = HEADING_PATTERN.exec(line);
    if (!match) continue;

    const text = match[2].replace(CLOSING_HASHES_PATTERN, "").trim();
    headings.push({ level: match[1].length, text });
  }

  return headings;
}

export function analyzeHeadings(markdown: string): HeadingAnalysis {
  const headings = extractHeadings(markdown);
  let previousLevel = 1;
  let skipsLevel = false;

  for (const { level } of headings) {
    if (level < 2) continue;
    if (level > previousLevel + 1) skipsLevel = true;
    previousLevel = level;
  }

  return {
    h1Count: headings.filter(({ level }) => level === 1).length,
    h2Count: headings.filter(({ level }) => level === 2).length,
    h3Count: headings.filter(({ level }) => level === 3).length,
    deepCount: headings.filter(({ level }) => level >= 4).length,
    skipsLevel,
  };
}
