import { ConfirmDelete } from "@/components/admin/shared/confirm-delete";
import { MediaAltEditor } from "@/components/admin/media/media-alt-editor";
import type { MediaRecord } from "@/core/domain/admin/records";
import type { AdminActionOutcome } from "@/lib/admin/form-state";

type MediaLibraryProps = {
  media: MediaRecord[];
  actions: {
    updateAlt: (id: string, alt: string) => Promise<AdminActionOutcome>;
    remove: (id: string) => Promise<AdminActionOutcome>;
  };
};

function formatSize(bytes: number): string {
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function MediaLibrary({ media, actions }: MediaLibraryProps) {
  if (media.length === 0) {
    return <p className="rounded-2xl bg-surface p-6 text-muted-foreground shadow-soft">Pustaka media masih kosong.</p>;
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {media.map((asset) => (
        <li key={asset.id} className="flex flex-col gap-3 rounded-2xl bg-surface p-5 shadow-soft">
          <img src={asset.url} alt={asset.alt} width={asset.width} height={asset.height} loading="lazy" className="h-40 w-full rounded-md bg-surface-muted object-contain" />
          <p className="text-sm text-muted-foreground">{`${asset.width} × ${asset.height} · ${formatSize(asset.sizeBytes)}`}</p>
          <MediaAltEditor alt={asset.alt} action={actions.updateAlt.bind(null, asset.id)} />
          <div>
            <ConfirmDelete itemName={asset.alt} action={actions.remove.bind(null, asset.id)} />
          </div>
        </li>
      ))}
    </ul>
  );
}
