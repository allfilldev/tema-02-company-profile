import type { AdminMenuItem } from "@/lib/admin/admin-menu";
import { ADMIN_ROUTES } from "@/lib/site/routes";

export type AdminMenuGroup = {
  title: string;
  items: AdminMenuItem[];
};

const MAIN_HREFS: readonly string[] = [ADMIN_ROUTES.root];
const SYSTEM_HREFS: readonly string[] = [ADMIN_ROUTES.messages, ADMIN_ROUTES.media, ADMIN_ROUTES.settings];

export function filterAdminMenu(menu: AdminMenuItem[], query: string): AdminMenuItem[] {
  const needle = query.trim().toLowerCase();
  if (needle === "") {
    return menu;
  }
  return menu.filter((item) => item.label.toLowerCase().includes(needle));
}

export function groupAdminMenu(menu: AdminMenuItem[]): AdminMenuGroup[] {
  const groups: AdminMenuGroup[] = [
    { title: "MENU", items: menu.filter((item) => MAIN_HREFS.includes(item.href)) },
    { title: "KONTEN", items: menu.filter((item) => !MAIN_HREFS.includes(item.href) && !SYSTEM_HREFS.includes(item.href)) },
    { title: "SISTEM", items: menu.filter((item) => SYSTEM_HREFS.includes(item.href)) },
  ];
  return groups.filter((group) => group.items.length > 0);
}
