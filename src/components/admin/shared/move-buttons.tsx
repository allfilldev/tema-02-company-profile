"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import type { MoveDirection } from "@/core/domain/admin/admin-repositories";
import type { AdminActionOutcome } from "@/lib/admin/form-state";

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
      <div className="flex gap-1">
        <Button type="button" variant="ghost" aria-label={itemName ? `Naikkan ${itemName}` : undefined} disabled={isFirst || pending} onClick={() => move("up")}>
          Naik
        </Button>
        <Button type="button" variant="ghost" aria-label={itemName ? `Turunkan ${itemName}` : undefined} disabled={isLast || pending} onClick={() => move("down")}>
          Turun
        </Button>
      </div>
      {error ? (
        <p role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
