import type { Stat } from "@/core/domain/stat/stat";

export interface StatRepository {
  list(): Promise<Stat[]>;
}
