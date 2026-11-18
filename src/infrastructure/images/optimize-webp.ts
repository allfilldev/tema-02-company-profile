import sharp from "sharp";

export const PHOTO_MAX_WIDTH = 1920;
export const LOGO_MAX_WIDTH = 600;
export const MAX_IMAGE_BYTES = 102400;

const INITIAL_QUALITY = 82;
const QUALITY_STEP = 8;
const MIN_QUALITY = 42;
const WIDTH_SHRINK_RATIO = 0.85;
const MIN_WIDTH = 320;

export type OptimizeOptions = { maxWidth: number; maxBytes: number };

export type OptimizedImage = {
  data: Buffer;
  width: number;
  height: number;
  bytes: number;
};

async function encodeWebp(
  input: Buffer,
  width: number,
  quality: number,
): Promise<{ data: Buffer; width: number; height: number }> {
  const { data, info } = await sharp(input)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

export async function optimizeToWebp(
  input: Buffer,
  options: OptimizeOptions,
): Promise<OptimizedImage> {
  const sourceMetadata = await sharp(input).metadata();
  const sourceWidth = sourceMetadata.width ?? options.maxWidth;
  const startWidth = Math.min(options.maxWidth, sourceWidth);
  const minWidth = Math.min(MIN_WIDTH, startWidth);

  let targetWidth = startWidth;
  while (true) {
    for (
      let quality = INITIAL_QUALITY;
      quality >= MIN_QUALITY;
      quality -= QUALITY_STEP
    ) {
      const encoded = await encodeWebp(input, targetWidth, quality);
      if (encoded.data.length <= options.maxBytes) {
        return {
          data: encoded.data,
          width: encoded.width,
          height: encoded.height,
          bytes: encoded.data.length,
        };
      }
    }
    if (targetWidth <= minWidth) {
      throw new Error(
        `Image cannot be reduced under ${options.maxBytes} bytes at a minimum width of ${minWidth}px`,
      );
    }
    targetWidth = Math.max(
      minWidth,
      Math.floor(targetWidth * WIDTH_SHRINK_RATIO),
    );
  }
}
