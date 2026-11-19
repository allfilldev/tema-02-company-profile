import type { MediaKind } from "@/core/application/admin/media-upload";

export type { MediaKind };

export const MAX_UPLOAD_WIDTH: Record<MediaKind, number> = { photo: 1920, logo: 600 };

const ENCODE_QUALITY = 0.9;

export function computeDownscaleSize(width: number, height: number, maxWidth: number): { width: number; height: number } {
  if (width <= maxWidth) {
    return { width, height };
  }
  return { width: maxWidth, height: Math.round((height * maxWidth) / width) };
}

function encodeCanvas(canvas: HTMLCanvasElement, type: string): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, ENCODE_QUALITY));
}

export async function downscaleImage(file: File, kind: MediaKind): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const size = computeDownscaleSize(bitmap.width, bitmap.height, MAX_UPLOAD_WIDTH[kind]);
  const canvas = document.createElement("canvas");
  canvas.width = size.width;
  canvas.height = size.height;

  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("Canvas is not available");
  }
  context.drawImage(bitmap, 0, 0, size.width, size.height);
  bitmap.close();

  const webp = await encodeCanvas(canvas, "image/webp");
  if (webp && webp.type === "image/webp") {
    return webp;
  }

  const fallback = await encodeCanvas(canvas, kind === "logo" ? "image/png" : "image/jpeg");
  if (!fallback) {
    throw new Error("The image could not be encoded");
  }
  return fallback;
}
