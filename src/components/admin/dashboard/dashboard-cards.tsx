import { TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";
import { MiniBars } from "@/components/admin/dashboard/mini-bars";
import { Sparkline } from "@/components/admin/dashboard/sparkline";
import type { DashboardCounts } from "@/core/application/admin/dashboard";
import { computeTrendPercent } from "@/core/application/admin/message-activity";
import type { AdminModule } from "@/core/domain/admin/records";
import { ADMIN_MODULE_LABELS } from "@/lib/admin/admin-menu";
import { ADMIN_MODULE_PATHS, ADMIN_ROUTES } from "@/lib/site/routes";
import { joinClassNames } from "@/lib/ui/class-names";

const CARD_CLASS_NAME = "flex h-full min-h-11 min-w-0 flex-col gap-1 rounded-2xl bg-surface p-4 shadow-soft transition-shadow hover:shadow-card-hover";
const MODULE_CARD_LIMIT = 3;
const LINE_TONES = ["text-primary", "text-highlight", "text-success"];

type DashboardCardsProps = {
  counts: DashboardCounts;
  moduleActivity?: Partial<Record<AdminModule, number[]>>;
  messageTrend?: number[];
};

function TrendPill({ percent }: { percent: number }) {
  if (percent === 0) {
    return <span className="rounded-full bg-surface-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">{`${percent}%`}</span>;
  }

  const rising = percent > 0;
  const Icon = rising ? TrendingUp : TrendingDown;

  return (
    <span className={joinClassNames("inline-flex items-center gap-1 text-xs font-medium", rising ? "text-success" : "text-danger")}>
      <span className={joinClassNames("rounded-full px-1.5 py-0.5", rising ? "bg-success/10" : "bg-danger/10")}>{`${percent}%`}</span>
      <Icon aria-hidden="true" className="size-4" />
    </span>
  );
}

export function DashboardCards({ counts, moduleActivity = {}, messageTrend = [] }: DashboardCardsProps) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {counts.modules.slice(0, MODULE_CARD_LIMIT).map((entry, index) => {
        const activity = moduleActivity[entry.module] ?? [];
        return (
          <li key={entry.module}>
            <Link href={ADMIN_MODULE_PATHS[entry.module]} className={CARD_CLASS_NAME}>
              <div className="flex items-baseline justify-between gap-2">
                <p className="truncate text-xs font-medium text-muted-foreground">{ADMIN_MODULE_LABELS[entry.module]}</p>
                {entry.published === null ? null : <span className="shrink-0 text-xs text-muted-foreground">{`${entry.published} terbit`}</span>}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-heading text-2xl font-semibold text-foreground">{entry.total}</span>
                <TrendPill percent={computeTrendPercent(activity)} />
              </div>
              <Sparkline values={activity} label={`Pembaruan ${ADMIN_MODULE_LABELS[entry.module]} 14 hari terakhir`} className={LINE_TONES[index % LINE_TONES.length]} />
            </Link>
          </li>
        );
      })}
      <li>
        <Link href={ADMIN_ROUTES.messages} className={CARD_CLASS_NAME}>
          <div className="flex items-baseline justify-between gap-2">
            <p className="truncate text-xs font-medium text-muted-foreground">Pesan masuk</p>
            <span className="shrink-0 text-xs text-muted-foreground">{`${counts.unreadMessages} belum dibaca`}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-heading text-2xl font-semibold text-foreground">{counts.unreadMessages}</span>
            <TrendPill percent={computeTrendPercent(messageTrend)} />
          </div>
          <MiniBars values={messageTrend} label="Pesan masuk 14 hari terakhir" />
        </Link>
      </li>
    </ul>
  );
}
