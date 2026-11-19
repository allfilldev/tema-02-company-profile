import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { AdminShell } from "@/components/admin/layout/admin-shell";
import { themeConfig } from "@/config/theme";
import { buildAdminMenu } from "@/lib/admin/admin-menu";
import { getAdminDeps } from "@/server/admin/admin-deps";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

async function AdminGate({ children }: { children: ReactNode }) {
  const deps = await getAdminDeps();
  const [unreadMessages, siteName] = await Promise.all([deps.repos.messages.countUnread(), deps.siteName()]);

  return (
    <AdminShell menu={buildAdminMenu(themeConfig.enabledModules)} adminEmail={deps.session.email} siteName={siteName} unreadMessages={unreadMessages}>
      {children}
    </AdminShell>
  );
}

export default function AdminPanelLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<p className="p-6 text-muted-foreground">Memuat admin...</p>}>
      <AdminGate>{children}</AdminGate>
    </Suspense>
  );
}
