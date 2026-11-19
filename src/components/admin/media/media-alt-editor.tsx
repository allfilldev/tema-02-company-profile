"use client";

import { useId, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { AdminActionOutcome } from "@/lib/admin/form-state";

type MediaAltEditorProps = {
  alt: string;
  action: (alt: string) => Promise<AdminActionOutcome>;
};

export function MediaAltEditor({ alt, action }: MediaAltEditorProps) {
  const [value, setValue] = useState(alt);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const id = useId();

  function save() {
    setMessage(null);
    startTransition(async () => {
      const outcome = await action(value);
      setMessage(outcome.ok ? { ok: true, text: "Teks alternatif tersimpan." } : { ok: false, text: outcome.message });
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <Field label="Teks alternatif" htmlFor={id}>
        <Input id={id} value={value} maxLength={200} onChange={(event) => setValue(event.target.value)} />
      </Field>
      <div>
        <Button type="button" variant="secondary" disabled={pending} onClick={save}>
          Simpan teks alternatif
        </Button>
      </div>
      {message ? (
        <p role={message.ok ? "status" : "alert"} className={message.ok ? "text-sm text-foreground" : "text-sm font-medium text-danger"}>
          {message.text}
        </p>
      ) : null}
    </div>
  );
}
