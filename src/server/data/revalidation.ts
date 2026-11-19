import "server-only";
import { updateTag } from "next/cache";
import { tagsForAdminChange, type AdminChange } from "@/server/data/revalidation-tags";

export function revalidateAdminChange(change: AdminChange): void {
  for (const tag of tagsForAdminChange(change)) {
    updateTag(tag);
  }
}
