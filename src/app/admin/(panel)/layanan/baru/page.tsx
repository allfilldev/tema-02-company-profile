import type { Metadata } from "next";
import { ModuleNewPage } from "@/components/admin/pages/module-new-page";

export const metadata: Metadata = { title: "Layanan | Admin" };

export default function Page() {
  return <ModuleNewPage module="services" />;
}
