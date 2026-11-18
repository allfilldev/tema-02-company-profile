import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { generalMedia } from "@/content/packs/general/media";

describe("general pack media", () => {
  it.each(Object.entries(generalMedia))("%s is a valid demo image", async (key, asset) => {
    expect(asset.id).toBe(key);
    expect(asset.url).toBe(`/demo/general/${key}.webp`);
    expect(asset.alt.trim().length).toBeGreaterThan(0);
    const file = await readFile(path.join(process.cwd(), "public", asset.url));
    expect(file.byteLength).toBeLessThanOrEqual(102400);
    const meta = await sharp(file).metadata();
    expect(meta.format).toBe("webp");
    expect([meta.width, meta.height]).toEqual([asset.width, asset.height]);
  });

  it("has every required key", () => {
    expect(Object.keys(generalMedia)).toHaveLength(50);
  });

  it("keeps the logo transparent", async () => {
    const meta = await sharp(path.join(process.cwd(), "public", generalMedia.logo.url)).metadata();
    expect(meta.hasAlpha).toBe(true);
  });
});
