import type { AdminModule } from "@/core/domain/admin/records";

export const SITE_ROUTES = {
  home: "/",
  about: "/tentang",
  services: "/layanan",
  portfolio: "/portofolio",
  articles: "/artikel",
  articlePages: "/artikel/halaman",
  contact: "/kontak",
} as const;

export const ADMIN_ROUTES = {
  root: "/admin",
  login: "/admin/login",
  media: "/admin/media",
  messages: "/admin/pesan",
  settings: "/admin/pengaturan",
} as const;

export const ADMIN_MODULE_PATHS: Record<AdminModule, string> = {
  services: "/admin/layanan",
  portfolio: "/admin/portofolio",
  team: "/admin/tim",
  stats: "/admin/statistik",
  testimonials: "/admin/testimoni",
  partners: "/admin/partner",
  articles: "/admin/artikel",
};

export function isUnderRoute(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}
