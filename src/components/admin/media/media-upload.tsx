"use client";

import { useId, useState, useTransition, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FormNotice } from "@/components/admin/shared/form-notice";
import { MAX_UPLOAD_BYTES, type MediaKind } from "@/core/application/admin/media-upload";
import { downscaleImage } from "@/lib/admin/downscale";
import { INITIAL_ADMIN_FORM_STATE, type AdminFormState } from "@/lib/admin/form-state";

type MediaUploadProps = {
  action: (state: AdminFormState, formData: FormData) => Promise<AdminFormState>;
};

const MISSING_ALT_MESSAGE = "Isi teks alternatif gambar.";
const MISSING_FILE_MESSAGE = "Pilih berkas gambar.";
const TOO_LARGE_MESSAGE = "Ukuran gambar maksimal 4 MB.";
const FAILED_UPLOAD_MESSAGE = "Gagal menyimpan. Coba lagi.";
const UNREADABLE_FILE_MESSAGE = "Gambar tidak bisa dibaca. Coba berkas lain.";

const KIND_OPTIONS: { value: MediaKind; label: string }[] = [
  { value: "photo", label: "Foto" },
  { value: "logo", label: "Logo" },
];

export function MediaUpload({ action }: MediaUploadProps) {
  const [state, setState] = useState<AdminFormState>(INITIAL_ADMIN_FORM_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();
  const baseId = useId();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const fileInput = form.elements.namedItem("file");
    const file = fileInput instanceof HTMLInputElement ? (fileInput.files?.[0] ?? null) : null;
    const alt = String(formData.get("alt") ?? "").trim();
    const kind: MediaKind = formData.get("kind") === "logo" ? "logo" : "photo";

    const found: Record<string, string> = {};
    if (!file) found.file = MISSING_FILE_MESSAGE;
    if (alt.length === 0) found.alt = MISSING_ALT_MESSAGE;
    setErrors(found);
    if (!file || alt.length === 0) {
      return;
    }

    startTransition(async () => {
      let resized: Blob;
      try {
        resized = await downscaleImage(file, kind);
      } catch {
        setErrors({ file: UNREADABLE_FILE_MESSAGE });
        return;
      }

      if (resized.size > MAX_UPLOAD_BYTES) {
        setErrors({ file: TOO_LARGE_MESSAGE });
        return;
      }

      formData.set("file", new File([resized], "upload", { type: resized.type }));
      try {
        const next = await action(state, formData);
        setState(next);
        setErrors(next.fieldErrors);
        if (next.status === "saved") {
          form.reset();
        }
      } catch {
        setErrors({});
        setState({ ...INITIAL_ADMIN_FORM_STATE, status: "failed", message: FAILED_UPLOAD_MESSAGE });
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 rounded-lg border border-border bg-background p-4">
      <h2 className="font-heading text-lg font-bold text-foreground">Unggah gambar baru</h2>
      <FormNotice state={state} />
      <Field label="Berkas gambar" htmlFor={`${baseId}-file`} error={errors.file}>
        <Input id={`${baseId}-file`} name="file" type="file" accept="image/*" invalid={Boolean(errors.file)} />
      </Field>
      <Field label="Jenis gambar" htmlFor={`${baseId}-kind`}>
        <select id={`${baseId}-kind`} name="kind" defaultValue="photo" className="min-h-11 w-full rounded-md border border-border-strong bg-surface px-4 py-2 text-base text-foreground">
          {KIND_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Teks alternatif" htmlFor={`${baseId}-alt`} error={errors.alt} required>
        <Input id={`${baseId}-alt`} name="alt" maxLength={200} invalid={Boolean(errors.alt)} />
      </Field>
      <div>
        <Button type="submit" disabled={pending}>
          Unggah
        </Button>
      </div>
    </form>
  );
}
