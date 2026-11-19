import { FaqField, MarkdownField, MediaField, SlugField, TextField, TextareaField } from "@/components/admin/forms/item-fields";
import { ItemFormShell, type ItemFormAction } from "@/components/admin/forms/item-form-shell";
import { SeoPanel } from "@/components/admin/shared/seo-panel";
import type { ServiceRecord } from "@/core/domain/admin/records";
import type { MediaAsset } from "@/core/domain/shared/media-asset";
import { ADMIN_MODULE_PATHS } from "@/lib/site/routes";

type ServiceFormProps = {
  record: ServiceRecord | null;
  media: MediaAsset[];
  siteName: string;
  action: ItemFormAction;
};

export function ServiceForm({ record, media, siteName, action }: ServiceFormProps) {
  return (
    <ItemFormShell
      action={action}
      initial={record ?? {}}
      media={media}
      isPublishable
      isPublished={record?.isPublished ?? false}
      cancelHref={ADMIN_MODULE_PATHS.services}
    >
      <TextField name="title" label="Judul layanan" required />
      <SlugField />
      <TextareaField name="summary" label="Ringkasan" hint="Satu atau dua kalimat yang tampil di daftar layanan." rows={3} />
      <MediaField name="cover" label="Gambar sampul" />
      <MarkdownField name="bodyMd" label="Isi layanan" />
      <FaqField />
      <TextField name="metaTitle" label="Meta title" hint="Judul di hasil pencarian, maksimal 60 karakter termasuk nama situs." />
      <TextareaField name="metaDescription" label="Meta description" hint="120 sampai 155 karakter." rows={3} />
      <SeoPanel kind="service" siteName={siteName} />
    </ItemFormShell>
  );
}
