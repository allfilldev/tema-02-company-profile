import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { requireAdmin } from "@/server/admin/admin-session";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

async function AdminGate({ children }: { children: ReactNode }) {
  await requireAdmin();
  return <>{children}</>;
}

export default function AdminPanelLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<p className="p-6 text-muted-foreground">Memuat admin...</p>}>
      <AdminGate>{children}</AdminGate>
    </Suspense>
  );
}
