import Link from "next/link";
import { AdminCard } from "@/components/admin/shared/admin-card";
import type { ContactMessage } from "@/core/domain/admin/records";
import { ADMIN_ROUTES } from "@/lib/site/routes";
import { formatIndonesianDate } from "@/lib/text/format-date";

const RECENT_LIMIT = 5;

export function RecentMessagesTable({ messages }: { messages: ContactMessage[] }) {
  const recent = [...messages].sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt)).slice(0, RECENT_LIMIT);

  return (
    <AdminCard className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-heading text-lg font-semibold text-foreground">Pesan terbaru</h2>
        <Link href={ADMIN_ROUTES.messages} className="inline-flex min-h-11 items-center font-semibold text-primary hover:text-primary-hover">
          Lihat semua
        </Link>
      </div>
      {recent.length === 0 ? (
        <p className="text-muted-foreground">Belum ada pesan masuk.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th scope="col" className="py-2 pr-4 font-semibold">Pengirim</th>
                <th scope="col" className="hidden py-2 pr-4 font-semibold sm:table-cell">Pesan</th>
                <th scope="col" className="py-2 pr-4 font-semibold">Tanggal</th>
                <th scope="col" className="py-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((message) => (
                <tr key={message.id} className="border-t border-border">
                  <td className="max-w-40 truncate py-3 pr-4 font-semibold text-foreground">{message.name}</td>
                  <td className="hidden max-w-xs truncate py-3 pr-4 text-muted-foreground sm:table-cell">{message.message}</td>
                  <td className="whitespace-nowrap py-3 pr-4 text-muted-foreground">
                    <time dateTime={message.createdAt}>{formatIndonesianDate(message.createdAt)}</time>
                  </td>
                  <td className="whitespace-nowrap py-3">
                    {message.isRead ? <span className="text-muted-foreground">Dibaca</span> : <span className="rounded-full bg-accent px-2 py-1 text-xs font-bold text-accent-foreground">Belum dibaca</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminCard>
  );
}
