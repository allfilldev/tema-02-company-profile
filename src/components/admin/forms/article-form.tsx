import { FaqField, MarkdownField, MediaField, SelectField, SlugField, TextField, TextareaField } from "@/components/admin/forms/item-fields";
import { ItemFormShell, type ItemFormAction } from "@/components/admin/forms/item-form-shell";
import { SeoPanel } from "@/components/admin/shared/seo-panel";
import type { ArticleRecord, TeamMemberRecord } from "@/core/domain/admin/records";
import type { MediaAsset } from "@/core/domain/shared/media-asset";
import { ADMIN_MODULE_PATHS } from "@/lib/site/routes";
import { formatIndonesianDate } from "@/lib/text/format-date";

type ArticleFormProps = {
  record: ArticleRecord | null;
  media: MediaAsset[];
  siteName: string;
  authors: TeamMemberRecord[];
  action: ItemFormAction;
};

export function ArticleForm({ record, media, siteName, authors, action }: ArticleFormProps) {
  const authorOptions = authors
    .filter((author) => author.isPublished || author.id === record?.authorId)
    .map((author) => ({ value: author.id, label: author.isPublished ? author.name : `${author.name} (belum terbit)` }));

  return (
    <ItemFormShell
      action={action}
      initial={record ?? {}}
      media={media}
      isPublishable
      isPublished={record?.status === "published"}
      cancelHref={ADMIN_MODULE_PATHS.articles}
    >
      <TextField name="title" label="Judul artikel" required />
      <SlugField />
      {record?.publishedAt ? (
        <p className="text-sm text-muted-foreground">{`Diterbitkan ${formatIndonesianDate(record.publishedAt)}. Tanggal ini diisi otomatis dan tidak bisa diubah.`}</p>
      ) : null}
      <SelectField name="authorId" label="Penulis" options={authorOptions} />
      <TextareaField name="lead" label="Lead (paragraf pembuka)" hint="50 sampai 100 kata, jawab inti pertanyaan di dua kalimat pertama." rows={3} />
      <MediaField name="cover" label="Gambar sampul" />
      <MarkdownField name="bodyMd" label="Isi artikel" />
      <FaqField />
      <TextField name="metaTitle" label="Meta title" hint="Judul di hasil pencarian, maksimal 60 karakter termasuk nama situs." />
      <TextareaField name="metaDescription" label="Meta description" hint="120 sampai 155 karakter." rows={3} />
      <SeoPanel kind="article" siteName={siteName} />
    </ItemFormShell>
  );
}
