"use client";

import { useEffect, useRef, useState } from "react";
import { runContentChecks, type ContentCheck, type ContentKind } from "@/lib/seo/content-checks";

type SeoPanelProps = {
  kind: ContentKind;
  siteName: string;
  extraImageAlts?: string[];
};

const MARKDOWN_IMAGE_ALT_PATTERN = /!\[([^\]]*)\]\(/g;
const FAQ_QUESTION_SELECTOR = '[name^="faq["][name$="][question]"]';

function readValue(data: FormData, name: string): string {
  const value = data.get(name);
  return typeof value === "string" ? value : "";
}

function checksFor(form: HTMLFormElement, kind: ContentKind, siteName: string, extraImageAlts: string[]): ContentCheck[] {
  const data = new FormData(form);
  const bodyMd = readValue(data, "bodyMd");
  const faqCount = [...form.querySelectorAll<HTMLInputElement>(FAQ_QUESTION_SELECTOR)].filter((input) => input.value.trim().length > 0).length;

  return runContentChecks({
    kind,
    siteName,
    metaTitle: readValue(data, "metaTitle"),
    metaDescription: readValue(data, "metaDescription"),
    slug: readValue(data, "slug"),
    bodyMd,
    lead: kind === "article" ? readValue(data, "lead") : null,
    faqCount,
    imageAlts: [...extraImageAlts, ...[...bodyMd.matchAll(MARKDOWN_IMAGE_ALT_PATTERN)].map((match) => match[1])],
  });
}

function CheckList({ label, checks }: { label: string; checks: ContentCheck[] }) {
  return (
    <ul aria-label={label} className="flex flex-col gap-2">
      {checks.map((check) => (
        <li key={check.id} data-check={check.id} data-passed={check.passed ? "true" : "false"} className="text-sm text-foreground">
          <span className={check.passed ? "font-semibold text-success" : "font-semibold text-danger"}>{check.passed ? "Lulus" : "Perlu diperbaiki"}</span>
          {": "}
          {check.message}
        </li>
      ))}
    </ul>
  );
}

export function SeoPanel({ kind, siteName, extraImageAlts = [] }: SeoPanelProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [checks, setChecks] = useState<ContentCheck[]>([]);
  const altsKey = extraImageAlts.join("\u0000");

  useEffect(() => {
    const form = rootRef.current?.closest("form");
    if (!form) {
      return;
    }
    const alts = altsKey.length > 0 ? altsKey.split("\u0000") : [];
    const update = () => setChecks(checksFor(form, kind, siteName, alts));
    update();
    form.addEventListener("input", update);
    form.addEventListener("change", update);
    return () => {
      form.removeEventListener("input", update);
      form.removeEventListener("change", update);
    };
  }, [kind, siteName, altsKey]);

  return (
    <section ref={rootRef} aria-labelledby="seo-panel-title" className="flex flex-col gap-4 rounded-2xl bg-surface-muted p-5">
      <h2 id="seo-panel-title" className="font-heading text-lg font-bold text-foreground">
        Pemeriksaan SEO
      </h2>
      <CheckList label="Pemeriksaan wajib" checks={checks.filter((check) => check.severity === "error")} />
      <CheckList label="Saran" checks={checks.filter((check) => check.severity === "warning")} />
    </section>
  );
}
