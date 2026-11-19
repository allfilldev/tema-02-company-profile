"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { iconForAdminHref } from "@/components/admin/layout/admin-nav-icons";
import { isMenuItemActive, type AdminMenuItem } from "@/lib/admin/admin-menu";
import { groupAdminMenu } from "@/lib/admin/admin-menu-groups";
import { joinClassNames } from "@/lib/ui/class-names";
import { ADMIN_ROUTES } from "@/lib/site/routes";

type AdminNavProps = {
  menu: AdminMenuItem[];
  onNavigate?: () => void;
};

const ROW_CLASS_NAME = "flex min-h-11 min-w-0 flex-1 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors";
const ACTIVE_CLASS_NAME = "bg-sidebar-active text-surface-inverse-foreground";
const IDLE_CLASS_NAME = "text-sidebar-foreground hover:bg-sidebar-active/40 hover:text-surface-inverse-foreground";
const SUBMENU_ID = "admin-nav-dashboard-submenu";

function DashboardItem({ item, pathname, onNavigate }: { item: AdminMenuItem; pathname: string; onNavigate?: () => void }) {
  const [open, setOpen] = useState(true);
  const Icon = iconForAdminHref(item.href);
  const active = isMenuItemActive(item, pathname);

  return (
    <li>
      <div className="flex items-center gap-1">
        <Link href={item.href} onClick={onNavigate} className={joinClassNames(ROW_CLASS_NAME, active ? "text-surface-inverse-foreground" : IDLE_CLASS_NAME)}>
          <Icon aria-hidden="true" className="size-5 shrink-0" />
          <span className="min-w-0 truncate">{item.label}</span>
        </Link>
        <button
          type="button"
          aria-label={open ? "Tutup submenu Dashboard" : "Buka submenu Dashboard"}
          aria-expanded={open}
          aria-controls={SUBMENU_ID}
          onClick={() => setOpen((current) => !current)}
          className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl text-sidebar-foreground transition-colors hover:bg-sidebar-active/40 hover:text-surface-inverse-foreground"
        >
          <ChevronDown aria-hidden="true" className={joinClassNames("size-4 transition-transform", open ? "" : "-rotate-90")} />
        </button>
      </div>
      <ul id={SUBMENU_ID} hidden={!open} className="mt-1 flex flex-col gap-1 pl-4">
        <li>
          <Link
            href={ADMIN_ROUTES.root}
            aria-current={active ? "page" : undefined}
            onClick={onNavigate}
            className={joinClassNames("flex min-h-11 items-center rounded-xl px-4 text-sm font-medium transition-colors", active ? ACTIVE_CLASS_NAME : IDLE_CLASS_NAME)}
          >
            <span className="min-w-0 truncate">Ringkasan</span>
          </Link>
        </li>
      </ul>
    </li>
  );
}

export function AdminNav({ menu, onNavigate }: AdminNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Menu admin" className="flex flex-col gap-5">
      {groupAdminMenu(menu).map((group) => (
        <div key={group.title}>
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground opacity-70">{group.title}</p>
          <ul className="flex flex-col gap-1">
            {group.items.map((item) => {
              if (item.href === ADMIN_ROUTES.root) {
                return <DashboardItem key={item.href} item={item} pathname={pathname} onNavigate={onNavigate} />;
              }
              const active = isMenuItemActive(item, pathname);
              const Icon = iconForAdminHref(item.href);
              return (
                <li key={item.href} className="flex">
                  <Link href={item.href} aria-current={active ? "page" : undefined} onClick={onNavigate} className={joinClassNames(ROW_CLASS_NAME, active ? ACTIVE_CLASS_NAME : IDLE_CLASS_NAME)}>
                    <Icon aria-hidden="true" className="size-5 shrink-0" />
                    <span className="min-w-0 truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
