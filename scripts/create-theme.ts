import { createTheme } from "./theme/create-theme";
import { formatNextSteps } from "./theme/next-steps";
import { parseThemeArgs } from "./theme/theme-args";

async function main(): Promise<void> {
  const themeName = parseThemeArgs(process.argv.slice(2));

  const { targetDir } = await createTheme({ boilerplateDir: process.cwd(), themeName });

  console.log(`Theme created: ${targetDir}`);
  formatNextSteps(targetDir).forEach((line) => console.log(line));
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
