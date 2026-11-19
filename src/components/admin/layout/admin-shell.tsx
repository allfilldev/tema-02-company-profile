import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AdminMobileMenu } from "@/components/admin/layout/admin-mobile-menu";
import { AdminNav } from "@/components/admin/layout/admin-nav";
import type { AdminMenuItem } from "@/lib/admin/admin-menu";
import { signOut } from "@/server/actions/admin/auth";

type AdminShellProps = {
  menu: AdminMenuItem[];
  adminEmail: string;
  children: ReactNode;
};

export function AdminShell({ menu, adminEmail, children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-surface-muted lg:flex">
      <aside className="hidden border-r border-border bg-background p-4 lg:block lg:w-64 lg:shrink-0">
        <p className="px-3 pb-4 font-heading text-lg font-bold text-foreground">Admin</p>
        <AdminNav menu={menu} />
        <Link href="/" target="_blank" rel="noopener noreferrer" className="mt-6 flex min-h-11 items-center px-3 text-sm font-medium text-primary underline underline-offset-4">
          Lihat situs
        </Link>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="relative flex items-center justify-between gap-3 border-b border-border bg-background px-4 py-3 lg:justify-end">
          <AdminMobileMenu menu={menu} />
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">{adminEmail}</span>
            <form action={signOut}>
              <Button type="submit" variant="secondary">
                Keluar
              </Button>
            </form>
          </div>
        </header>
        <main id="konten-admin" className="flex-1 px-4 py-6 md:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
