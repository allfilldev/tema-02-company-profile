"use client";

import { useState, useTransition } from "react";
import type { MoveDirection } from "@/core/domain/admin/admin-repositories";
import type { AdminActionOutcome } from "@/lib/admin/form-state";
import { ROW_ACTION_CLASS_NAME } from "@/lib/admin/row-action-class-names";

type MoveButtonsProps = {
  id: string;
  itemName?: string;
  isFirst: boolean;
  isLast: boolean;
  action: (id: string, direction: MoveDirection) => Promise<AdminActionOutcome>;
};

export function MoveButtons({ id, itemName, isFirst, isLast, action }: MoveButtonsProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function move(direction: MoveDirection) {
    setError(null);
    startTransition(async () => {
      const outcome = await action(id, direction);
      if (!outcome.ok) {
        setError(outcome.message);
      }
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={ROW_ACTION_CLASS_NAME} aria-label={itemName ? `Naikkan ${itemName}` : undefined} disabled={isFirst || pending} onClick={() => move("up")}>
          Naik
        </button>
        <button type="button" className={ROW_ACTION_CLASS_NAME} aria-label={itemName ? `Turunkan ${itemName}` : undefined} disabled={isLast || pending} onClick={() => move("down")}>
          Turun
        </button>
      </div>
      {error ? (
        <p role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
