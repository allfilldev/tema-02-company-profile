import { access, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { runGit } from "./git";
import { setThemeName } from "./set-theme-name";
import { validateThemeName } from "./theme-name";
import { resolveThemePaths } from "./theme-paths";

export interface CreateThemeOptions {
  boilerplateDir: string;
  themeName: string;
  env?: NodeJS.ProcessEnv;
}

export interface CreateThemeResult {
  siteType: string;
  themeName: string;
  targetDir: string;
}

const THEME_CONFIG_PATH = "src/config/theme.ts";
const DISABLED_PUSH_URL = "DISABLED";

async function pathExists(target: string): Promise<boolean> {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

export async function createTheme(options: CreateThemeOptions): Promise<CreateThemeResult> {
  const { boilerplateDir, themeName, env } = options;

  const nameError = validateThemeName(themeName);
  if (nameError) {
    throw new Error(nameError);
  }

  const { siteType, targetDir } = resolveThemePaths(boilerplateDir, themeName);

  const pendingChanges = (await runGit(boilerplateDir, ["status", "--porcelain"], env)).trim();
  if (pendingChanges) {
    throw new Error("The boilerplate has uncommitted changes. Commit or stash them first, because only committed work is copied into the theme.");
  }

  if (await pathExists(targetDir)) {
    throw new Error(`Theme folder already exists: ${targetDir}`);
  }

  try {
    await runGit(boilerplateDir, ["clone", "--no-hardlinks", "--quiet", boilerplateDir, targetDir], env);
    await runGit(targetDir, ["remote", "rename", "origin", "upstream"], env);
    await runGit(targetDir, ["branch", "--unset-upstream"], env);
    await runGit(targetDir, ["remote", "set-url", "--push", "upstream", DISABLED_PUSH_URL], env);

    const configPath = path.join(targetDir, THEME_CONFIG_PATH);
    await writeFile(configPath, setThemeName(await readFile(configPath, "utf8"), themeName));
    await runGit(targetDir, ["add", THEME_CONFIG_PATH], env);
    await runGit(targetDir, ["commit", "--quiet", "-m", `init: create ${themeName} theme`], env);
  } catch (error) {
    await rm(targetDir, { recursive: true, force: true });
    throw error;
  }

  return { siteType, themeName, targetDir };
}
