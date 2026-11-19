import type { ModuleKey } from "@/core/domain/shared/module-key";
import { removeFencedCode } from "@/lib/markdown/code-blocks";
import { isHrefAvailable } from "@/lib/site/href-availability";

export type BodyRuleResult = {
  blocking: string[];
  warnings: string[];
};

const FOOTNOTE_PATTERN = /\[\^[^\]\s]+\]/;
const INLINE_CODE_PATTERN = /`[^`\n]*`/g;
const LINK_PATTERN = /(?<!!)\[[^\]]*\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g;
const FOOTNOTE_MESSAGE = "Catatan kaki tidak didukung. Tulis sumbernya sebagai tautan di dalam kalimat.";

export function checkMarkdownBody(markdown: string, enabledModules: readonly ModuleKey[]): BodyRuleResult {
  const text = removeFencedCode(markdown).replace(INLINE_CODE_PATTERN, "");
  const blocking = new Set<string>();
  const warnings = new Set<string>();

  if (FOOTNOTE_PATTERN.test(text)) {
    blocking.add(FOOTNOTE_MESSAGE);
  }

  for (const match of text.matchAll(LINK_PATTERN)) {
    const href = match[1];
    if (!isHrefAvailable(href, enabledModules)) {
      blocking.add(`Tautan ${href} mengarah ke modul yang dimatikan.`);
    }
    if (/^http:\/\//i.test(href)) {
      warnings.add(`Tautan ${href} belum memakai https.`);
    }
  }

  return { blocking: [...blocking], warnings: [...warnings] };
}
