import { describe, expect, it } from "vitest";
import { parseThemeArgs } from "../../../scripts/theme/theme-args";

describe("parseThemeArgs", () => {
  it("returns the single theme name", () => {
    expect(parseThemeArgs(["contoh"])).toBe("contoh");
  });

  it.each([[[]], [["kopi", "nusantara"]]])("rejects %j with the usage text", (args) => {
    expect(() => parseThemeArgs(args)).toThrow(/Usage: npm run theme:new -- <theme-name>/);
  });
});
