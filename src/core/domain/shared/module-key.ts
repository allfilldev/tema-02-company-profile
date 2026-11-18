export const MODULE_KEYS = [
  "services",
  "portfolio",
  "articles",
  "team",
  "stats",
  "testimonials",
  "partners",
  "vision",
] as const;

export type ModuleKey = (typeof MODULE_KEYS)[number];
