import { MessageList } from "@/components/admin/messages/message-list";
import { PageHeader } from "@/components/admin/shared/page-header";
import { listMessages } from "@/core/application/admin/message-admin";
import { markMessageAsRead, removeMessage } from "@/server/actions/admin/messages";
import { getAdminDeps } from "@/server/admin/admin-deps";

export async function MessagesPage() {
  const deps = await getAdminDeps();
  const messages = await listMessages({ repository: deps.repos.messages });

  return (
    <section className="flex flex-col gap-6">
      <PageHeader title="Pesan masuk" />
      <MessageList messages={messages} actions={{ markRead: markMessageAsRead, remove: removeMessage }} />
    </section>
  );
}
