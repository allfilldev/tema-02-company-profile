import { DashboardView } from "@/components/admin/dashboard/dashboard-view";
import { getDashboardCounts } from "@/core/application/admin/dashboard";
import { buildMessageActivity, buildMessageHeatmap } from "@/core/application/admin/message-activity";
import type { AdminModule } from "@/core/domain/admin/records";
import { getAdminDeps } from "@/server/admin/admin-deps";

function updateTimestamps(records: object[]): { createdAt: string }[] {
  return records.flatMap((record) => ("updatedAt" in record && typeof record.updatedAt === "string" ? [{ createdAt: record.updatedAt }] : []));
}

export async function DashboardPage() {
  const deps = await getAdminDeps();
  const counts = await getDashboardCounts({ collections: deps.repos.collections, messages: deps.repos.messages }, deps.enabledModules);
  const today = new Date();
  const messages = await deps.repos.messages.list();
  const moduleActivityEntries = await Promise.all(
    counts.modules.map(async ({ module }) => {
      const records: object[] = await deps.repos.collections[module].list();
      return [module, buildMessageActivity(updateTimestamps(records), today).map((day) => day.count)] as const;
    }),
  );
  const moduleActivity: Partial<Record<AdminModule, number[]>> = Object.fromEntries(moduleActivityEntries);

  return (
    <DashboardView
      counts={counts}
      moduleActivity={moduleActivity}
      messageActivity={buildMessageActivity(messages, today)}
      heatmap={buildMessageHeatmap(messages)}
      messages={messages}
    />
  );
}
