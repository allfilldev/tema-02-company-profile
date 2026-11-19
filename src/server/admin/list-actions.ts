import type { AdminModule } from "@/core/domain/admin/records";
import type { ListActions } from "@/lib/admin/list-actions";
import { deleteItem, moveItem, setItemPublished } from "@/server/actions/admin/collections";

export function listActionsFor(module: AdminModule): ListActions {
  return {
    move: moveItem.bind(null, module),
    setPublished: setItemPublished.bind(null, module),
    remove: deleteItem.bind(null, module),
  };
}
