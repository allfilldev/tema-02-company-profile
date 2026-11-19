"use client";

import { useEffect, useId, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import type { AdminActionOutcome } from "@/lib/admin/form-state";

type ConfirmDeleteProps = {
  itemName: string;
  action: () => Promise<AdminActionOutcome>;
};

export function ConfirmDelete({ itemName, action }: ConfirmDeleteProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const titleId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  function confirm() {
    setError(null);
    startTransition(async () => {
      const outcome = await action();
      if (outcome.ok) {
        setOpen(false);
      } else {
        setError(outcome.message);
      }
    });
  }

  return (
    <>
      <Button type="button" variant="ghost" onClick={() => setOpen(true)}>
        Hapus
      </Button>
      {open ? (
        <div role="alertdialog" aria-modal="true" aria-labelledby={titleId} className="fixed inset-0 z-30 flex items-center justify-center bg-foreground/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
            <p id={titleId} className="text-base font-semibold text-foreground">
              {`Hapus ${itemName}? Tindakan ini tidak bisa dibatalkan.`}
            </p>
            {error ? (
              <p role="alert" className="mt-3 text-sm font-medium text-danger">
                {error}
              </p>
            ) : null}
            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                Batal
              </Button>
              <Button type="button" disabled={pending} onClick={confirm}>
                Hapus
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
