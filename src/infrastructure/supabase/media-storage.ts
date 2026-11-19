import type { MediaStorage } from "@/core/application/admin/media-upload";

const MEDIA_BUCKET = "media";

type StorageError = { message: string } | null;

export type StorageClient = {
  storage: {
    from(bucket: string): {
      upload(path: string, data: Buffer, options: { contentType: string; upsert: boolean }): PromiseLike<{ error: StorageError }>;
      getPublicUrl(path: string): { data: { publicUrl: string } };
      remove(paths: string[]): PromiseLike<{ error: StorageError }>;
    };
  };
};

export function createSupabaseMediaStorage(client: StorageClient): MediaStorage {
  const bucket = () => client.storage.from(MEDIA_BUCKET);

  return {
    async upload(path, data, contentType) {
      const { error } = await bucket().upload(path, data, { contentType, upsert: false });
      if (error) {
        throw new Error(error.message);
      }
      return { publicUrl: bucket().getPublicUrl(path).data.publicUrl };
    },
    async remove(path) {
      const { error } = await bucket().remove([path]);
      if (error) {
        throw new Error(error.message);
      }
    },
  };
}
