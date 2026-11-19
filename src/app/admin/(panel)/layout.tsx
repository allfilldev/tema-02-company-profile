import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { AdminShell } from "@/components/admin/layout/admin-shell";
import { themeConfig } from "@/config/theme";
import { buildAdminMenu } from "@/lib/admin/admin-menu";
import { requireAdmin } from "@/server/admin/admin-session";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

async function AdminGate({ children }: { children: ReactNode }) {
  const session = await requireAdmin();

  return (
    <AdminShell menu={buildAdminMenu(themeConfig.enabledModules)} adminEmail={session.email}>
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
