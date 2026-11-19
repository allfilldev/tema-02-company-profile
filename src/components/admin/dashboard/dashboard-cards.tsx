import Link from "next/link";
import { Sparkline } from "@/components/admin/dashboard/sparkline";
import type { DashboardCounts } from "@/core/application/admin/dashboard";
import type { AdminModule } from "@/core/domain/admin/records";
import { ADMIN_MODULE_LABELS } from "@/lib/admin/admin-menu";
import { ADMIN_MODULE_PATHS, ADMIN_ROUTES } from "@/lib/site/routes";

const CARD_CLASS_NAME = "flex h-full min-h-11 min-w-0 flex-col gap-2 rounded-2xl bg-surface p-5 shadow-soft transition-shadow hover:shadow-card-hover";

type DashboardCardsProps = {
  counts: DashboardCounts;
  moduleActivity?: Partial<Record<AdminModule, number[]>>;
  messageTrend?: number[];
};

export function DashboardCards({ counts, moduleActivity = {}, messageTrend = [] }: DashboardCardsProps) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {counts.modules.map((entry) => (
        <li key={entry.module}>
          <Link href={ADMIN_MODULE_PATHS[entry.module]} className={CARD_CLASS_NAME}>
            <h2 className="truncate text-sm font-semibold text-muted-foreground">{ADMIN_MODULE_LABELS[entry.module]}</h2>
            <span className="font-heading text-3xl font-bold text-foreground">{entry.total}</span>
            {entry.published === null ? null : <span className="text-sm text-muted-foreground">{`${entry.published} terbit`}</span>}
            <Sparkline values={moduleActivity[entry.module] ?? []} label={`Pembaruan ${ADMIN_MODULE_LABELS[entry.module]} 14 hari terakhir`} />
          </Link>
        </li>
      ))}
      <li>
        <Link href={ADMIN_ROUTES.messages} className={CARD_CLASS_NAME}>
          <h2 className="truncate text-sm font-semibold text-muted-foreground">Pesan masuk</h2>
          <span className="font-heading text-3xl font-bold text-foreground">{counts.unreadMessages}</span>
          <span className="text-sm text-muted-foreground">{`${counts.unreadMessages} belum dibaca`}</span>
          <Sparkline values={messageTrend} label="Pesan masuk 14 hari terakhir" className="text-warning" />
        </Link>
      </li>
    </ul>
  );
}
