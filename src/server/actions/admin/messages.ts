"use server";

import { revalidatePath } from "next/cache";
import type { AdminActionOutcome } from "@/lib/admin/form-state";
import { deleteMessage, markMessageRead } from "@/core/application/admin/message-admin";
import { ADMIN_ROUTES } from "@/lib/site/routes";
import { getAdminDeps } from "@/server/admin/admin-deps";

const FAILED_MESSAGE = "Gagal memproses permintaan. Coba lagi.";
const DELETE_FAILED_MESSAGE = "Gagal menghapus. Coba lagi.";

export async function markMessageAsRead(id: string): Promise<AdminActionOutcome> {
  const deps = await getAdminDeps();

  try {
    await markMessageRead({ repository: deps.repos.messages }, id);
    revalidatePath(ADMIN_ROUTES.messages);
    return { ok: true };
  } catch (error) {
    console.error(`Marking a message read failed: ${error instanceof Error ? error.message : String(error)}`);
    return { ok: false, message: FAILED_MESSAGE };
  }
}

export async function removeMessage(id: string): Promise<AdminActionOutcome> {
  const deps = await getAdminDeps();

  try {
    await deleteMessage({ repository: deps.repos.messages }, id);
    revalidatePath(ADMIN_ROUTES.messages);
    return { ok: true };
  } catch (error) {
    console.error(`Deleting a message failed: ${error instanceof Error ? error.message : String(error)}`);
    return { ok: false, message: DELETE_FAILED_MESSAGE };
  }
}
