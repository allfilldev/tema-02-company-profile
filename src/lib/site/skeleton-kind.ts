export const SKELETON_KINDS = [
  "home",
  "about",
  "services-index",
  "service-detail",
  "portfolio-index",
  "portfolio-detail",
  "articles-index",
  "article-detail",
  "contact",
  "legal",
] as const;

export type SkeletonKind = (typeof SKELETON_KINDS)[number];

const ABSOLUTE_URL_PATTERN = /^https?:/i;
const RESERVED_ARTICLE_SEGMENT = "halaman";
const LEGAL_SEGMENTS: readonly string[] = ["privasi", "syarat-ketentuan", "kebijakan-editorial"];

function extractPathname(input: string): string {
  let raw = input.trim();

  if (ABSOLUTE_URL_PATTERN.test(raw)) {
    try {
      raw = new URL(raw).pathname;
    } catch {
      return "";
    }
  }

  const end = raw.search(/[?#]/);
  return end === -1 ? raw : raw.slice(0, end);
}

function toSegments(pathname: string): string[] {
  return pathname.split("/").filter((segment) => segment.length > 0);
}

export function skeletonKindForPath(path: string): SkeletonKind {
  const [section, second, third, ...rest] = toSegments(extractPathname(path));

  if (section === undefined) {
    return "home";
  }

  if (second === undefined) {
    if (section === "tentang") return "about";
    if (section === "layanan") return "services-index";
    if (section === "portofolio") return "portfolio-index";
    if (section === "artikel") return "articles-index";
    if (section === "kontak") return "contact";
    if (LEGAL_SEGMENTS.includes(section)) return "legal";
    return "home";
  }

  if (third === undefined) {
    if (section === "layanan") return "service-detail";
    if (section === "portofolio") return "portfolio-detail";
    if (section === "artikel" && second !== RESERVED_ARTICLE_SEGMENT) return "article-detail";
    return "home";
  }

  if (section === "artikel" && second === RESERVED_ARTICLE_SEGMENT && rest.length === 0) {
    return "articles-index";
  }

  return "home";
}
