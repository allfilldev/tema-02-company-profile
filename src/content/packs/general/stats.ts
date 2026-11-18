import type { Stat } from "@/core/domain/stat/stat";

export const generalStats: Stat[] = [
  { key: "completed_projects", label: "Proyek selesai", value: 120, suffix: "+", sortOrder: 1 },
  { key: "clients_served", label: "Klien dilayani", value: 85, suffix: "+", sortOrder: 2 },
  { key: "years_experience", label: "Tahun pengalaman", value: 9, suffix: null, sortOrder: 3 },
  { key: "training_participants", label: "Peserta pelatihan", value: 1500, suffix: "+", sortOrder: 4 },
];
