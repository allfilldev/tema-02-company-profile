"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isMenuItemActive, type AdminMenuItem } from "@/lib/admin/admin-menu";
import { groupAdminMenu } from "@/lib/admin/admin-menu-groups";
import { joinClassNames } from "@/lib/ui/class-names";

type AdminNavProps = {
  menu: AdminMenuItem[];
  onNavigate?: () => void;
};

const LINK_CLASS_NAME = "flex min-h-11 items-center rounded-xl px-3 text-base font-medium transition-colors";
const ACTIVE_CLASS_NAME = "bg-sidebar-active text-surface-inverse-foreground";
const IDLE_CLASS_NAME = "text-sidebar-foreground hover:bg-sidebar-active/40 hover:text-surface-inverse-foreground";

export function AdminNav({ menu, onNavigate }: AdminNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Menu admin" className="flex flex-col gap-6">
      {groupAdminMenu(menu).map((group) => (
        <div key={group.title}>
          <p className="px-3 pb-2 text-xs font-semibold tracking-wider text-sidebar-foreground opacity-80">{group.title}</p>
          <ul className="flex flex-col gap-1">
            {group.items.map((item) => {
              const active = isMenuItemActive(item, pathname);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={onNavigate}
                    className={joinClassNames(LINK_CLASS_NAME, active ? ACTIVE_CLASS_NAME : IDLE_CLASS_NAME)}
                  >
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
