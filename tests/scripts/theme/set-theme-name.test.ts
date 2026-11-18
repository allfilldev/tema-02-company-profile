import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { setThemeName } from "../../../scripts/theme/set-theme-name";

const themeSource = readFileSync(path.join(process.cwd(), "src/config/theme.ts"), "utf8");

describe("setThemeName", () => {
  it("replaces only the themeName value", () => {
    const result = setThemeName(themeSource, "arunika");

    expect(result).toContain('themeName: "arunika",');
    const before = themeSource.split("\n");
    const after = result.split("\n");
    expect(after).toHaveLength(before.length);
    const changedLines = after.filter((line, index) => line !== before[index]);
    expect(changedLines).toEqual(['  themeName: "arunika",']);
  });

  it("throws when no themeName line exists", () => {
    expect(() => setThemeName("export const themeConfig = {};\n", "arunika")).toThrow();
  });

  it("throws when themeName appears twice", () => {
    const duplicated = `${themeSource}\n  themeName: "other",\n`;
    expect(() => setThemeName(duplicated, "arunika")).toThrow();
  });
});
