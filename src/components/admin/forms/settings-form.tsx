import { MediaField, NumberField, SelectField, TextField, TextareaField } from "@/components/admin/forms/item-fields";
import { ItemFormShell, type ItemFormAction } from "@/components/admin/forms/item-form-shell";
import { SiteNameField } from "@/components/admin/forms/site-name-field";
import { SocialLinksField } from "@/components/admin/forms/social-links-field";
import type { SiteSettings } from "@/core/domain/settings/site-settings";
import type { MediaAsset } from "@/core/domain/shared/media-asset";
import { flattenSettingsValues } from "@/lib/admin/settings-values";
import type { TitleImpact } from "@/lib/seo/title-impact";

type SettingsFormProps = {
  settings: SiteSettings;
  media: MediaAsset[];
  action: ItemFormAction;
  previewImpacts: (siteName: string) => Promise<TitleImpact[]>;
};

const SCHEMA_TYPE_OPTIONS = [
  { value: "Organization", label: "Organisasi" },
  { value: "LocalBusiness", label: "Bisnis lokal" },
];

export function SettingsForm({ settings, media, action, previewImpacts }: SettingsFormProps) {
  return (
    <ItemFormShell action={action} initial={flattenSettingsValues({ ...settings })} media={media} isPublishable={false} isPublished={false}>
      <SiteNameField previewImpacts={previewImpacts} />
      <TextField name="tagline" label="Slogan" required />
      <MediaField name="logo" label="Logo" />
      <MediaField name="defaultOgImage" label="Gambar bagikan bawaan" />
      <TextField name="email" label="Email" type="email" required />
      <TextField name="phone" label="Telepon" required />
      <TextField name="whatsappNumber" label="Nomor WhatsApp" required hint="Diawali 62 tanpa tanda plus, misalnya 6281234567890." />
      <TextareaField name="whatsappMessage" label="Pesan WhatsApp" required rows={3} />
      <TextField name="addressStreet" label="Alamat jalan" required />
      <TextField name="addressCity" label="Kota" required />
      <TextField name="addressRegion" label="Provinsi" required />
      <TextField name="postalCode" label="Kode pos" required />
      <TextField name="addressCountry" label="Negara" required hint="Kode dua huruf, misalnya ID." />
      <TextField name="mapsEmbedUrl" label="Alamat peta tertanam" type="url" />
      <TextField name="openingHours" label="Jam buka" />
      <SocialLinksField />
      <SelectField name="schemaType" label="Jenis usaha untuk mesin pencari" required options={SCHEMA_TYPE_OPTIONS} />
      <NumberField name="foundedYear" label="Tahun berdiri" />
      <TextField name="googleSiteVerification" label="Kode verifikasi Google Search Console" />
      <TextField name="gaMeasurementId" label="ID pengukuran Google Analytics" />
    </ItemFormShell>
  );
}
