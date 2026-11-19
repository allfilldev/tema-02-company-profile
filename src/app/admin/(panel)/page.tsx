import type { Metadata } from "next";
import { DashboardPage } from "@/components/admin/pages/dashboard-page";

export const metadata: Metadata = { title: "Dashboard | Admin" };

export default function Page() {
  return <DashboardPage />;
}
