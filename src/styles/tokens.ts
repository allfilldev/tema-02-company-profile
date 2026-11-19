export const tokenValues = {
  primary: "#1172cb",
  "primary-foreground": "#ffffff",
  "primary-hover": "#0b5fae",
  "primary-soft": "#dcebfa",
  highlight: "#f9a825",
  "highlight-foreground": "#0a1a3a",
  "highlight-hover": "#e8920c",
  "highlight-soft": "#fff1d6",
  secondary: "#e3ebf5",
  accent: "#e1eefc",
  "accent-foreground": "#0b4a8a",
  background: "#f7f9fd",
  surface: "#ffffff",
  "surface-muted": "#eaf0f8",
  foreground: "#0a1a3a",
  "muted-foreground": "#52627c",
  border: "#d5deea",
  "border-strong": "#6b7a90",
  success: "#15803d",
  warning: "#b45309",
  danger: "#b91c1c",
  whatsapp: "#25d366",
  brand: "#0f766e",
  "brand-foreground": "#ffffff",
  "surface-inverse": "#0a1a3a",
  "surface-inverse-foreground": "#ffffff",
  sidebar: "#0c1e42",
  "sidebar-foreground": "#d6e4f5",
  "sidebar-active": "#1d4a82",
} as const;

export type OgTheme = {
  background: string;
  foreground: string;
  primary: string;
};

export const ogTheme: OgTheme = {
  background: tokenValues.background,
  foreground: tokenValues.foreground,
  primary: tokenValues.primary,
};
