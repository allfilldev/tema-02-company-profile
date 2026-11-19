import { LayoutGrid } from "lucide-react";
import Link from "next/link";
import { AdminPanel } from "@/components/admin/shared/admin-panel";
import type { DashboardCount } from "@/core/application/admin/dashboard";
import { ADMIN_MODULE_LABELS } from "@/lib/admin/admin-menu";
import { ADMIN_MODULE_PATHS } from "@/lib/site/routes";

const BAR_TONES = ["bg-primary", "bg-highlight", "bg-success", "bg-warning", "bg-danger"];

function publishedShare(entry: DashboardCount): number {
  if (entry.published === null) return 100;
  if (entry.total === 0) return 0;
  return Math.round((entry.published / entry.total) * 100);
}

export function ModuleProgressTable({ modules }: { modules: DashboardCount[] }) {
  return (
    <AdminPanel icon={LayoutGrid} title="Konten per modul" bodyClassName="p-0">
      {modules.length === 0 ? (
        <p className="p-5 text-sm text-muted-foreground">Belum ada modul aktif.</p>
      ) : (
        <table className="w-full border-collapse text-left text-xs">
          <thead className="bg-surface-muted text-foreground">
            <tr>
              <th scope="col" className="px-5 py-2.5 font-semibold">Modul</th>
              <th scope="col" className="px-2 py-2.5 font-semibold">Terbit</th>
              <th scope="col" className="py-2.5 pr-5"><span className="sr-only">Proporsi terbit</span></th>
            </tr>
          </thead>
          <tbody>
            {modules.map((entry, index) => (
              <tr key={entry.module} className="border-t border-secondary">
                <td className="max-w-28 truncate px-5 py-1 font-medium text-foreground">
                  <Link href={ADMIN_MODULE_PATHS[entry.module]} className="inline-flex min-h-11 items-center hover:text-primary">
                    {ADMIN_MODULE_LABELS[entry.module]}
                  </Link>
                </td>
                <td className="px-2 py-1 text-muted-foreground">{entry.published ?? entry.total}</td>
                <td className="w-1/3 py-1 pr-5">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
                    <div className={`h-full rounded-full ${BAR_TONES[index % BAR_TONES.length]}`} style={{ width: `${publishedShare(entry)}%` }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminPanel>
  );
}
