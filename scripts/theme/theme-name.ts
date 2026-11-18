export const THEME_NAME_MAX_LENGTH = 40;

const THEME_NAME_PATTERN = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

export function validateThemeName(name: string): string | null {
  if (name.length === 0) {
    return "Theme name is required.";
  }

  if (name.length > THEME_NAME_MAX_LENGTH) {
    return `Theme name must be at most ${THEME_NAME_MAX_LENGTH} characters.`;
  }

  if (!THEME_NAME_PATTERN.test(name)) {
    return "Theme name must use lowercase letters, digits, and single hyphens, and start with a letter.";
  }

  return null;
}
