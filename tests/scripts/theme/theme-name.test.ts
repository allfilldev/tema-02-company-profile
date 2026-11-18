import { describe, expect, it } from "vitest";
import { THEME_NAME_MAX_LENGTH, validateThemeName } from "../../../scripts/theme/theme-name";

describe("validateThemeName", () => {
  it.each(["arunika", "kopi-nusantara", "a1", "tema-2", "x".repeat(THEME_NAME_MAX_LENGTH)])(
    "accepts %s",
    (name) => {
      expect(validateThemeName(name)).toBeNull();
    },
  );

  it.each([
    "",
    "Arunika",
    "kopi nusantara",
    "-arunika",
    "arunika-",
    "kopi--nusantara",
    "../keluar",
    "a/b",
    "1tema",
    ".tersembunyi",
    "x".repeat(THEME_NAME_MAX_LENGTH + 1),
  ])("rejects %j", (name) => {
    const message = validateThemeName(name);
    expect(typeof message).toBe("string");
    expect(message).not.toBe("");
  });
});
