import { ExternalLink } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/ui/brand-logo";
import { AdminAccountMenu } from "@/components/admin/layout/admin-account-menu";
import { AdminBell } from "@/components/admin/layout/admin-bell";
import { AdminFrame } from "@/components/admin/layout/admin-frame";
import { AdminFullscreenToggle } from "@/components/admin/layout/admin-fullscreen-toggle";
import { AdminMobileMenu } from "@/components/admin/layout/admin-mobile-menu";
import { AdminNav } from "@/components/admin/layout/admin-nav";
import { AdminSearch } from "@/components/admin/layout/admin-search";
import type { MediaAsset } from "@/core/domain/shared/media-asset";
import type { AdminMenuItem } from "@/lib/admin/admin-menu";
import { ADMIN_ROUTES } from "@/lib/site/routes";
import { signOut } from "@/server/actions/admin/auth";

type AdminShellProps = {
  menu: AdminMenuItem[];
  adminEmail: string;
  siteName?: string;
  siteLogo?: MediaAsset | null;
  unreadMessages?: number;
  children: ReactNode;
};

const DEFAULT_SITE_NAME = "Admin";

export function AdminShell({ menu, adminEmail, siteName = DEFAULT_SITE_NAME, siteLogo = null, unreadMessages = 0, children }: AdminShellProps) {
  return (
    <AdminFrame
      sidebar={
        <>
          <div className="px-4 py-4">
            <BrandLogo tone="on-dark" name={siteName} logo={siteLogo} href={ADMIN_ROUTES.root} className="max-w-full [&>span:last-child]:truncate" />
          </div>
          <div className="flex-1 px-3 pb-4">
            <AdminNav menu={menu} />
          </div>
          <div className="px-3 pb-4">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-active/40 hover:text-surface-inverse-foreground"
            >
              <ExternalLink aria-hidden="true" className="size-5 shrink-0" />
              Lihat situs
            </Link>
          </div>
        </>
      }
      mobileMenu={<AdminMobileMenu menu={menu} siteName={siteName} siteLogo={siteLogo} />}
      search={<AdminSearch menu={menu} />}
      actions={
        <>
          <AdminFullscreenToggle />
          <AdminBell unreadMessages={unreadMessages} />
          <AdminAccountMenu email={adminEmail}>
            <form action={signOut}>
              <Button type="submit" variant="secondary" className="w-full">
                Keluar
              </Button>
            </form>
          </AdminAccountMenu>
        </>
      }
    >
      {children}
    </AdminFrame>
  );
}
