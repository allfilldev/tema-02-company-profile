import type { Metadata } from "next";
import { MessagesPage } from "@/components/admin/pages/messages-page";

export const metadata: Metadata = { title: "Pesan masuk | Admin" };

export default function Page() {
  return <MessagesPage />;
}
