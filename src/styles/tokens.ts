export const tokenValues = {
  primary: "#0f766e",
  "primary-foreground": "#ffffff",
  "primary-hover": "#115e59",
  secondary: "#e2e8f0",
  accent: "#ccfbf1",
  "accent-foreground": "#134e4a",
  background: "#f8fafc",
  surface: "#ffffff",
  "surface-muted": "#f1f5f9",
  foreground: "#0f172a",
  "muted-foreground": "#475569",
  border: "#cbd5e1",
  "border-strong": "#64748b",
  success: "#15803d",
  warning: "#b45309",
  danger: "#b91c1c",
  whatsapp: "#25d366",
  "surface-inverse": "#0b2f2c",
  "surface-inverse-foreground": "#f0fdfa",
  sidebar: "#0a2e2b",
  "sidebar-foreground": "#ccfbf1",
  "sidebar-active": "#0f766e",
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
