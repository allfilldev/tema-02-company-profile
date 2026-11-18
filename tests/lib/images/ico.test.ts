import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { buildIco } from "@/lib/images/ico";

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47];
const HEADER_BYTES = 6;
const ENTRY_BYTES = 16;

async function buildPng(size: number): Promise<Buffer> {
  return sharp({ create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .png()
    .toBuffer();
}

describe("buildIco", () => {
  it("writes the ico header with the image count", async () => {
    const ico = buildIco([await buildPng(16), await buildPng(32)]);

    expect([...ico.subarray(0, 4)]).toEqual([0, 0, 1, 0]);
    expect(ico.readUInt16LE(4)).toBe(2);
  });

  it("points every entry to a png payload and records its size", async () => {
    const pngs = [await buildPng(16), await buildPng(32), await buildPng(48)];
    const ico = buildIco(pngs);

    pngs.forEach((png, index) => {
      const entry = HEADER_BYTES + index * ENTRY_BYTES;
      const offset = ico.readUInt32LE(entry + 12);

      expect(ico.readUInt8(entry)).toBe([16, 32, 48][index]);
      expect(ico.readUInt8(entry + 1)).toBe([16, 32, 48][index]);
      expect(ico.readUInt16LE(entry + 6)).toBe(32);
      expect(ico.readUInt32LE(entry + 8)).toBe(png.length);
      expect(offset).toBeGreaterThanOrEqual(HEADER_BYTES + pngs.length * ENTRY_BYTES);
      expect([...ico.subarray(offset, offset + 4)]).toEqual(PNG_SIGNATURE);
      expect(ico.subarray(offset, offset + png.length).equals(png)).toBe(true);
    });
  });

  it("starts the first payload right after the directory", async () => {
    const ico = buildIco([await buildPng(16), await buildPng(32)]);

    expect(ico.readUInt32LE(HEADER_BYTES + 12)).toBe(HEADER_BYTES + 2 * ENTRY_BYTES);
  });

  it("stores a 256 pixel image with a zero width and height byte", async () => {
    const ico = buildIco([await buildPng(256)]);

    expect(ico.readUInt8(HEADER_BYTES)).toBe(0);
    expect(ico.readUInt8(HEADER_BYTES + 1)).toBe(0);
  });

  it("has a total length of the directory plus every payload", async () => {
    const pngs = [await buildPng(16), await buildPng(32)];
    const ico = buildIco(pngs);

    expect(ico.length).toBe(HEADER_BYTES + 2 * ENTRY_BYTES + pngs[0].length + pngs[1].length);
  });
});
