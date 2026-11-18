import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { buildIco } from "../src/lib/images/ico";
import { assertSquareFaviconSource } from "./lib/favicon-source";

const USAGE = "Usage: npm run favicon -- <source-image>";

const ICO_SIZES = [16, 32, 48];

const PNG_OUTPUTS: ReadonlyArray<{ fileName: string; size: number }> = [
  { fileName: "icon.png", size: 512 },
  { fileName: "apple-touch-icon.png", size: 180 },
  { fileName: "icon-192.png", size: 192 },
  { fileName: "icon-512.png", size: 512 },
];

const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

function renderPng(source: Buffer, size: number): Promise<Buffer> {
  return sharp(source)
    .resize(size, size, { fit: "contain", background: TRANSPARENT })
    .ensureAlpha()
    .png()
    .toBuffer();
}

async function main(): Promise<void> {
  const [sourceFile] = process.argv.slice(2);

  if (!sourceFile) {
    throw new Error(USAGE);
  }

  const source = await readFile(sourceFile);
  const { width, height } = await sharp(source).metadata();
  assertSquareFaviconSource(width ?? 0, height ?? 0);
  const outputDirectory = path.join(process.cwd(), "public");
  await mkdir(outputDirectory, { recursive: true });

  const frames = await Promise.all(ICO_SIZES.map((size) => renderPng(source, size)));
  await writeFile(path.join(outputDirectory, "favicon.ico"), buildIco(frames));
  console.log(`favicon.ico ${ICO_SIZES.join(",")}`);

  for (const { fileName, size } of PNG_OUTPUTS) {
    await writeFile(path.join(outputDirectory, fileName), await renderPng(source, size));
    console.log(`${fileName} ${size}x${size}`);
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
