const THEME_NAME_LINE = /^(\s*themeName:\s*)"[^"\n]*"(,?)$/gm;

export function setThemeName(source: string, themeName: string): string {
  const matches = source.match(THEME_NAME_LINE) ?? [];

  if (matches.length !== 1) {
    throw new Error(`Expected exactly one themeName line in the theme config, found ${matches.length}.`);
  }

  return source.replace(THEME_NAME_LINE, (_line, prefix: string, trailing: string) => `${prefix}"${themeName}"${trailing}`);
}
