import type { Metadata } from "next";
import { ModuleNewPage } from "@/components/admin/pages/module-new-page";

export const metadata: Metadata = { title: "Tim | Admin" };

export default function Page() {
  return <ModuleNewPage module="team" />;
}
