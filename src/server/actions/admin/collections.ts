"use server";

import { notFound, redirect } from "next/navigation";
import { createCollectionAdmin } from "@/core/application/admin/collection-admin";
import type { AdminFailure } from "@/core/application/admin/admin-result";
import type { AdminCollectionRepository, MoveDirection } from "@/core/domain/admin/admin-repositories";
import { isAdminModule, type AdminModule } from "@/core/domain/admin/records";
import {
  failedState,
  invalidState,
  savedState,
  type AdminActionOutcome,
  type AdminFormState,
} from "@/lib/admin/form-state";
import { readCollectionForm } from "@/lib/admin/form-data";
import { ADMIN_MODULE_PATHS } from "@/lib/site/routes";
import { getAdminDeps, type AdminDeps } from "@/server/admin/admin-deps";
import { resolveMedia } from "@/server/admin/resolve-media";
import { revalidateAdminChange } from "@/server/data/revalidation";

const DELETE_FAILED_MESSAGE = "Gagal menghapus. Coba lagi.";
const ACTION_FAILED_MESSAGE = "Gagal memproses permintaan. Coba lagi.";
const BLOCKED_MESSAGE = "Belum bisa diproses. Periksa isian berikut:";

function moduleFrom(name: string): AdminModule {
  if (!isAdminModule(name)) {
    notFound();
  }
  return name;
}

function collectionAdminFor(module: AdminModule, deps: AdminDeps) {
  return createCollectionAdmin<AdminModule>({
    module,
    repository: deps.repos.collections[module] as unknown as AdminCollectionRepository<AdminModule>,
    articles: deps.repos.articleAuthors,
    team: deps.repos.collections.team,
    siteName: deps.siteName,
    enabledModules: deps.enabledModules,
  });
}

function describeFailure(failure: AdminFailure): string {
  const fields = Object.keys(failure.fieldErrors);
  const parts = [...failure.blocking];
  if (fields.length > 0) {
    parts.push(`${BLOCKED_MESSAGE} ${fields.join(", ")}.`);
  }
  return parts.join(" ") || ACTION_FAILED_MESSAGE;
}

export async function saveItem(
  moduleName: string,
  id: string | null,
  _state: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const module = moduleFrom(moduleName);
  const deps = await getAdminDeps();
  const form = readCollectionForm(module, formData);
  const preserved = { ...form.values, ...form.mediaIds };
  let warnings: string[] = [];

  try {
    const media = await resolveMedia(form.mediaIds, deps.repos.media);
    if (Object.keys(media.errors).length > 0) {
      return invalidState({ fieldErrors: media.errors, blocking: [], warnings: [] }, preserved);
    }

    const result = await collectionAdminFor(module, deps).save({
      id: id ?? undefined,
      values: { ...form.values, ...media.assets },
      publish: form.publish,
    });
    if (!result.ok) {
      return invalidState(result, preserved);
    }

    revalidateAdminChange({ kind: "collection", affected: result.affected });
    warnings = result.warnings;
  } catch (error) {
    console.error(`Saving ${module} failed: ${error instanceof Error ? error.message : String(error)}`);
    return failedState(preserved);
  }

  if (!id) {
    redirect(ADMIN_MODULE_PATHS[module]);
  }
  return savedState(warnings, preserved);
}

export async function deleteItem(moduleName: string, id: string): Promise<AdminActionOutcome> {
  const module = moduleFrom(moduleName);
  const deps = await getAdminDeps();

  try {
    const result = await collectionAdminFor(module, deps).remove(id);
    if (!result.ok) {
      return { ok: false, message: describeFailure(result) };
    }
    revalidateAdminChange({ kind: "collection", affected: result.affected });
    return { ok: true };
  } catch (error) {
    console.error(`Deleting from ${module} failed: ${error instanceof Error ? error.message : String(error)}`);
    return { ok: false, message: DELETE_FAILED_MESSAGE };
  }
}

export async function moveItem(moduleName: string, id: string, direction: MoveDirection): Promise<AdminActionOutcome> {
  const module = moduleFrom(moduleName);
  const deps = await getAdminDeps();

  try {
    const result = await collectionAdminFor(module, deps).move(id, direction);
    if (!result.ok) {
      return { ok: false, message: describeFailure(result) };
    }
    revalidateAdminChange({ kind: "collection", affected: result.affected });
    return { ok: true };
  } catch (error) {
    console.error(`Moving in ${module} failed: ${error instanceof Error ? error.message : String(error)}`);
    return { ok: false, message: ACTION_FAILED_MESSAGE };
  }
}

export async function setItemPublished(moduleName: string, id: string, published: boolean): Promise<AdminActionOutcome> {
  const module = moduleFrom(moduleName);
  const deps = await getAdminDeps();

  try {
    const result = await collectionAdminFor(module, deps).setPublished(id, published);
    if (!result.ok) {
      return { ok: false, message: describeFailure(result) };
    }
    revalidateAdminChange({ kind: "collection", affected: result.affected });
    return { ok: true };
  } catch (error) {
    console.error(`Publishing in ${module} failed: ${error instanceof Error ? error.message : String(error)}`);
    return { ok: false, message: ACTION_FAILED_MESSAGE };
  }
}
