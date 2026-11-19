import { BarChart } from "@/components/admin/dashboard/bar-chart";
import { DashboardCards } from "@/components/admin/dashboard/dashboard-cards";
import { RecentMessagesTable } from "@/components/admin/dashboard/recent-messages-table";
import { AdminCard } from "@/components/admin/shared/admin-card";
import { PageHeader } from "@/components/admin/shared/page-header";
import { getDashboardCounts } from "@/core/application/admin/dashboard";
import { buildMessageActivity } from "@/core/application/admin/message-activity";
import type { AdminModule } from "@/core/domain/admin/records";
import { getAdminDeps } from "@/server/admin/admin-deps";

const CHART_DAY_FORMAT = new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", day: "numeric", month: "short" });

function updateTimestamps(records: object[]): { createdAt: string }[] {
  return records.flatMap((record) => ("updatedAt" in record && typeof record.updatedAt === "string" ? [{ createdAt: record.updatedAt }] : []));
}

export async function DashboardPage() {
  const deps = await getAdminDeps();
  const counts = await getDashboardCounts({ collections: deps.repos.collections, messages: deps.repos.messages }, deps.enabledModules);
  const today = new Date();
  const messages = await deps.repos.messages.list();
  const activity = buildMessageActivity(messages, today);
  const moduleActivityEntries = await Promise.all(
    counts.modules.map(async ({ module }) => {
      const records: object[] = await deps.repos.collections[module].list();
      return [module, buildMessageActivity(updateTimestamps(records), today).map((day) => day.count)] as const;
    }),
  );
  const moduleActivity: Partial<Record<AdminModule, number[]>> = Object.fromEntries(moduleActivityEntries);
  const chartData = activity.map((day) => ({ label: CHART_DAY_FORMAT.format(Date.parse(`${day.date}T12:00:00+07:00`)), value: day.count }));

  return (
    <section className="flex flex-col gap-6">
      <PageHeader title="Dashboard" description={`Masuk sebagai ${deps.session.email}.`} />
      <DashboardCards counts={counts} moduleActivity={moduleActivity} messageTrend={activity.map((day) => day.count)} />
      <AdminCard className="flex flex-col gap-4">
        <h2 className="font-heading text-lg font-semibold text-foreground">Pesan masuk 14 hari terakhir</h2>
        <BarChart data={chartData} label="Grafik batang jumlah pesan masuk per hari selama 14 hari terakhir" />
      </AdminCard>
      <RecentMessagesTable messages={messages} />
    </section>
  );
}
