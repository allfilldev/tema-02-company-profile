import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { checkTheme } from "../../../scripts/theme/check-theme";
import { createTheme } from "../../../scripts/theme/create-theme";
import { runGit } from "../../../scripts/theme/git";
import { buildThemeWorkspace, type ThemeWorkspace } from "../../fixtures/theme-workspace";

const TIMEOUT = 30000;

describe("checkTheme", () => {
  let workspace: ThemeWorkspace;
  let themeDir: string;

  beforeEach(async () => {
    workspace = await buildThemeWorkspace();
    await createTheme({ boilerplateDir: workspace.boilerplateDir, themeName: "arunika", env: workspace.env });
    themeDir = workspace.themeDir("arunika");
  });

  afterEach(async () => {
    await workspace.dispose();
  });

  function git(cwd: string, ...args: string[]) {
    return runGit(cwd, args, workspace.env);
  }

  it("reports nothing for a fresh theme", async () => {
    expect(await checkTheme(themeDir, workspace.env)).toEqual({ locked: [], review: [] });
  }, TIMEOUT);

  it("reports committed, uncommitted, and untracked changes in locked folders", async () => {
    await writeFile(path.join(themeDir, "src/lib/a.ts"), "export const a = 99;\n");
    await git(themeDir, "add", "-A");
    await git(themeDir, "commit", "--quiet", "-m", "feat: change a");
    await mkdir(path.join(themeDir, "src/core"), { recursive: true });
    await writeFile(path.join(themeDir, "src/core/new.ts"), "export const n = 1;\n");
    await writeFile(path.join(themeDir, "src/styles/c.css"), ".c { color: blue; }\n");

    const report = await checkTheme(themeDir, workspace.env);

    expect(report.locked).toEqual(["src/core/new.ts", "src/lib/a.ts"]);
    expect(report.review).toEqual([]);
  }, TIMEOUT);

  it("reports locked files whose names contain non-ASCII characters", async () => {
    await mkdir(path.join(themeDir, "src/core"), { recursive: true });
    await writeFile(path.join(themeDir, "src/core/café.ts"), "export const c = 1;\n");

    const report = await checkTheme(themeDir, workspace.env);

    expect(report.locked).toEqual(["src/core/café.ts"]);
  }, TIMEOUT);

  it("reports a file moved out of a locked folder under its old path", async () => {
    await git(themeDir, "mv", "src/lib/a.ts", "src/styles/a.ts");
    await git(themeDir, "commit", "--quiet", "-m", "feat: move a");

    const report = await checkTheme(themeDir, workspace.env);

    expect(report.locked).toEqual(["src/lib/a.ts"]);
  }, TIMEOUT);

  it("does not count merged upstream changes as theme changes", async () => {
    await workspace.commitInBoilerplate({ "src/lib/a.ts": "export const a = 2;\n" }, "feat: change a");
    await git(themeDir, "fetch", "upstream");
    await git(themeDir, "merge", "upstream/main", "--no-edit");

    expect(await checkTheme(themeDir, workspace.env)).toEqual({ locked: [], review: [] });
  }, TIMEOUT);

  it("requires an upstream remote", async () => {
    await expect(checkTheme(workspace.boilerplateDir, workspace.env)).rejects.toThrow(/upstream/);
  }, TIMEOUT);
});
