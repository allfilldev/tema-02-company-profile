const USAGE = "Usage: npm run theme:new -- <theme-name>";

export function parseThemeArgs(args: readonly string[]): string {
  if (args.length !== 1) {
    throw new Error(USAGE);
  }

  return args[0];
}
