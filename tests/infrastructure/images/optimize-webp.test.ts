import { randomBytes } from "node:crypto";
import sharp from "sharp";
import { beforeAll, describe, expect, it } from "vitest";
import {
  LOGO_MAX_WIDTH,
  MAX_IMAGE_BYTES,
  PHOTO_MAX_WIDTH,
  optimizeToWebp,
} from "@/infrastructure/images/optimize-webp";

const TEST_TIMEOUT_MS = 60000;

async function createNoisyPng(): Promise<Buffer> {
  const width = 3000;
  const height = 2000;
  return sharp(randomBytes(width * height * 3), {
    raw: { width, height, channels: 3 },
  })
    .png()
    .toBuffer();
}

async function createTransparentPng(): Promise<Buffer> {
  const size = 800;
  const radius = size / 3;
  const center = size / 2;
  const pixels = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const offset = (y * size + x) * 4;
      const insideCircle = (x - center) ** 2 + (y - center) ** 2 <= radius ** 2;
      pixels[offset] = 220;
      pixels[offset + 1] = 60;
      pixels[offset + 2] = 40;
      pixels[offset + 3] = insideCircle ? 255 : 0;
    }
  }
  return sharp(pixels, { raw: { width: size, height: size, channels: 4 } })
    .png()
    .toBuffer();
}

async function createSmallPng(): Promise<Buffer> {
  return sharp({
    create: {
      width: 400,
      height: 300,
      channels: 3,
      background: { r: 30, g: 120, b: 200 },
    },
  })
    .png()
    .toBuffer();
}

describe("optimizeToWebp", () => {
  let noisyPng: Buffer;
  let transparentPng: Buffer;
  let smallPng: Buffer;

  beforeAll(async () => {
    noisyPng = await createNoisyPng();
    transparentPng = await createTransparentPng();
    smallPng = await createSmallPng();
  }, TEST_TIMEOUT_MS);

  it(
    "shrinks a large photo under the byte limit and max width",
    async () => {
      const result = await optimizeToWebp(noisyPng, {
        maxWidth: PHOTO_MAX_WIDTH,
        maxBytes: MAX_IMAGE_BYTES,
      });
      expect(result.width).toBeLessThanOrEqual(1920);
      expect(result.bytes).toBeLessThanOrEqual(102400);
      expect((await sharp(result.data).metadata()).format).toBe("webp");
    },
    TEST_TIMEOUT_MS,
  );

  it("keeps transparency", async () => {
    const result = await optimizeToWebp(transparentPng, {
      maxWidth: LOGO_MAX_WIDTH,
      maxBytes: MAX_IMAGE_BYTES,
    });
    expect((await sharp(result.data).metadata()).hasAlpha).toBe(true);
    expect(result.width).toBe(600);
  });

  it("never enlarges a small image", async () => {
    const result = await optimizeToWebp(smallPng, {
      maxWidth: PHOTO_MAX_WIDTH,
      maxBytes: MAX_IMAGE_BYTES,
    });
    expect(result.width).toBe(400);
  });
});
