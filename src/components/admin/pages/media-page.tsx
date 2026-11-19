import { MediaLibrary } from "@/components/admin/media/media-library";
import { MediaUpload } from "@/components/admin/media/media-upload";
import { removeMedia, saveMediaAlt, uploadMedia } from "@/server/actions/admin/media";
import { getAdminDeps } from "@/server/admin/admin-deps";

export async function MediaPage() {
  const deps = await getAdminDeps();
  const media = await deps.repos.media.list();

  return (
    <section className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">Media</h1>
      <MediaUpload action={uploadMedia} />
      <MediaLibrary media={media} actions={{ updateAlt: saveMediaAlt, remove: removeMedia }} />
    </section>
  );
}
