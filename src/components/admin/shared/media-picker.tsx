"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import type { MediaAsset } from "@/core/domain/shared/media-asset";
import { useDialogFocus } from "@/lib/admin/use-dialog-focus";

type MediaPickerProps = {
  media: MediaAsset[];
  onSelect: (asset: MediaAsset) => void;
  onClose: () => void;
};

export function MediaPicker({ media, onSelect, onClose }: MediaPickerProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(dialogRef, true);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Pilih gambar" className="fixed inset-0 z-30 flex items-center justify-center bg-foreground/50 p-4">
      <div className="flex max-h-full w-full max-w-3xl flex-col rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-lg font-bold text-foreground">Pilih gambar</h2>
          <Button type="button" variant="secondary" onClick={onClose}>
            Tutup
          </Button>
        </div>
        {media.length === 0 ? (
          <p className="mt-4 text-muted-foreground">Pustaka media masih kosong.</p>
        ) : (
          <ul className="mt-4 grid grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3 md:grid-cols-4">
            {media.map((asset) => (
              <li key={asset.id}>
                <button
                  type="button"
                  aria-label={asset.alt}
                  onClick={() => onSelect(asset)}
                  className="flex w-full flex-col gap-2 rounded-md border border-border p-2 text-left hover:border-primary"
                >
                  <img src={asset.url} alt="" width={asset.width} height={asset.height} loading="lazy" className="h-24 w-full rounded object-cover" />
                  <span className="line-clamp-2 text-xs text-muted-foreground">{asset.alt}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
