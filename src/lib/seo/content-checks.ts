import { analyzeHeadings } from "@/lib/markdown/headings";
import { countLinks } from "@/lib/markdown/links";
import { countWords } from "@/lib/markdown/words";
import { isValidSlug } from "@/lib/text/slug";
import {
  ARTICLE_WORDS_MAX,
  ARTICLE_WORDS_MIN,
  FAQ_MAX,
  FAQ_MIN,
  H2_MAX,
  H2_MIN,
  INTERNAL_LINKS_MAX,
  INTERNAL_LINKS_MIN,
  LEAD_WORDS_MAX,
  LEAD_WORDS_MIN,
  META_DESCRIPTION_MAX,
  META_DESCRIPTION_MIN,
  OUTBOUND_LINKS_MAX,
  OUTBOUND_LINKS_MIN,
  TITLE_MAX,
  TITLE_MIN,
} from "@/lib/seo/limits";
import { buildPageTitle, maxMetaTitleLength } from "@/lib/seo/title";

export type ContentKind = "article" | "service" | "portfolio";

export type ContentCheckId =
  | "meta-title-length"
  | "meta-description-length"
  | "slug-format"
  | "image-alt"
  | "slug-clean"
  | "heading-structure"
  | "h2-count"
  | "word-count"
  | "lead-length"
  | "faq-count"
  | "internal-links"
  | "outbound-links";

export type ContentCheck = {
  id: ContentCheckId;
  severity: "error" | "warning";
  passed: boolean;
  message: string;
};

export type ContentCheckInput = {
  kind: ContentKind;
  siteName: string;
  metaTitle: string;
  metaDescription: string;
  slug: string;
  bodyMd: string;
  lead: string | null;
  faqCount: number;
  imageAlts: string[];
};

const YEAR_SEGMENT_PATTERN = /^(19|20)\d{2}$/;
const SLUG_CONJUNCTIONS = ["dan", "atau", "yang", "di", "ke", "dari", "untuk", "dengan", "pada", "serta"];

function isWithin(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

function metaTitleCheck(siteName: string, metaTitle: string): ContentCheck {
  const maxLength = maxMetaTitleLength(siteName);
  const fullLength = buildPageTitle(metaTitle, siteName).length;
  const passed = metaTitle.trim().length > 0 && maxLength > 0 && isWithin(fullLength, TITLE_MIN, TITLE_MAX);
  const message =
    maxLength > 0
      ? `Meta title maksimal ${maxLength} karakter agar judul lengkap tetap ${TITLE_MIN}–${TITLE_MAX} karakter.`
      : `Nama situs terlalu panjang sehingga tidak ada ruang untuk meta title, judul lengkap harus ${TITLE_MIN}–${TITLE_MAX} karakter.`;

  return { id: "meta-title-length", severity: "error", passed, message };
}

function articleChecks(input: ContentCheckInput): ContentCheck[] {
  const headings = analyzeHeadings(input.bodyMd);
  const links = countLinks(input.bodyMd);
  const bodyWords = countWords(input.bodyMd);
  const leadWords = input.lead === null ? 0 : countWords(input.lead);

  return [
    {
      id: "h2-count",
      severity: "warning",
      passed: isWithin(headings.h2Count, H2_MIN, H2_MAX),
      message: `Artikel sebaiknya memiliki ${H2_MIN}–${H2_MAX} heading H2.`,
    },
    {
      id: "word-count",
      severity: "warning",
      passed: isWithin(bodyWords, ARTICLE_WORDS_MIN, ARTICLE_WORDS_MAX),
      message: `Isi artikel sebaiknya ${ARTICLE_WORDS_MIN}–${ARTICLE_WORDS_MAX} kata.`,
    },
    {
      id: "lead-length",
      severity: "warning",
      passed: isWithin(leadWords, LEAD_WORDS_MIN, LEAD_WORDS_MAX),
      message: `Lead sebaiknya ${LEAD_WORDS_MIN}–${LEAD_WORDS_MAX} kata.`,
    },
    {
      id: "faq-count",
      severity: "warning",
      passed: isWithin(input.faqCount, FAQ_MIN, FAQ_MAX),
      message: `FAQ sebaiknya berisi ${FAQ_MIN}–${FAQ_MAX} pertanyaan.`,
    },
    {
      id: "internal-links",
      severity: "warning",
      passed: isWithin(links.internal, INTERNAL_LINKS_MIN, INTERNAL_LINKS_MAX),
      message: `Artikel sebaiknya memuat ${INTERNAL_LINKS_MIN}–${INTERNAL_LINKS_MAX} tautan internal.`,
    },
    {
      id: "outbound-links",
      severity: "warning",
      passed: isWithin(links.external, OUTBOUND_LINKS_MIN, OUTBOUND_LINKS_MAX),
      message: `Artikel sebaiknya memuat ${OUTBOUND_LINKS_MIN}–${OUTBOUND_LINKS_MAX} tautan keluar ke sumber tepercaya.`,
    },
  ];
}

export function runContentChecks(input: ContentCheckInput): ContentCheck[] {
  const headings = analyzeHeadings(input.bodyMd);
  const metaDescriptionLength = input.metaDescription.length;
  const slugIsClean = !input.slug
    .split("-")
    .some((segment) => YEAR_SEGMENT_PATTERN.test(segment) || SLUG_CONJUNCTIONS.includes(segment));

  const checks: ContentCheck[] = [
    metaTitleCheck(input.siteName, input.metaTitle),
    {
      id: "meta-description-length",
      severity: "error",
      passed: isWithin(metaDescriptionLength, META_DESCRIPTION_MIN, META_DESCRIPTION_MAX),
      message: `Meta description harus ${META_DESCRIPTION_MIN}–${META_DESCRIPTION_MAX} karakter.`,
    },
    {
      id: "slug-format",
      severity: "error",
      passed: isValidSlug(input.slug),
      message: "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung tunggal, misalnya cara-menyusun-sop-umkm.",
    },
    {
      id: "image-alt",
      severity: "error",
      passed: input.imageAlts.every((alt) => alt.trim().length > 0),
      message: "Setiap gambar wajib memiliki teks alt yang tidak kosong.",
    },
    {
      id: "slug-clean",
      severity: "warning",
      passed: slugIsClean,
      message: `Slug sebaiknya tanpa tahun dan tanpa kata sambung (${SLUG_CONJUNCTIONS.join(", ")}).`,
    },
    {
      id: "heading-structure",
      severity: "warning",
      passed: headings.h1Count === 0 && headings.deepCount === 0 && !headings.skipsLevel,
      message: "Isi artikel tanpa H1 dan tanpa H4–H6, dengan urutan heading H2 lalu H3 tanpa melompati level.",
    },
  ];

  if (input.kind === "article") checks.push(...articleChecks(input));

  return checks;
}

export function hasBlockingErrors(checks: ContentCheck[]): boolean {
  return checks.some((check) => check.severity === "error" && !check.passed);
}
