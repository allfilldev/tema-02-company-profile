import { DashboardCards } from "@/components/admin/dashboard/dashboard-cards";
import { getDashboardCounts } from "@/core/application/admin/dashboard";
import { getAdminDeps } from "@/server/admin/admin-deps";

export async function DashboardPage() {
  const deps = await getAdminDeps();
  const counts = await getDashboardCounts({ collections: deps.repos.collections, messages: deps.repos.messages }, deps.enabledModules);

  return (
    <section className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">Dashboard</h1>
      <p className="text-muted-foreground">{`Masuk sebagai ${deps.session.email}.`}</p>
      <DashboardCards counts={counts} />
    </section>
  );
}
