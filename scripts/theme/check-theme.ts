import { runGit } from "./git";
import { classifyChangedFiles, type ThemeCheckReport } from "./locked-paths";

const UPSTREAM_REMOTE = "upstream";
const UPSTREAM_BRANCH = "upstream/main";
const QUOTE_PATH_OFF = ["-c", "core.quotePath=false"];

function splitLines(output: string): string[] {
  return output.split("\n").filter((line) => line.length > 0);
}

export async function checkTheme(themeDir: string, env?: NodeJS.ProcessEnv): Promise<ThemeCheckReport> {
  const remotes = splitLines(await runGit(themeDir, ["remote"], env));

  if (!remotes.includes(UPSTREAM_REMOTE)) {
    throw new Error("This folder has no upstream remote. Run theme:check from inside a theme created with theme:new.");
  }

  await runGit(themeDir, ["fetch", "--quiet", UPSTREAM_REMOTE], env);

  const base = (await runGit(themeDir, ["merge-base", UPSTREAM_BRANCH, "HEAD"], env)).trim();
  const tracked = splitLines(await runGit(themeDir, [...QUOTE_PATH_OFF, "diff", "--name-only", "--no-renames", base], env));
  const untracked = splitLines(await runGit(themeDir, [...QUOTE_PATH_OFF, "ls-files", "--others", "--exclude-standard"], env));

  return classifyChangedFiles([...tracked, ...untracked]);
}
