import { checkTheme } from "./theme/check-theme";

async function main(): Promise<void> {
  const report = await checkTheme(process.cwd());

  if (report.review.length > 0) {
    console.log("Needs review:");
    report.review.forEach((file) => console.log(`  ${file}`));
  }

  if (report.locked.length === 0) {
    console.log("Theme respects the locked folders.");
    return;
  }

  console.log("Locked files changed:");
  report.locked.forEach((file) => console.log(`  ${file}`));
  process.exit(1);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
