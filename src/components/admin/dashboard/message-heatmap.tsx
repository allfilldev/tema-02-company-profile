import { Clock } from "lucide-react";
import { AdminPanel } from "@/components/admin/shared/admin-panel";

const DAY_LABELS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const SLOT_LABELS = ["00", "03", "06", "09", "12", "15", "18", "21"];
const LEVEL_CLASS_NAMES = ["bg-surface-muted", "bg-primary/20", "bg-primary/40", "bg-primary/70", "bg-primary"];
const LEVELS = LEVEL_CLASS_NAMES.length - 1;

function levelOf(count: number, maximum: number): number {
  if (count <= 0 || maximum <= 0) return 0;
  return Math.max(1, Math.ceil((count / maximum) * LEVELS));
}

export function MessageHeatmap({ grid }: { grid: number[][] }) {
  const maximum = Math.max(0, ...grid.flat());

  return (
    <AdminPanel icon={Clock} title="Pesan per jam">
      <div role="img" aria-label="Peta panas jumlah pesan masuk per hari dan jam" className="flex flex-col gap-1.5">
        {DAY_LABELS.map((day, rowIndex) => (
          <div key={day} className="flex items-center gap-2">
            <span className="w-8 shrink-0 text-xs text-muted-foreground">{day}</span>
            <div className="grid min-w-0 flex-1 grid-cols-8 gap-1.5">
              {SLOT_LABELS.map((slot, columnIndex) => {
                const count = grid[rowIndex]?.[columnIndex] ?? 0;
                return <span key={slot} title={`${day} ${slot}.00: ${count} pesan`} className={`h-7 rounded-md ${LEVEL_CLASS_NAMES[levelOf(count, maximum)]}`} />;
              })}
            </div>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <span className="w-8 shrink-0" />
          <div className="grid min-w-0 flex-1 grid-cols-8 gap-1.5">
            {SLOT_LABELS.map((slot) => (
              <span key={slot} className="text-center text-xs text-muted-foreground">{slot}</span>
            ))}
          </div>
        </div>
      </div>
    </AdminPanel>
  );
}
