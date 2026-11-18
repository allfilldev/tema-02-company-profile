export const SECTION_KEYS = [
  "services",
  "portfolio",
  "team",
  "stats",
  "testimonials",
  "partners",
  "articles",
  "vision",
  "about",
  "contact",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];
