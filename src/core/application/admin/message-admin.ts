import type { MessageAdminRepository } from "@/core/domain/admin/admin-repositories";
import type { ContactMessage } from "@/core/domain/admin/records";

export function listMessages(deps: { repository: MessageAdminRepository }): Promise<ContactMessage[]> {
  return deps.repository.list();
}

export function markMessageRead(deps: { repository: MessageAdminRepository }, id: string): Promise<void> {
  return deps.repository.markRead(id);
}

export function deleteMessage(deps: { repository: MessageAdminRepository }, id: string): Promise<void> {
  return deps.repository.remove(id);
}
