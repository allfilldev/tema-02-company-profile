"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { FaqItem } from "@/core/domain/shared/faq-item";

type FaqEditorProps = {
  initial: FaqItem[];
};

type Entry = FaqItem & { key: number };

export function FaqEditor({ initial }: FaqEditorProps) {
  const nextKey = useRef(initial.length);
  const [entries, setEntries] = useState<Entry[]>(() => initial.map((item, index) => ({ ...item, key: index })));

  function update(index: number, patch: Partial<FaqItem>) {
    setEntries((current) => current.map((entry, position) => (position === index ? { ...entry, ...patch } : entry)));
  }

  function remove(index: number) {
    setEntries((current) => current.filter((_, position) => position !== index));
  }

  function move(index: number, offset: number) {
    setEntries((current) => {
      const target = index + offset;
      if (target < 0 || target >= current.length) {
        return current;
      }
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function add() {
    nextKey.current += 1;
    setEntries((current) => [...current, { question: "", answer: "", key: nextKey.current }]);
  }

  return (
    <div className="flex flex-col gap-4">
      {entries.map((entry, index) => (
        <fieldset key={entry.key} className="flex flex-col gap-3 rounded-md border border-border p-4">
          <legend className="px-1 text-sm font-semibold text-foreground">{`Pertanyaan ${index + 1}`}</legend>
          <Field label={`Pertanyaan ${index + 1}`} htmlFor={`faq-${entry.key}-question`}>
            <Input id={`faq-${entry.key}-question`} name={`faq[${index}][question]`} value={entry.question} onChange={(event) => update(index, { question: event.target.value })} />
          </Field>
          <Field label={`Jawaban ${index + 1}`} htmlFor={`faq-${entry.key}-answer`}>
            <Textarea id={`faq-${entry.key}-answer`} name={`faq[${index}][answer]`} rows={3} value={entry.answer} onChange={(event) => update(index, { answer: event.target.value })} />
          </Field>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="ghost" aria-label={`Naikkan pertanyaan ${index + 1}`} disabled={index === 0} onClick={() => move(index, -1)}>
              Naik
            </Button>
            <Button type="button" variant="ghost" aria-label={`Turunkan pertanyaan ${index + 1}`} disabled={index === entries.length - 1} onClick={() => move(index, 1)}>
              Turun
            </Button>
            <Button type="button" variant="ghost" aria-label={`Hapus pertanyaan ${index + 1}`} onClick={() => remove(index)}>
              Hapus
            </Button>
          </div>
        </fieldset>
      ))}
      <div>
        <Button type="button" variant="secondary" onClick={add}>
          Tambah pertanyaan
        </Button>
      </div>
    </div>
  );
}
