export const ICON_NAMES = [
  "search",
  "clipboard-list",
  "users",
  "chart-line",
  "map-pin",
  "message-circle",
  "layers",
  "shield-check",
  "mail",
  "phone",
  "clock",
  "star",
  "check",
  "target",
  "lightbulb",
  "briefcase",
  "award",
  "building",
  "globe",
  "heart",
  "rocket",
  "settings",
  "trending-up",
  "handshake",
  "book-open",
  "file-text",
  "graduation-cap",
  "eye",
  "compass",
  "badge-check",
  "zap",
  "arrow-right",
] as const;

export type IconName = (typeof ICON_NAMES)[number];

const KNOWN_ICON_NAMES: ReadonlySet<string> = new Set(ICON_NAMES);

export function isKnownIconName(name: string): name is IconName {
  return KNOWN_ICON_NAMES.has(name);
}
