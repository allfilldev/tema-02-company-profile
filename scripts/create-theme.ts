import { createTheme } from "./theme/create-theme";

const USAGE = "Usage: npm run theme:new -- <theme-name>";

async function main(): Promise<void> {
  const themeName = process.argv[2];

  if (!themeName) {
    throw new Error(USAGE);
  }

  const { targetDir } = await createTheme({ boilerplateDir: process.cwd(), themeName });

  console.log(`Theme created: ${targetDir}`);
  console.log("Next steps:");
  console.log(`  cd ${targetDir}`);
  console.log("  npm install");
  console.log("  npm run dev");
  console.log("  read THEME.md for the design workflow");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
