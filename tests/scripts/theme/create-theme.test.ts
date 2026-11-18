import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createTheme } from "../../../scripts/theme/create-theme";
import { runGit } from "../../../scripts/theme/git";
import { buildThemeWorkspace, type ThemeWorkspace } from "../../fixtures/theme-workspace";

const TIMEOUT = 30000;

async function exists(target: string): Promise<boolean> {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

describe("createTheme", () => {
  let workspace: ThemeWorkspace;

  beforeEach(async () => {
    workspace = await buildThemeWorkspace();
  });

  afterEach(async () => {
    await workspace.dispose();
  });

  function create(themeName: string, boilerplateDir = workspace.boilerplateDir) {
    return createTheme({ boilerplateDir, themeName, env: workspace.env });
  }

  function git(cwd: string, ...args: string[]) {
    return runGit(cwd, args, workspace.env);
  }

  it("creates a theme", async () => {
    const result = await create("arunika");
    const themeDir = workspace.themeDir("arunika");

    expect(result).toEqual({ siteType: "demo-type", themeName: "arunika", targetDir: themeDir });
    expect(await readFile(path.join(themeDir, "src/config/theme.ts"), "utf8")).toContain('themeName: "arunika"');
    expect(await exists(path.join(themeDir, "node_modules"))).toBe(false);
    expect(await exists(path.join(themeDir, ".env"))).toBe(false);
    expect((await git(themeDir, "remote")).trim()).toBe("upstream");
    expect((await git(themeDir, "remote", "get-url", "upstream")).trim()).toBe(workspace.boilerplateDir);
    expect((await git(themeDir, "remote", "get-url", "--push", "upstream")).trim()).toBe("DISABLED");
    expect((await git(themeDir, "log", "-1", "--format=%s")).trim()).toBe("init: create arunika theme");
    expect((await git(themeDir, "status", "--porcelain")).trim()).toBe("");
  }, TIMEOUT);

  it("merges upstream changes", async () => {
    await create("arunika");
    const themeDir = workspace.themeDir("arunika");
    await workspace.commitInBoilerplate({ "src/lib/a.ts": "export const a = 2;\n" }, "feat: change a");

    await git(themeDir, "fetch", "upstream");
    await git(themeDir, "merge", "upstream/main", "--no-edit");

    expect(await readFile(path.join(themeDir, "src/lib/a.ts"), "utf8")).toBe("export const a = 2;\n");
    expect(await readFile(path.join(themeDir, "src/config/theme.ts"), "utf8")).toContain('themeName: "arunika"');
  }, TIMEOUT);

  it("cannot push to upstream", async () => {
    await create("arunika");

    await expect(git(workspace.themeDir("arunika"), "push", "upstream", "main")).rejects.toThrow();
  }, TIMEOUT);

  it.each([
    ["a modified tracked file", async () => writeFile(path.join(workspace.boilerplateDir, "src/lib/a.ts"), "changed\n")],
    ["a new untracked file", async () => writeFile(path.join(workspace.boilerplateDir, "new-file.ts"), "x\n")],
  ])("refuses a dirty boilerplate with %s", async (_label, makeDirty) => {
    await makeDirty();

    await expect(create("arunika")).rejects.toThrow(/uncommitted/);
    expect(await exists(workspace.themeDir("arunika"))).toBe(false);
  }, TIMEOUT);

  it.each([
    ["a feature branch", ["checkout", "--quiet", "-b", "feature"]],
    ["a detached HEAD", ["checkout", "--quiet", "--detach"]],
  ])("refuses a boilerplate on %s", async (_label, checkoutArgs) => {
    await git(workspace.boilerplateDir, ...checkoutArgs);

    await expect(create("arunika")).rejects.toThrow(/main/);
    expect(await exists(workspace.themeDir("arunika"))).toBe(false);
  }, TIMEOUT);

  it("refuses an existing target", async () => {
    const themeDir = workspace.themeDir("arunika");
    await create("arunika");
    await writeFile(path.join(themeDir, "keep.txt"), "keep\n");

    await expect(create("arunika")).rejects.toThrow(/already exists/);
    expect(await readFile(path.join(themeDir, "keep.txt"), "utf8")).toBe("keep\n");
  }, TIMEOUT);

  it.each(["../keluar", "Arunika", "a/b"])("rejects the invalid name %s", async (themeName) => {
    await expect(create(themeName)).rejects.toThrow();
    expect(await exists(path.join(workspace.rootDir, "themes"))).toBe(false);
  }, TIMEOUT);

  it("rejects a wrong location", async () => {
    await create("arunika");

    await expect(create("other", workspace.themeDir("arunika"))).rejects.toThrow(/boilerplates/);
  }, TIMEOUT);

  it("cleans up when the theme config cannot be edited", async () => {
    await workspace.commitInBoilerplate({ "src/config/theme.ts": "export const themeConfig = {};\n" }, "fix: drop theme name");

    await expect(create("arunika")).rejects.toThrow();
    expect(await exists(workspace.themeDir("arunika"))).toBe(false);
  }, TIMEOUT);
});
