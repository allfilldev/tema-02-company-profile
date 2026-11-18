export const FAVICON_MAX_ASPECT_RATIO = 1.1;

export function assertSquareFaviconSource(width: number, height: number): void {
  const hasSize = width > 0 && height > 0;
  const ratio = hasSize ? Math.max(width, height) / Math.min(width, height) : Infinity;

  if (ratio > FAVICON_MAX_ASPECT_RATIO) {
    throw new Error(
      `The favicon source must be a square symbol (got ${width}x${height}). A wide wordmark is unreadable at 16 and 32 px.`,
    );
  }
}
