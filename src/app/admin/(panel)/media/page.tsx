import type { Metadata } from "next";
import { MediaPage } from "@/components/admin/pages/media-page";

export const metadata: Metadata = { title: "Media | Admin" };

export default function Page() {
  return <MediaPage />;
}
