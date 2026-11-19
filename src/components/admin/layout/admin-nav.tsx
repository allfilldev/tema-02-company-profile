"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isMenuItemActive, type AdminMenuItem } from "@/lib/admin/admin-menu";
import { joinClassNames } from "@/lib/ui/class-names";

type AdminNavProps = {
  menu: AdminMenuItem[];
  onNavigate?: () => void;
};

const LINK_CLASS_NAME = "flex min-h-11 items-center rounded-md px-3 text-base font-medium transition-colors";
const ACTIVE_CLASS_NAME = "bg-primary text-primary-foreground";
const IDLE_CLASS_NAME = "text-foreground hover:bg-accent hover:text-accent-foreground";

export function AdminNav({ menu, onNavigate }: AdminNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Menu admin">
      <ul className="flex flex-col gap-1">
        {menu.map((item) => {
          const active = isMenuItemActive(item, pathname);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={onNavigate}
                className={joinClassNames(LINK_CLASS_NAME, active ? ACTIVE_CLASS_NAME : IDLE_CLASS_NAME)}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
