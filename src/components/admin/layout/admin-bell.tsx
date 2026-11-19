import { Bell } from "lucide-react";
import Link from "next/link";
import { ADMIN_ROUTES } from "@/lib/site/routes";

type AdminBellProps = {
  unreadMessages: number;
};

const MAX_VISIBLE_COUNT = 99;

export function AdminBell({ unreadMessages }: AdminBellProps) {
  const label = unreadMessages > 0 ? `Pesan masuk, ${unreadMessages} belum dibaca` : "Pesan masuk";
  const visibleCount = unreadMessages > MAX_VISIBLE_COUNT ? `${MAX_VISIBLE_COUNT}+` : String(unreadMessages);

  return (
    <Link
      href={ADMIN_ROUTES.messages}
      aria-label={label}
      className="relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
    >
      <Bell aria-hidden="true" className="size-5" />
      {unreadMessages > 0 ? (
        <span
          data-unread-badge=""
          aria-hidden="true"
          className="absolute right-0 top-0 inline-flex min-w-5 items-center justify-center rounded-full bg-danger px-1 text-xs font-bold leading-5 text-surface"
        >
          {visibleCount}
        </span>
      ) : null}
    </Link>
  );
}
