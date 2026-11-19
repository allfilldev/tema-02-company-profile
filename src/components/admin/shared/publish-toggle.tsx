"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import type { AdminActionOutcome } from "@/lib/admin/form-state";

type PublishToggleProps = {
  id: string;
  isPublished: boolean;
  action: (id: string, published: boolean) => Promise<AdminActionOutcome>;
};

export function PublishToggle({ id, isPublished, action }: PublishToggleProps) {
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
      <Button type="button" variant="secondary" disabled={pending} onClick={toggle}>
        {isPublished ? "Tarik" : "Terbitkan"}
      </Button>
      {error ? (
        <p role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
