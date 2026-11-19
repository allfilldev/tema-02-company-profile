import type { Metadata } from "next";
import { SettingsPage } from "@/components/admin/pages/settings-page";

export const metadata: Metadata = { title: "Pengaturan situs | Admin" };

export default function Page() {
  return <SettingsPage />;
}
