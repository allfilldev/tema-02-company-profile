import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { ogTheme, tokenValues } from "@/styles/tokens";

const SRC_DIR = join(process.cwd(), "src");
const TOKENS_CSS_PATH = join(SRC_DIR, "styles", "tokens.css");
const TOKENS_CSS = readFileSync(TOKENS_CSS_PATH, "utf8");
const GLOBALS_CSS = readFileSync(join(SRC_DIR, "app", "globals.css"), "utf8");
const FONTS_SOURCE = readFileSync(join(SRC_DIR, "styles", "fonts.ts"), "utf8");

const REQUIRED_COLOR_TOKENS = [
  "primary",
  "primary-foreground",
  "secondary",
  "accent",
  "background",
  "surface",
  "surface-muted",
  "foreground",
  "muted-foreground",
  "border",
  "success",
  "warning",
  "danger",
];

const SCAN_EXCLUDED_PATHS = ["styles/tokens.css", "styles/tokens.ts", "content/"];

const FORBIDDEN_PATTERNS: Array<{ name: string; pattern: RegExp }> = [
  { name: "hex color", pattern: /#[0-9a-fA-F]{3,8}\b/ },
  { name: "rgb color", pattern: /\brgba?\(/ },
  { name: "hsl color", pattern: /\bhsla?\(/ },
  { name: "tailwind arbitrary value", pattern: /\w-\[/ },
];

function parseColorTokens(css: string): Record<string, string> {
  const tokens: Record<string, string> = {};
  for (const match of css.matchAll(/--color-([a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{6})\s*;/g)) {
    tokens[match[1]] = match[2].toLowerCase();
  }
  return tokens;
}

function listScannedFiles(): string[] {
  return readdirSync(SRC_DIR, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name))
    .filter((path) => {
      const relativePath = relative(SRC_DIR, path).split("\\").join("/");
      return !SCAN_EXCLUDED_PATHS.some((excluded) => relativePath === excluded || relativePath.startsWith(excluded));
    })
    .filter((path) => /\.(ts|tsx|css)$/.test(path));
}

describe("design tokens", () => {
  const cssTokens = parseColorTokens(TOKENS_CSS);

  it("declares every required semantic color token", () => {
    for (const name of REQUIRED_COLOR_TOKENS) {
      expect(cssTokens, name).toHaveProperty(name);
    }
  });

  it("keeps tokens.css and tokenValues identical for every color token", () => {
    expect(Object.keys(cssTokens).sort()).toEqual(Object.keys(tokenValues).sort());
    for (const [name, value] of Object.entries(cssTokens)) {
      expect(tokenValues[name as keyof typeof tokenValues], name).toBe(value);
    }
  });

  it("derives the og theme from token values", () => {
    expect(ogTheme).toEqual({
      background: tokenValues.background,
      foreground: tokenValues.foreground,
      primary: tokenValues.primary,
    });
  });

  it("defines font, radius, shadow, and container tokens", () => {
    expect(TOKENS_CSS).toMatch(/--font-heading\s*:/);
    expect(TOKENS_CSS).toMatch(/--font-body\s*:/);
    expect(TOKENS_CSS).toMatch(/--radius-md\s*:/);
    expect(TOKENS_CSS).toMatch(/--shadow-card\s*:/);
    expect(TOKENS_CSS).toMatch(/--container-site\s*:/);
  });

  it("references the font variables that fonts.ts declares", () => {
    for (const variable of ["--font-heading-source", "--font-body-source"]) {
      expect(TOKENS_CSS).toContain(`var(${variable})`);
      expect(FONTS_SOURCE).toContain(`"${variable}"`);
    }
  });

  it("imports tokens.css from globals.css without a dark mode block", () => {
    expect(GLOBALS_CSS).toContain("tokens.css");
    expect(GLOBALS_CSS).not.toContain("prefers-color-scheme");
    expect(TOKENS_CSS).not.toContain("prefers-color-scheme");
  });
});

describe("token discipline", () => {
  it("scans the source tree", () => {
    expect(listScannedFiles().length).toBeGreaterThan(20);
  });

  it("has no raw colors or tailwind arbitrary values outside the token files", () => {
    const violations: string[] = [];
    for (const path of listScannedFiles()) {
      const lines = readFileSync(path, "utf8").split("\n");
      lines.forEach((line, index) => {
        for (const { name, pattern } of FORBIDDEN_PATTERNS) {
          if (pattern.test(line)) {
            violations.push(`${relative(SRC_DIR, path)}:${index + 1} ${name}: ${line.trim()}`);
          }
        }
      });
    }
    expect(violations).toEqual([]);
  });
});
