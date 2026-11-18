import { mkdir, mkdtemp, readFile, realpath, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { runGit } from "../../scripts/theme/git";

export interface ThemeWorkspace {
  rootDir: string;
  boilerplateDir: string;
  themeDir(name: string): string;
  env: NodeJS.ProcessEnv;
  commitInBoilerplate(files: Record<string, string>, message: string): Promise<void>;
  dispose(): Promise<void>;
}

const GIT_ENV: NodeJS.ProcessEnv = {
  GIT_AUTHOR_NAME: "Test Author",
  GIT_AUTHOR_EMAIL: "author@example.test",
  GIT_COMMITTER_NAME: "Test Author",
  GIT_COMMITTER_EMAIL: "author@example.test",
  GIT_CONFIG_GLOBAL: "/dev/null",
  GIT_CONFIG_NOSYSTEM: "1",
};

async function writeProjectFile(baseDir: string, relativePath: string, content: string): Promise<void> {
  const filePath = path.join(baseDir, relativePath);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content);
}

export async function buildThemeWorkspace(): Promise<ThemeWorkspace> {
  const rootDir = await realpath(await mkdtemp(path.join(os.tmpdir(), "theme-workspace-")));
  const boilerplateDir = path.join(rootDir, "boilerplates", "demo-type");
  const realThemeSource = await readFile(path.join(process.cwd(), "src/config/theme.ts"), "utf8");

  await mkdir(boilerplateDir, { recursive: true });
  await runGit(boilerplateDir, ["init", "--quiet", "-b", "main"], GIT_ENV);

  const files: Record<string, string> = {
    "src/config/theme.ts": realThemeSource.replace("Company Profile Default", "Demo"),
    "src/lib/a.ts": "export const a = 1;\n",
    "src/core/b.ts": "export const b = 1;\n",
    "src/styles/c.css": ".c { color: red; }\n",
    "package.json": '{ "name": "demo-type" }\n',
    ".gitignore": "node_modules/\n.env\n",
    "node_modules/x/index.js": "module.exports = 1;\n",
    ".env": "SECRET=1\n",
  };

  for (const [relativePath, content] of Object.entries(files)) {
    await writeProjectFile(boilerplateDir, relativePath, content);
  }

  await runGit(boilerplateDir, ["add", "-A"], GIT_ENV);
  await runGit(boilerplateDir, ["commit", "--quiet", "-m", "init: start demo boilerplate"], GIT_ENV);

  return {
    rootDir,
    boilerplateDir,
    themeDir: (name) => path.join(rootDir, "themes", "demo-type", name),
    env: GIT_ENV,
    async commitInBoilerplate(changes, message) {
      for (const [relativePath, content] of Object.entries(changes)) {
        await writeProjectFile(boilerplateDir, relativePath, content);
      }
      await runGit(boilerplateDir, ["add", "-A"], GIT_ENV);
      await runGit(boilerplateDir, ["commit", "--quiet", "-m", message], GIT_ENV);
    },
    async dispose() {
      await rm(rootDir, { recursive: true, force: true });
    },
  };
}
