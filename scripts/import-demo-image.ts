import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  LOGO_MAX_WIDTH,
  MAX_IMAGE_BYTES,
  PHOTO_MAX_WIDTH,
  optimizeToWebp,
} from "../src/infrastructure/images/optimize-webp";

const USAGE =
  "Usage: npm run image:import -- <source-file> <pack> <file-name> [--logo]";

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const isLogo = args.includes("--logo");
  const [sourceFile, pack, fileName] = args.filter((arg) => arg !== "--logo");

  if (!sourceFile || !pack || !fileName) {
    throw new Error(USAGE);
  }

  const input = await readFile(sourceFile);
  const result = await optimizeToWebp(input, {
    maxWidth: isLogo ? LOGO_MAX_WIDTH : PHOTO_MAX_WIDTH,
    maxBytes: MAX_IMAGE_BYTES,
  });

  const outputDirectory = path.join(process.cwd(), "public", "demo", pack);
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(path.join(outputDirectory, `${fileName}.webp`), result.data);

  console.log(`${result.width} ${result.height} ${result.bytes}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
