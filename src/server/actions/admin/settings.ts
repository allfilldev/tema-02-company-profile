"use server";

import { updateSiteSettings, previewTitleImpacts } from "@/core/application/admin/settings-admin";
import { failedState, invalidState, savedState, type AdminFormState } from "@/lib/admin/form-state";
import { readSettingsForm } from "@/lib/admin/form-data";
import { flattenSettingsValues } from "@/lib/admin/settings-values";
import type { TitleImpact } from "@/lib/seo/title-impact";
import { getAdminDeps } from "@/server/admin/admin-deps";
import { resolveMedia } from "@/server/admin/resolve-media";
import { getSiteQueries } from "@/server/container";
import { revalidateAdminChange } from "@/server/data/revalidation";

export async function saveSettings(_state: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const deps = await getAdminDeps();
  const form = readSettingsForm(formData);
  const preserved = flattenSettingsValues({ ...form.values, ...form.mediaIds });

  try {
    const media = await resolveMedia(form.mediaIds, deps.repos.media);
    if (Object.keys(media.errors).length > 0) {
      return invalidState({ fieldErrors: media.errors, blocking: [], warnings: [] }, preserved);
    }

    const result = await updateSiteSettings(
      { repository: deps.repos.settings },
      { ...form.values, logo: media.assets.logo, defaultOgImage: media.assets.defaultOgImage },
    );
    if (!result.ok) {
      return invalidState(result, preserved);
    }

    revalidateAdminChange(result.affected);
    return savedState(result.warnings, preserved);
  } catch (error) {
    console.error(`Saving settings failed: ${error instanceof Error ? error.message : String(error)}`);
    return failedState(preserved);
  }
}

export async function previewSettingsImpacts(siteName: string): Promise<TitleImpact[]> {
  await getAdminDeps();
  return previewTitleImpacts({ queries: getSiteQueries() }, siteName);
}
