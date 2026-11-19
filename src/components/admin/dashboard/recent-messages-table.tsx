import { Inbox } from "lucide-react";
import Link from "next/link";
import { AdminPanel } from "@/components/admin/shared/admin-panel";
import type { ContactMessage } from "@/core/domain/admin/records";
import { ADMIN_ROUTES } from "@/lib/site/routes";
import { formatIndonesianDate } from "@/lib/text/format-date";

const RECENT_LIMIT = 5;

export function RecentMessagesTable({ messages }: { messages: ContactMessage[] }) {
  const recent = [...messages].sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt)).slice(0, RECENT_LIMIT);

  return (
    <AdminPanel
      icon={Inbox}
      title="Pesan terbaru"
      bodyClassName="p-0"
      action={
        <Link href={ADMIN_ROUTES.messages} className="inline-flex min-h-11 items-center text-xs font-semibold text-primary hover:text-primary-hover">
          Lihat semua
        </Link>
      }
    >
      {recent.length === 0 ? (
        <p className="p-5 text-sm text-muted-foreground">Belum ada pesan masuk.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="bg-surface-muted text-foreground">
              <tr>
                <th scope="col" className="px-5 py-2.5 font-semibold">Pengirim</th>
                <th scope="col" className="hidden px-2 py-2.5 font-semibold sm:table-cell">Pesan</th>
                <th scope="col" className="px-2 py-2.5 font-semibold">Tanggal</th>
                <th scope="col" className="py-2.5 pl-2 pr-5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((message) => (
                <tr key={message.id} className="border-t border-secondary">
                  <td className="max-w-32 truncate px-5 py-3 font-medium text-foreground">{message.name}</td>
                  <td className="hidden max-w-40 truncate px-2 py-3 text-muted-foreground sm:table-cell">{message.message}</td>
                  <td className="whitespace-nowrap px-2 py-3 text-muted-foreground">
                    <time dateTime={message.createdAt}>{formatIndonesianDate(message.createdAt)}</time>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-2 pr-5">
                    {message.isRead ? <span className="text-muted-foreground">Dibaca</span> : <span className="rounded-full bg-accent px-2 py-1 text-xs font-bold text-accent-foreground">Belum dibaca</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminPanel>
  );
}
