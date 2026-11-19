import type { MediaAsset } from "@/core/domain/shared/media-asset";

export type InsertResult = {
  value: string;
  cursor: number;
};

export function insertImageMarkdown(
  text: string,
  selectionStart: number,
  selectionEnd: number,
  asset: MediaAsset,
  caption: string,
): InsertResult {
  const alt = asset.alt.replace(/[\[\]]/g, "");
  const title = caption.trim().replace(/"/g, "'");
  const markdown = title.length > 0 ? `![${alt}](${asset.url} "${title}")` : `![${alt}](${asset.url})`;

  return {
    value: `${text.slice(0, selectionStart)}${markdown}${text.slice(selectionEnd)}`,
    cursor: selectionStart + markdown.length,
  };
}
