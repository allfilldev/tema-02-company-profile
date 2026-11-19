import { SettingsForm } from "@/components/admin/forms/settings-form";
import { PageHeader } from "@/components/admin/shared/page-header";
import { previewSettingsImpacts, saveSettings } from "@/server/actions/admin/settings";
import { getAdminDeps } from "@/server/admin/admin-deps";
import { toMediaAsset } from "@/server/admin/resolve-media";

export async function SettingsPage() {
  const deps = await getAdminDeps();
  const [settings, mediaRecords] = await Promise.all([deps.repos.settings.get(), deps.repos.media.list()]);

  return (
    <section className="flex flex-col gap-6">
      <PageHeader title="Pengaturan situs" />
      <SettingsForm settings={settings} media={mediaRecords.map(toMediaAsset)} action={saveSettings} previewImpacts={previewSettingsImpacts} />
    </section>
  );
}
