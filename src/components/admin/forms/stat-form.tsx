import { NumberField, TextField } from "@/components/admin/forms/item-fields";
import { ItemFormShell, type ItemFormAction } from "@/components/admin/forms/item-form-shell";
import type { StatRecord } from "@/core/domain/admin/records";
import { ADMIN_MODULE_PATHS } from "@/lib/site/routes";

type StatFormProps = {
  record: StatRecord | null;
  action: ItemFormAction;
};

export function StatForm({ record, action }: StatFormProps) {
  return (
    <ItemFormShell action={action} initial={record ?? {}} media={[]} isPublishable={false} isPublished={false} cancelHref={ADMIN_MODULE_PATHS.stats}>
      <TextField name="key" label="Kunci" required hint="Huruf kecil tanpa spasi, misalnya projects." />
      <TextField name="label" label="Label" required />
      <NumberField name="value" label="Nilai" required decimal />
      <TextField name="suffix" label="Akhiran" hint="Misalnya + atau %." />
    </ItemFormShell>
  );
}
