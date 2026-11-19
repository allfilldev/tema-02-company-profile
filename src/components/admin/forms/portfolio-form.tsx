import { GalleryField, MarkdownField, MediaField, SlugField, TextField, TextareaField, DateField } from "@/components/admin/forms/item-fields";
import { ItemFormShell, type ItemFormAction } from "@/components/admin/forms/item-form-shell";
import { SeoPanel } from "@/components/admin/shared/seo-panel";
import type { PortfolioRecord } from "@/core/domain/admin/records";
import type { MediaAsset } from "@/core/domain/shared/media-asset";
import { ADMIN_MODULE_PATHS } from "@/lib/site/routes";

type PortfolioFormProps = {
  record: PortfolioRecord | null;
  media: MediaAsset[];
  siteName: string;
  action: ItemFormAction;
};

export function PortfolioForm({ record, media, siteName, action }: PortfolioFormProps) {
  return (
    <ItemFormShell
      action={action}
      initial={record ?? {}}
      media={media}
      isPublishable
      isPublished={record?.isPublished ?? false}
      cancelHref={ADMIN_MODULE_PATHS.portfolio}
    >
      <TextField name="title" label="Judul proyek" required />
      <SlugField />
      <TextField name="clientName" label="Nama klien" />
      <TextField name="category" label="Kategori" />
      <TextareaField name="summary" label="Ringkasan" rows={3} />
      <DateField name="completedOn" label="Tanggal selesai" />
      <MediaField name="cover" label="Gambar sampul" />
      <GalleryField />
      <MarkdownField name="bodyMd" label="Isi proyek" />
      <TextField name="metaTitle" label="Meta title" hint="Judul di hasil pencarian, maksimal 60 karakter termasuk nama situs." />
      <TextareaField name="metaDescription" label="Meta description" hint="120 sampai 155 karakter." rows={3} />
      <SeoPanel kind="portfolio" siteName={siteName} />
    </ItemFormShell>
  );
}
