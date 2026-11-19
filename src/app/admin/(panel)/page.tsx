import { AdminPlaceholder } from "@/components/admin/admin-placeholder";
import { requireAdmin } from "@/server/admin/admin-session";

export default async function AdminDashboardPage() {
  const session = await requireAdmin();
  return <AdminPlaceholder email={session.email} />;
}
