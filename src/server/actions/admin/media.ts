"use server";

import { randomUUID } from "node:crypto";
import { deleteMedia, updateMediaAlt } from "@/core/application/admin/media-admin";
import { uploadMediaImage, type MediaKind, type MediaUploadDeps } from "@/core/application/admin/media-upload";
import {
  failedState,
  FAILED_MESSAGE,
  invalidState,
  savedState,
  type AdminActionOutcome,
  type AdminFormState,
} from "@/lib/admin/form-state";
import { LOGO_MAX_WIDTH, MAX_IMAGE_BYTES, optimizeToWebp, PHOTO_MAX_WIDTH } from "@/infrastructure/images/optimize-webp";
import { getAdminDeps } from "@/server/admin/admin-deps";
import { revalidateAdminChange } from "@/server/data/revalidation";

const DELETE_FAILED_MESSAGE = "Gagal menghapus. Coba lagi.";

function optimizeForKind(input: Buffer, kind: MediaKind) {
  return optimizeToWebp(input, { maxWidth: kind === "logo" ? LOGO_MAX_WIDTH : PHOTO_MAX_WIDTH, maxBytes: MAX_IMAGE_BYTES });
}

function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export async function uploadMedia(_state: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const deps = await getAdminDeps();
  const kind: MediaKind = readText(formData, "kind") === "logo" ? "logo" : "photo";
  const alt = readText(formData, "alt");
  const entry = formData.get("file");
  const file = entry instanceof File ? entry : null;
  const preserved = { alt, kind };

  const uploadDeps: MediaUploadDeps = {
    repository: deps.repos.media,
    storage: deps.storage,
    optimize: optimizeForKind,
    newId: randomUUID,
  };

  try {
    const result = await uploadMediaImage(uploadDeps, {
      file: {
        type: file?.type ?? "",
        size: file?.size ?? 0,
        bytes: async () => Buffer.from(await (file as File).arrayBuffer()),
      },
      alt,
      kind,
    });
    if (!result.ok) {
      return invalidState(result, preserved);
    }

    revalidateAdminChange(result.affected);
    return savedState(result.warnings, {});
  } catch (error) {
    console.error(`Uploading media failed: ${error instanceof Error ? error.message : String(error)}`);
    return failedState(preserved);
  }
}

export async function saveMediaAlt(id: string, alt: string): Promise<AdminActionOutcome> {
  const deps = await getAdminDeps();

  try {
    const result = await updateMediaAlt({ repository: deps.repos.media }, id, alt);
    if (!result.ok) {
      return { ok: false, message: result.blocking[0] ?? FAILED_MESSAGE };
    }
    revalidateAdminChange(result.affected);
    return { ok: true };
  } catch (error) {
    console.error(`Saving media alt failed: ${error instanceof Error ? error.message : String(error)}`);
    return { ok: false, message: FAILED_MESSAGE };
  }
}

export async function removeMedia(id: string): Promise<AdminActionOutcome> {
  const deps = await getAdminDeps();

  try {
    const result = await deleteMedia({ repository: deps.repos.media }, id);
    if (!result.ok) {
      return { ok: false, message: result.blocking.join(" ") || DELETE_FAILED_MESSAGE };
    }

    const { storagePath } = result.value;
    if (storagePath) {
      try {
        await deps.storage.remove(storagePath);
      } catch (error) {
        console.error(`Removing a media object failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    revalidateAdminChange(result.affected);
    return { ok: true };
  } catch (error) {
    console.error(`Deleting media failed: ${error instanceof Error ? error.message : String(error)}`);
    return { ok: false, message: DELETE_FAILED_MESSAGE };
  }
}
