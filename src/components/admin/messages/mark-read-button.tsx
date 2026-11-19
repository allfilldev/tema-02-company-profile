"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import type { AdminActionOutcome } from "@/lib/admin/form-state";

type MarkReadButtonProps = {
  action: () => Promise<AdminActionOutcome>;
};

export function MarkReadButton({ action }: MarkReadButtonProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function markRead() {
    setError(null);
    startTransition(async () => {
      const outcome = await action();
      if (!outcome.ok) {
        setError(outcome.message);
      }
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <Button type="button" variant="secondary" disabled={pending} onClick={markRead}>
        Tandai dibaca
      </Button>
      {error ? (
        <p role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
