"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useItemForm } from "@/components/admin/forms/item-form-shell";

type SocialLink = { platform: string; url: string };
type Entry = SocialLink & { key: number };

export function SocialLinksField() {
  const { values, errors } = useItemForm();
  const raw = values.socialLinks;
  const initial: SocialLink[] = Array.isArray(raw) ? raw : [];
  const nextKey = useRef(initial.length);
  const [entries, setEntries] = useState<Entry[]>(() => initial.map((link, index) => ({ ...link, key: index })));

  function update(index: number, patch: Partial<SocialLink>) {
    setEntries((current) => current.map((entry, position) => (position === index ? { ...entry, ...patch } : entry)));
  }

  function add() {
    nextKey.current += 1;
    setEntries((current) => [...current, { platform: "", url: "", key: nextKey.current }]);
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-base font-semibold text-foreground">Tautan media sosial</h2>
      {entries.map((entry, index) => (
        <fieldset key={entry.key} className="flex flex-col gap-3 rounded-md border border-border p-4">
          <legend className="px-1 text-sm font-semibold text-foreground">{`Tautan sosial ${index + 1}`}</legend>
          <Field label={`Platform ${index + 1}`} htmlFor={`social-${entry.key}-platform`}>
            <Input id={`social-${entry.key}-platform`} name={`social[${index}][platform]`} value={entry.platform} onChange={(event) => update(index, { platform: event.target.value })} />
          </Field>
          <Field label={`Alamat ${index + 1}`} htmlFor={`social-${entry.key}-url`}>
            <Input id={`social-${entry.key}-url`} name={`social[${index}][url]`} type="url" value={entry.url} onChange={(event) => update(index, { url: event.target.value })} />
          </Field>
          <div>
            <Button type="button" variant="ghost" aria-label={`Hapus tautan sosial ${index + 1}`} onClick={() => setEntries((current) => current.filter((_, position) => position !== index))}>
              Hapus
            </Button>
          </div>
        </fieldset>
      ))}
      <div>
        <Button type="button" variant="secondary" onClick={add}>
          Tambah tautan sosial
        </Button>
      </div>
      {errors.socialLinks ? (
        <p role="alert" className="text-sm font-medium text-danger">
          {errors.socialLinks}
        </p>
      ) : null}
    </div>
  );
}
