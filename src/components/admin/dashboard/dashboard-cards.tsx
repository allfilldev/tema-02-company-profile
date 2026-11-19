import Link from "next/link";
import type { DashboardCounts } from "@/core/application/admin/dashboard";
import { ADMIN_MODULE_LABELS } from "@/lib/admin/admin-menu";
import { ADMIN_MODULE_PATHS, ADMIN_ROUTES } from "@/lib/site/routes";

const CARD_CLASS_NAME = "flex min-h-11 flex-col gap-1 rounded-lg border border-border bg-background p-4 hover:border-primary";

export function DashboardCards({ counts }: { counts: DashboardCounts }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {counts.modules.map((entry) => (
        <li key={entry.module}>
          <Link href={ADMIN_MODULE_PATHS[entry.module]} className={CARD_CLASS_NAME}>
            <h2 className="text-base font-semibold text-foreground">{ADMIN_MODULE_LABELS[entry.module]}</h2>
            <span className="font-heading text-3xl font-bold text-foreground">{entry.total}</span>
            {entry.published === null ? null : <span className="text-sm text-muted-foreground">{`${entry.published} terbit`}</span>}
          </Link>
        </li>
      ))}
      <li>
        <Link href={ADMIN_ROUTES.messages} className={CARD_CLASS_NAME}>
          <h2 className="text-base font-semibold text-foreground">Pesan masuk</h2>
          <span className="font-heading text-3xl font-bold text-foreground">{counts.unreadMessages}</span>
          <span className="text-sm text-muted-foreground">{`${counts.unreadMessages} belum dibaca`}</span>
        </Link>
      </li>
    </ul>
  );
}
