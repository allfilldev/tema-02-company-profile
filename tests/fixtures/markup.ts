import { expect } from "vitest";
import { analyzeHeadings } from "@/lib/markdown/headings";

export type Heading = { level: number; text: string };

export function headingsOf(markup: string): Heading[] {
  return [...markup.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/g)].map((match) => ({
    level: Number(match[1]),
    text: match[2].replace(/<[^>]*>/g, "").trim(),
  }));
}

export function expectValidHeadingOutline(markup: string): void {
  const headings = headingsOf(markup);
  const analysis = analyzeHeadings(headings.map(({ level, text }) => `${"#".repeat(level)} ${text}`).join("\n"));

  expect(analysis.h1Count).toBe(1);
  expect(analysis.skipsLevel).toBe(false);
  expect(analysis.deepCount).toBe(0);
  expect(headings[0].level).toBe(1);
  for (const heading of headings) {
    expect(heading.text.length, `empty h${heading.level}`).toBeGreaterThan(0);
  }
}

export function countOccurrences(text: string, part: string): number {
  return text.split(part).length - 1;
}

export function imageTags(markup: string): string[] {
  return [...markup.matchAll(/<img\b[^>]*>/g)].map((match) => match[0]);
}

export function hrefsOf(markup: string): string[] {
  return [...markup.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)].map((match) => match[1]);
}

export function anchorTags(markup: string): string[] {
  return [...markup.matchAll(/<a\b[^>]*>/g)].map((match) => match[0]);
}

export function anchorTexts(markup: string): string[] {
  return [...markup.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/g)].map((match) => match[1].replace(/<[^>]*>/g, "").trim().toLowerCase());
}

export function expectMeaningfulAnchors(markup: string): void {
  const texts = anchorTexts(markup);

  expect(texts.length).toBeGreaterThan(0);
  for (const text of texts) {
    expect(text, "empty anchor text").not.toBe("");
    expect(text).not.toMatch(/klik di sini|click here/);
    expect(text).not.toMatch(/^(selengkapnya|baca|lihat|di sini)$/);
  }
}

export function expectCompleteImages(markup: string): void {
  const images = imageTags(markup);

  expect(images.length).toBeGreaterThan(0);
  for (const image of images) {
    expect(image).toMatch(/\bsrc="[^"]+"/);
    expect(image).toMatch(/\balt="[^"]+"/);
    expect(image).toMatch(/\bwidth="\d+"/);
    expect(image).toMatch(/\bheight="\d+"/);
  }
}
