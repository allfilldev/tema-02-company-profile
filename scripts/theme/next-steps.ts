export function formatNextSteps(targetDir: string): string[] {
  return [
    "Next steps:",
    `  cd "${targetDir}"`,
    "  npm install",
    "  read THEME.md for the design workflow, and preview with the dev server entry in .claude/launch.json",
  ];
}
