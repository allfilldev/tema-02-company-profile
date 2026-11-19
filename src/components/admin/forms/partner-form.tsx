import { MediaField, TextField } from "@/components/admin/forms/item-fields";
import { ItemFormShell, type ItemFormAction } from "@/components/admin/forms/item-form-shell";
import type { PartnerRecord } from "@/core/domain/admin/records";
import type { MediaAsset } from "@/core/domain/shared/media-asset";
import { ADMIN_MODULE_PATHS } from "@/lib/site/routes";

type PartnerFormProps = {
  record: PartnerRecord | null;
  media: MediaAsset[];
  action: ItemFormAction;
};

export function PartnerForm({ record, media, action }: PartnerFormProps) {
  return (
    <ItemFormShell
      action={action}
      initial={record ?? {}}
      media={media}
      isPublishable
      isPublished={record?.isPublished ?? false}
      cancelHref={ADMIN_MODULE_PATHS.partners}
    >
      <TextField name="name" label="Nama partner" required />
      <TextField name="url" label="Alamat situs" type="url" />
      <MediaField name="logo" label="Logo" />
    </ItemFormShell>
  );
}
