import { Mail } from "lucide-react";
import { BarChart } from "@/components/admin/dashboard/bar-chart";
import { DashboardCards } from "@/components/admin/dashboard/dashboard-cards";
import { MessageHeatmap } from "@/components/admin/dashboard/message-heatmap";
import { ModuleProgressTable } from "@/components/admin/dashboard/module-progress-table";
import { RecentMessagesTable } from "@/components/admin/dashboard/recent-messages-table";
import { AdminPanel } from "@/components/admin/shared/admin-panel";
import { PageHeader } from "@/components/admin/shared/page-header";
import type { DashboardCounts } from "@/core/application/admin/dashboard";
import type { DailyActivity } from "@/core/application/admin/message-activity";
import type { AdminModule, ContactMessage } from "@/core/domain/admin/records";

const CHART_DAY_FORMAT = new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", day: "numeric", month: "short" });

type DashboardViewProps = {
  counts: DashboardCounts;
  moduleActivity: Partial<Record<AdminModule, number[]>>;
  messageActivity: DailyActivity[];
  heatmap: number[][];
  messages: ContactMessage[];
};

export function DashboardView({ counts, moduleActivity, messageActivity, heatmap, messages }: DashboardViewProps) {
  const chartData = messageActivity.map((day) => ({ label: CHART_DAY_FORMAT.format(Date.parse(`${day.date}T12:00:00+07:00`)), value: day.count }));

  return (
    <section className="flex flex-col gap-4">
      <PageHeader title="Dashboard" showBreadcrumb={false} />
      <DashboardCards counts={counts} moduleActivity={moduleActivity} messageTrend={messageActivity.map((day) => day.count)} />
      <div className="grid gap-4 lg:grid-cols-3">
        <AdminPanel icon={Mail} title="Pesan masuk" className="lg:col-span-2">
          <BarChart data={chartData} axisTitle="Jumlah pesan" label="Grafik batang jumlah pesan masuk per hari selama 14 hari terakhir" />
        </AdminPanel>
        <ModuleProgressTable modules={counts.modules} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <MessageHeatmap grid={heatmap} />
        <RecentMessagesTable messages={messages} />
      </div>
    </section>
  );
}
