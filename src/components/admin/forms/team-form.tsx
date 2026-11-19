import { LinesField, MediaField, NumberField, TextField, TextareaField } from "@/components/admin/forms/item-fields";
import { ItemFormShell, type ItemFormAction } from "@/components/admin/forms/item-form-shell";
import type { TeamMemberRecord } from "@/core/domain/admin/records";
import type { MediaAsset } from "@/core/domain/shared/media-asset";
import { ADMIN_MODULE_PATHS } from "@/lib/site/routes";

type TeamFormProps = {
  record: TeamMemberRecord | null;
  media: MediaAsset[];
  action: ItemFormAction;
};

export function TeamForm({ record, media, action }: TeamFormProps) {
  return (
    <ItemFormShell
      action={action}
      initial={record ?? {}}
      media={media}
      isPublishable
      isPublished={record?.isPublished ?? false}
      cancelHref={ADMIN_MODULE_PATHS.team}
    >
      <TextField name="name" label="Nama" required />
      <TextField name="jobTitle" label="Jabatan" />
      <TextareaField name="bio" label="Bio singkat" hint="Dua sampai tiga kalimat tentang latar belakang yang benar-benar ada." rows={4} />
      <NumberField name="yearsExperience" label="Pengalaman (tahun)" />
      <MediaField name="photo" label="Foto" />
      <LinesField name="profiles" label="Profil publik" hint="Satu tautan per baris, misalnya LinkedIn. Isi hanya profil yang benar-benar ada." />
    </ItemFormShell>
  );
}
