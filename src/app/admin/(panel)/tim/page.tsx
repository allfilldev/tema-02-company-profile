import type { Metadata } from "next";
import { ModuleListPage } from "@/components/admin/pages/module-list-page";

export const metadata: Metadata = { title: "Tim | Admin" };

export default function Page() {
  return <ModuleListPage module="team" />;
}
