import type { ThemeConfig } from "@/core/domain/theme/theme-config";

export const themeConfig: ThemeConfig = {
  themeName: "Company Profile Default",
  contentPack: "general",
  enabledModules: ["services", "portfolio", "articles", "team", "stats", "testimonials", "partners", "vision"],
  contentBlocks: [
    { key: "how-we-work", label: "Cara kami bekerja", itemFields: ["title", "description", "icon"], minItems: 3, maxItems: 6 },
    { key: "why-choose-us", label: "Keunggulan", itemFields: ["title", "description", "icon"], minItems: 3, maxItems: 6 },
    { key: "home-faq", label: "FAQ beranda", itemFields: ["title", "description"], minItems: 3, maxItems: 6 },
    { key: "cta-banner", label: "Banner ajakan", itemFields: ["link"], minItems: 1, maxItems: 2 },
  ],
};
