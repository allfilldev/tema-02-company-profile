import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AdminAccountMenu } from "@/components/admin/layout/admin-account-menu";
import { AdminBell } from "@/components/admin/layout/admin-bell";
import { AdminFullscreenToggle } from "@/components/admin/layout/admin-fullscreen-toggle";
import { AdminMobileMenu } from "@/components/admin/layout/admin-mobile-menu";
import { AdminNav } from "@/components/admin/layout/admin-nav";
import { AdminSearch } from "@/components/admin/layout/admin-search";
import type { AdminMenuItem } from "@/lib/admin/admin-menu";
import { signOut } from "@/server/actions/admin/auth";

type AdminShellProps = {
  menu: AdminMenuItem[];
  adminEmail: string;
  unreadMessages?: number;
  children: ReactNode;
};

export function AdminShell({ menu, adminEmail, unreadMessages = 0, children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-surface-muted lg:flex">
      <aside className="hidden bg-sidebar p-4 text-sidebar-foreground lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:gap-6 lg:overflow-y-auto">
        <p className="px-3 pt-2 font-heading text-xl font-bold text-surface-inverse-foreground">Admin</p>
        <div className="flex-1">
          <AdminNav menu={menu} />
        </div>
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 items-center rounded-xl px-3 text-sm font-medium text-sidebar-foreground underline underline-offset-4 transition-colors hover:bg-sidebar-active/40 hover:text-surface-inverse-foreground"
        >
          Lihat situs
        </Link>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-border bg-surface px-4 py-3 md:gap-3 md:px-8">
          <AdminMobileMenu menu={menu} />
          <AdminSearch menu={menu} />
          <div className="ml-auto flex shrink-0 items-center gap-1">
            <AdminFullscreenToggle />
            <AdminBell unreadMessages={unreadMessages} />
            <AdminAccountMenu email={adminEmail}>
              <form action={signOut}>
                <Button type="submit" variant="secondary" className="w-full">
                  Keluar
                </Button>
              </form>
            </AdminAccountMenu>
          </div>
        </header>
        <main id="konten-admin" className="min-w-0 flex-1 px-4 py-6 md:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
