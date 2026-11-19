"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import type { AdminActionOutcome } from "@/lib/admin/form-state";
import { ROW_ACTION_DANGER_CLASS_NAME } from "@/lib/admin/row-action-class-names";
import { useDialogFocus } from "@/lib/admin/use-dialog-focus";

type ConfirmDeleteProps = {
  itemName: string;
  action: () => Promise<AdminActionOutcome>;
};

export function ConfirmDelete({ itemName, action }: ConfirmDeleteProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(dialogRef, open);

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
      <button type="button" className={ROW_ACTION_DANGER_CLASS_NAME} aria-label={`Hapus ${itemName}`} onClick={() => setOpen(true)}>
        Hapus
      </button>
      {open ? (
        <div ref={dialogRef} role="alertdialog" aria-modal="true" aria-labelledby={titleId} className="fixed inset-0 z-30 flex items-center justify-center bg-foreground/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-soft">
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
