"use client";

import { useState, useTransition } from "react";
import type { AdminActionOutcome } from "@/lib/admin/form-state";
import { ROW_ACTION_CLASS_NAME } from "@/lib/admin/row-action-class-names";

type PublishToggleProps = {
  id: string;
  itemName?: string;
  isPublished: boolean;
  action: (id: string, published: boolean) => Promise<AdminActionOutcome>;
};

export function PublishToggle({ id, itemName, isPublished, action }: PublishToggleProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function toggle() {
    setError(null);
    startTransition(async () => {
      const outcome = await action(id, !isPublished);
      if (!outcome.ok) {
        setError(outcome.message);
      }
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        className={ROW_ACTION_CLASS_NAME}
        aria-label={itemName ? `${isPublished ? "Tarik" : "Terbitkan"} ${itemName}` : undefined}
        disabled={pending}
        onClick={toggle}
      >
        {isPublished ? "Tarik" : "Terbitkan"}
      </button>
      {error ? (
        <p role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
