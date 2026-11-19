import type { MediaAsset } from "@/core/domain/shared/media-asset";

function isMediaAsset(value: object): value is MediaAsset {
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.url === "string" &&
    typeof candidate.alt === "string" &&
    typeof candidate.width === "number" &&
    typeof candidate.height === "number"
  );
}

export function collectMediaAssets(source: unknown): MediaAsset[] {
  const found = new Map<string, MediaAsset>();

  function visit(value: unknown): void {
    if (!value || typeof value !== "object") {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (isMediaAsset(value)) {
      if (!found.has(value.id)) {
        found.set(value.id, value);
      }
      return;
    }
    Object.values(value).forEach(visit);
  }

  visit(source);
  return [...found.values()];
}
