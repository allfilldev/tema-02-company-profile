"use client";

import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MediaPicker } from "@/components/admin/shared/media-picker";
import { MarkdownContent } from "@/components/site/contract/markdown-content";
import type { MediaAsset } from "@/core/domain/shared/media-asset";
import { insertImageMarkdown } from "@/lib/admin/markdown-insert";
import { useFormChangeNotifier } from "@/lib/admin/use-form-change-notifier";

type MarkdownEditorProps = {
  name: string;
  label: string;
  initial: string;
  media: MediaAsset[];
};

type EditorTab = "write" | "preview";

const TAB_CLASS_NAME = "min-h-11 rounded-t-md px-4 text-sm font-semibold";

export function MarkdownEditor({ name, label, initial, media }: MarkdownEditorProps) {
  const [value, setValue] = useState(initial);
  const [tab, setTab] = useState<EditorTab>("write");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [insertions, setInsertions] = useState(0);
  useFormChangeNotifier(textareaRef, insertions);
  const baseId = useId();
  const textareaId = `${baseId}-text`;

  function insertImage(asset: MediaAsset) {
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart ?? value.length;
    const end = textarea?.selectionEnd ?? value.length;
    setValue(insertImageMarkdown(value, start, end, asset, caption).value);
    setInsertions((count) => count + 1);
    setCaption("");
    setPickerOpen(false);
    textarea?.focus();
  }

  return (
    <div className="flex flex-col gap-3">
      <div role="tablist" aria-label="Mode editor" className="flex gap-1 border-b border-border">
        <button
          type="button"
          role="tab"
          id={`${baseId}-tab-write`}
          aria-selected={tab === "write"}
          aria-controls={`${baseId}-panel-write`}
          onClick={() => setTab("write")}
          className={`${TAB_CLASS_NAME} ${tab === "write" ? "bg-primary text-primary-foreground" : "text-foreground"}`}
        >
          Tulis
        </button>
        <button
          type="button"
          role="tab"
          id={`${baseId}-tab-preview`}
          aria-selected={tab === "preview"}
          aria-controls={`${baseId}-panel-preview`}
          onClick={() => setTab("preview")}
          className={`${TAB_CLASS_NAME} ${tab === "preview" ? "bg-primary text-primary-foreground" : "text-foreground"}`}
        >
          Pratinjau
        </button>
      </div>
      <div role="tabpanel" id={`${baseId}-panel-write`} aria-labelledby={`${baseId}-tab-write`} hidden={tab !== "write"} className="flex flex-col gap-3">
        <Field label={label} htmlFor={textareaId}>
          <Textarea id={textareaId} ref={textareaRef} name={name} rows={16} value={value} onChange={(event) => setValue(event.target.value)} />
        </Field>
        <div className="flex flex-wrap items-end gap-3">
          <Field label="Keterangan gambar (opsional)" htmlFor={`${baseId}-caption`} className="min-w-0 flex-1">
            <Input id={`${baseId}-caption`} value={caption} onChange={(event) => setCaption(event.target.value)} />
          </Field>
          <Button type="button" variant="secondary" onClick={() => setPickerOpen(true)}>
            Sisipkan gambar
          </Button>
        </div>
      </div>
      <div role="tabpanel" id={`${baseId}-panel-preview`} aria-labelledby={`${baseId}-tab-preview`} aria-label="Pratinjau" hidden={tab !== "preview"}>
        <MarkdownContent source={value} />
      </div>
      {pickerOpen ? <MediaPicker media={media} onSelect={insertImage} onClose={() => setPickerOpen(false)} /> : null}
    </div>
  );
}
