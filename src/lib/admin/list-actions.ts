import type { MoveDirection } from "@/core/domain/admin/admin-repositories";
import type { AdminActionOutcome } from "@/lib/admin/form-state";

export type ListActions = {
  move: (id: string, direction: MoveDirection) => Promise<AdminActionOutcome>;
  setPublished: (id: string, published: boolean) => Promise<AdminActionOutcome>;
  remove: (id: string) => Promise<AdminActionOutcome>;
};
