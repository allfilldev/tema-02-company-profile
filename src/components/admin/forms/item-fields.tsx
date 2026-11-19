"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { invalidControlProps } from "@/lib/ui/field-ids";
import { useItemForm } from "@/components/admin/forms/item-form-shell";
import { FaqEditor } from "@/components/admin/shared/faq-editor";
import { MarkdownEditor } from "@/components/admin/shared/markdown-editor";
import { MediaPicker } from "@/components/admin/shared/media-picker";
import type { FaqItem } from "@/core/domain/shared/faq-item";
import type { MediaAsset } from "@/core/domain/shared/media-asset";

function textOf(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
}

function assetFor(value: unknown, media: MediaAsset[]): MediaAsset | null {
  if (value && typeof value === "object" && "id" in value) return value as MediaAsset;
  if (typeof value === "string") return media.find((asset) => asset.id === value) ?? null;
  return null;
}

type BaseFieldProps = {
  name: string;
  label: string;
  required?: boolean;
  hint?: string;
};

function Hint({ children }: { children: string }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

export function TextField({ name, label, required, hint, type = "text" }: BaseFieldProps & { type?: "text" | "url" | "email" }) {
  const { values, errors } = useItemForm();
  const id = useId();

  return (
    <Field label={label} htmlFor={id} error={errors[name]} required={required}>
      <Input id={id} name={name} type={type} defaultValue={textOf(values[name])} invalid={Boolean(errors[name])} />
      {hint ? <Hint>{hint}</Hint> : null}
    </Field>
  );
}

export function SlugField({ name = "slug", label = "Slug (alamat halaman)" }: { name?: string; label?: string }) {
  const { values, stored, errors, isPublished } = useItemForm();
  const id = useId();
  const initialSlug = textOf(values[name]);
  const storedSlug = textOf(stored[name]);
  const [current, setCurrent] = useState(initialSlug);
  const changed = isPublished && storedSlug.length > 0 && current !== storedSlug;

  return (
    <Field label={label} htmlFor={id} error={errors[name]} required>
      <Input id={id} name={name} defaultValue={initialSlug} invalid={Boolean(errors[name])} onChange={(event) => setCurrent(event.target.value)} />
      <Hint>Huruf kecil, angka, dan tanda hubung, misalnya penyusunan-sop.</Hint>
      {changed ? (
        <p role="status" className="text-sm font-medium text-danger">
          URL lama akan menjadi 404.
        </p>
      ) : null}
    </Field>
  );
}

export function TextareaField({ name, label, required, hint, rows = 4 }: BaseFieldProps & { rows?: number }) {
  const { values, errors } = useItemForm();
  const id = useId();

  return (
    <Field label={label} htmlFor={id} error={errors[name]} required={required}>
      <Textarea id={id} name={name} rows={rows} defaultValue={textOf(values[name])} invalid={Boolean(errors[name])} />
      {hint ? <Hint>{hint}</Hint> : null}
    </Field>
  );
}

export function NumberField({ name, label, required, hint, decimal = false }: BaseFieldProps & { decimal?: boolean }) {
  const { values, errors } = useItemForm();
  const id = useId();

  return (
    <Field label={label} htmlFor={id} error={errors[name]} required={required}>
      <Input id={id} name={name} type="number" inputMode={decimal ? "decimal" : "numeric"} min={0} step={decimal ? "any" : undefined} defaultValue={textOf(values[name])} invalid={Boolean(errors[name])} />
      {hint ? <Hint>{hint}</Hint> : null}
    </Field>
  );
}

export function DateField({ name, label }: BaseFieldProps) {
  const { values, errors } = useItemForm();
  const id = useId();

  return (
    <Field label={label} htmlFor={id} error={errors[name]}>
      <Input id={id} name={name} type="date" defaultValue={textOf(values[name])} invalid={Boolean(errors[name])} />
    </Field>
  );
}

export function LinesField({ name, label, hint }: BaseFieldProps) {
  const { values, errors } = useItemForm();
  const id = useId();
  const raw = values[name];
  const text = Array.isArray(raw) ? raw.join("\n") : textOf(raw);

  return (
    <Field label={label} htmlFor={id} error={errors[name]}>
      <Textarea id={id} name={name} rows={4} defaultValue={text} invalid={Boolean(errors[name])} />
      {hint ? <Hint>{hint}</Hint> : null}
    </Field>
  );
}

export function SelectField({ name, label, required, options }: BaseFieldProps & { options: { value: string; label: string }[] }) {
  const { values, errors } = useItemForm();
  const id = useId();

  return (
    <Field label={label} htmlFor={id} error={errors[name]} required={required}>
      <select
        id={id}
        name={name}
        defaultValue={textOf(values[name])}
        {...invalidControlProps(id, Boolean(errors[name]))}
        className="min-h-11 w-full rounded-xl border border-border-strong bg-surface px-4 py-2 text-base text-foreground aria-invalid:border-danger"
      >
        <option value="">Pilih...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function MarkdownField({ name = "bodyMd", label = "Isi" }: { name?: string; label?: string }) {
  const { values, errors, media } = useItemForm();
  const errorId = `${useId()}-error`;

  return (
    <div role="group" aria-label={label} aria-describedby={errors[name] ? errorId : undefined} className="flex flex-col gap-2">
      <MarkdownEditor name={name} label={label} initial={textOf(values[name])} media={media} />
      {errors[name] ? (
        <p id={errorId} role="alert" className="text-sm font-medium text-danger">
          {errors[name]}
        </p>
      ) : null}
    </div>
  );
}

export function FaqField({ name = "faq", label = "Pertanyaan yang sering diajukan" }: { name?: string; label?: string }) {
  const { values, errors } = useItemForm();
  const raw = values[name];
  const initial: FaqItem[] = Array.isArray(raw) ? raw : [];
  const errorId = `${useId()}-error`;

  return (
    <div role="group" aria-label={label} aria-describedby={errors[name] ? errorId : undefined} className="flex flex-col gap-2">
      <h2 className="text-base font-semibold text-foreground">{label}</h2>
      <FaqEditor initial={initial} />
      {errors[name] ? (
        <p id={errorId} role="alert" className="text-sm font-medium text-danger">
          {errors[name]}
        </p>
      ) : null}
    </div>
  );
}

export function MediaField({ name, label }: { name: string; label: string }) {
  const { values, errors, media } = useItemForm();
  const [selected, setSelected] = useState<MediaAsset | null>(() => assetFor(values[name], media));
  const [open, setOpen] = useState(false);
  const errorId = `${useId()}-error`;

  return (
    <div role="group" aria-label={label} aria-describedby={errors[name] ? errorId : undefined} className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <input type="hidden" name={name} value={selected?.id ?? ""} />
      {selected ? (
        <div className="flex items-center gap-3">
          <img src={selected.url} alt="" width={selected.width} height={selected.height} className="h-16 w-24 rounded object-cover" />
          <span className="text-sm text-muted-foreground">{selected.alt}</span>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Belum ada gambar dipilih.</p>
      )}
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="secondary" onClick={() => setOpen(true)}>
          {selected ? `Ganti ${label.toLowerCase()}` : `Pilih ${label.toLowerCase()}`}
        </Button>
        {selected ? (
          <Button type="button" variant="ghost" onClick={() => setSelected(null)}>
            {`Hapus pilihan ${label.toLowerCase()}`}
          </Button>
        ) : null}
      </div>
      {errors[name] ? (
        <p id={errorId} role="alert" className="text-sm font-medium text-danger">
          {errors[name]}
        </p>
      ) : null}
      {open ? (
        <MediaPicker
          media={media}
          onSelect={(asset) => {
            setSelected(asset);
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </div>
  );
}

export function GalleryField({ name = "gallery", label = "Galeri" }: { name?: string; label?: string }) {
  const { values, media } = useItemForm();
  const raw = values[name];
  const [items, setItems] = useState<MediaAsset[]>(() => (Array.isArray(raw) ? raw.flatMap((entry) => {
    const asset = assetFor(entry, media);
    return asset ? [asset] : [];
  }) : []));
  const [open, setOpen] = useState(false);

  function move(index: number, offset: number) {
    setItems((current) => {
      const target = index + offset;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      {items.map((asset) => (
        <input key={asset.id} type="hidden" name={name} value={asset.id} />
      ))}
      <ul className="flex flex-col gap-2">
        {items.map((asset, index) => (
          <li key={asset.id} className="flex flex-wrap items-center gap-3">
            <img src={asset.url} alt="" width={asset.width} height={asset.height} className="h-12 w-16 rounded object-cover" />
            <span className="min-w-0 flex-1 text-sm text-muted-foreground">{asset.alt}</span>
            <Button type="button" variant="ghost" aria-label={`Naikkan gambar ${index + 1}`} disabled={index === 0} onClick={() => move(index, -1)}>
              Naik
            </Button>
            <Button type="button" variant="ghost" aria-label={`Turunkan gambar ${index + 1}`} disabled={index === items.length - 1} onClick={() => move(index, 1)}>
              Turun
            </Button>
            <Button type="button" variant="ghost" aria-label={`Hapus gambar ${index + 1}`} onClick={() => setItems((current) => current.filter((item) => item.id !== asset.id))}>
              Hapus
            </Button>
          </li>
        ))}
      </ul>
      <div>
        <Button type="button" variant="secondary" onClick={() => setOpen(true)}>
          Tambah gambar galeri
        </Button>
      </div>
      {open ? (
        <MediaPicker
          media={media.filter((asset) => !items.some((item) => item.id === asset.id))}
          onSelect={(asset) => {
            setItems((current) => [...current, asset]);
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </div>
  );
}
