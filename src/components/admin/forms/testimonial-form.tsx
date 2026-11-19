import { MediaField, TextField, TextareaField } from "@/components/admin/forms/item-fields";
import { ItemFormShell, type ItemFormAction } from "@/components/admin/forms/item-form-shell";
import type { TestimonialRecord } from "@/core/domain/admin/records";
import type { MediaAsset } from "@/core/domain/shared/media-asset";
import { ADMIN_MODULE_PATHS } from "@/lib/site/routes";

type TestimonialFormProps = {
  record: TestimonialRecord | null;
  media: MediaAsset[];
  action: ItemFormAction;
};

export function TestimonialForm({ record, media, action }: TestimonialFormProps) {
  return (
    <ItemFormShell
      action={action}
      initial={record ?? {}}
      media={media}
      isPublishable
      isPublished={record?.isPublished ?? false}
      cancelHref={ADMIN_MODULE_PATHS.testimonials}
    >
      <TextField name="name" label="Nama" required />
      <TextField name="jobTitle" label="Jabatan" />
      <TextField name="company" label="Perusahaan" />
      <TextareaField name="quote" label="Kutipan" hint="Isi hanya kutipan yang benar-benar disampaikan klien." rows={4} />
      <MediaField name="photo" label="Foto" />
    </ItemFormShell>
  );
}
