import type { AdminModule } from "@/core/domain/admin/records";
import { visibleAdminModules } from "@/core/application/admin/visible-modules";
import type { ModuleKey } from "@/core/domain/shared/module-key";
import { ADMIN_MODULE_PATHS, ADMIN_ROUTES } from "@/lib/site/routes";

export type AdminMenuItem = {
  label: string;
  href: string;
};

export const ADMIN_MODULE_LABELS: Record<AdminModule, string> = {
  services: "Layanan",
  portfolio: "Portofolio",
  team: "Tim",
  stats: "Statistik",
  testimonials: "Testimoni",
  partners: "Partner",
  articles: "Artikel",
};

export function buildAdminMenu(enabledModules: readonly ModuleKey[]): AdminMenuItem[] {
  return [
    { label: "Dashboard", href: ADMIN_ROUTES.root },
    ...visibleAdminModules(enabledModules).map((module) => ({ label: ADMIN_MODULE_LABELS[module], href: ADMIN_MODULE_PATHS[module] })),
    { label: "Pesan masuk", href: ADMIN_ROUTES.messages },
    { label: "Media", href: ADMIN_ROUTES.media },
    { label: "Pengaturan situs", href: ADMIN_ROUTES.settings },
  ];
}

export function isMenuItemActive(item: AdminMenuItem, pathname: string): boolean {
  if (item.href === ADMIN_ROUTES.root) {
    return pathname === ADMIN_ROUTES.root;
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
