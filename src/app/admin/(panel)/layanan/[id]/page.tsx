import type { Metadata } from "next";
import { ModuleEditPage } from "@/components/admin/pages/module-edit-page";

export const metadata: Metadata = { title: "Layanan | Admin" };

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <ModuleEditPage module="services" params={params} />;
}
