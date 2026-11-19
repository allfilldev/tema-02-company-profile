import { MarkReadButton } from "@/components/admin/messages/mark-read-button";
import { ConfirmDelete } from "@/components/admin/shared/confirm-delete";
import type { ContactMessage } from "@/core/domain/admin/records";
import type { AdminActionOutcome } from "@/lib/admin/form-state";
import { formatIndonesianDate } from "@/lib/text/format-date";

type MessageListProps = {
  messages: ContactMessage[];
  actions: {
    markRead: (id: string) => Promise<AdminActionOutcome>;
    remove: (id: string) => Promise<AdminActionOutcome>;
  };
};

const LINK_CLASS_NAME = "inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4";
const SAFE_EMAIL_PATTERN = /^[^@\s?&#%]+@[^@\s?&#%]+\.[^@\s?&#%]+$/;

export function MessageList({ messages, actions }: MessageListProps) {
  if (messages.length === 0) {
    return <p className="rounded-lg border border-border bg-background p-6 text-muted-foreground">Belum ada pesan masuk.</p>;
  }

  const newestFirst = [...messages].sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt));

  return (
    <ul className="flex flex-col gap-4">
      {newestFirst.map((message) => (
        <li key={message.id} className="flex flex-col gap-3 rounded-lg border border-border bg-background p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className={message.isRead ? "text-base font-normal text-foreground" : "text-base font-bold text-foreground"}>{message.name}</h2>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              {message.isRead ? null : <span className="font-bold text-foreground">Belum dibaca</span>}
              <time dateTime={message.createdAt}>{formatIndonesianDate(message.createdAt)}</time>
            </div>
          </div>
          <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {SAFE_EMAIL_PATTERN.test(message.email) ? (
              <a href={`mailto:${message.email}`} className={LINK_CLASS_NAME}>
                {message.email}
              </a>
            ) : (
              <span>{message.email}</span>
            )}
            {message.phone ? (
              <a href={`tel:${message.phone}`} className={LINK_CLASS_NAME}>
                {message.phone}
              </a>
            ) : null}
          </p>
          <p className="whitespace-pre-wrap text-foreground">{message.message}</p>
          <div className="flex flex-wrap items-start gap-2">
            {message.isRead ? null : <MarkReadButton action={actions.markRead.bind(null, message.id)} />}
            <ConfirmDelete itemName={`pesan dari ${message.name}`} action={actions.remove.bind(null, message.id)} />
          </div>
        </li>
      ))}
    </ul>
  );
}
