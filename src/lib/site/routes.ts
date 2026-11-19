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
} as const;

export function isUnderRoute(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}
