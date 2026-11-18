import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { LOCKED_PATHS, REVIEW_PATHS } from "../../scripts/theme/locked-paths";

const root = process.cwd();
const read = (file: string) => readFileSync(path.join(root, file), "utf8");

const themeGuide = read("THEME.md");
const updatingGuide = read("UPDATING.md");
const packageScripts = Object.keys(JSON.parse(read("package.json")).scripts as Record<string, string>);

function npmScriptsMentioned(text: string): string[] {
  return [...text.matchAll(/npm run ([a-z:-]+)/g)].map((match) => match[1]);
}

describe("theme guides", () => {
  it.each([...LOCKED_PATHS, ...REVIEW_PATHS])("THEME.md lists %s", (entry) => {
    expect(themeGuide).toContain(`\`${entry}\``);
  });

  it.each(["npm run theme:new", "npm run theme:check", "npm run favicon"])("THEME.md mentions %s", (command) => {
    expect(themeGuide).toContain(command);
  });

  it.each(["git fetch upstream", "git merge upstream/main", "npm run theme:check"])(
    "UPDATING.md mentions %s",
    (command) => {
      expect(updatingGuide).toContain(command);
    },
  );

  it.each(["tests/components/skeletons/skeletons.test.tsx", "tests/components/views/pages.test.tsx"])(
    "THEME.md names the design calibration test %s",
    (testFile) => {
      expect(themeGuide).toContain(`\`${testFile}\``);
    },
  );

  it("only mentions npm scripts that exist", () => {
    const mentioned = [...npmScriptsMentioned(themeGuide), ...npmScriptsMentioned(updatingGuide)];

    expect(mentioned.length).toBeGreaterThan(0);
    for (const script of mentioned) {
      expect(packageScripts).toContain(script);
    }
  });

  it("only references source and test paths that exist", () => {
    const reserved = new Set([...LOCKED_PATHS, ...REVIEW_PATHS]);
    const paths = [...themeGuide.matchAll(/`((?:src|tests)\/[^`\s<>]*)`/g)]
      .map((match) => match[1])
      .filter((reference) => !reserved.has(reference));

    expect(paths.length).toBeGreaterThan(0);
    for (const reference of paths) {
      expect(existsSync(path.join(root, reference)), reference).toBe(true);
    }
  });

  it("CLAUDE.md points to both guides", () => {
    const claude = read("CLAUDE.md");

    expect(claude).toContain("THEME.md");
    expect(claude).toContain("UPDATING.md");
  });
});
