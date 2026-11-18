export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

export const OG_IMAGE_CONTENT_TYPE = "image/png";

export const OG_TITLE_MAX_LENGTH = 110;

export const OG_SUBTITLE_MAX_LENGTH = 160;

export const OG_FOOTER_MAX_LENGTH = 60;

const ELLIPSIS = "...";
const LARGE_TITLE_MAX_LENGTH = 40;
const MEDIUM_TITLE_MAX_LENGTH = 70;

export type OgTitle = {
  text: string;
  fontSize: number;
};

export function truncateOgText(value: string, maxLength: number): string {
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) {
    return text;
  }

  const limit = maxLength - ELLIPSIS.length;
  const lastSpace = text.lastIndexOf(" ", limit);
  const cut = lastSpace > 0 ? text.slice(0, lastSpace) : text.slice(0, limit);
  return `${cut}${ELLIPSIS}`;
}

export function fitOgTitle(title: string): OgTitle {
  const text = truncateOgText(title, OG_TITLE_MAX_LENGTH);

  if (text.length <= LARGE_TITLE_MAX_LENGTH) {
    return { text, fontSize: 80 };
  }
  if (text.length <= MEDIUM_TITLE_MAX_LENGTH) {
    return { text, fontSize: 64 };
  }
  return { text, fontSize: 52 };
}
