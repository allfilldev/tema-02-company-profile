"use client";

import { useEffect, useId, useState } from "react";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useItemForm } from "@/components/admin/forms/item-form-shell";
import type { TitleImpact } from "@/lib/seo/title-impact";

const PREVIEW_DELAY_MS = 300;

type SiteNameFieldProps = {
  previewImpacts: (siteName: string) => Promise<TitleImpact[]>;
};

function ImpactList({ heading, impacts }: { heading: string; impacts: TitleImpact[] }) {
  if (impacts.length === 0) {
    return null;
  }

  return (
    <div role="status" className="rounded-md border border-border p-3 text-sm text-foreground">
      <p className="font-semibold">{heading}</p>
      <ul className="mt-1 list-disc pl-5">
        {impacts.map((impact) => (
          <li key={impact.label}>{`${impact.label}: ${impact.title}`}</li>
        ))}
      </ul>
    </div>
  );
}

export function SiteNameField({ previewImpacts }: SiteNameFieldProps) {
  const { values, stored, errors } = useItemForm();
  const id = useId();
  const typed = typeof values.siteName === "string" ? values.siteName : "";
  const saved = typeof stored.siteName === "string" ? stored.siteName : "";
  const [current, setCurrent] = useState(typed);
  const [impacts, setImpacts] = useState<TitleImpact[]>([]);

  useEffect(() => {
    if (current === saved || current.trim().length === 0) {
      setImpacts([]);
      return;
    }

    let cancelled = false;
    const timer = setTimeout(() => {
      previewImpacts(current)
        .then((result) => {
          if (!cancelled) setImpacts(result);
        })
        .catch(() => {
          if (!cancelled) setImpacts([]);
        });
    }, PREVIEW_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [current, saved, previewImpacts]);

  return (
    <Field label="Nama situs" htmlFor={id} error={errors.siteName} required>
      <Input id={id} name="siteName" defaultValue={typed} invalid={Boolean(errors.siteName)} onChange={(event) => setCurrent(event.target.value)} />
      <ImpactList heading="Judul berikut akan dipotong:" impacts={impacts.filter((impact) => impact.result === "truncated")} />
      <ImpactList heading="Judul berikut terlalu pendek:" impacts={impacts.filter((impact) => impact.result === "too-short")} />
    </Field>
  );
}
