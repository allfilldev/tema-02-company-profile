import { FIRST_PAGINATED_PAGE } from "@/lib/site/article-pages";

export const PLACEHOLDER_SLUG = "tidak-ditemukan";

export function buildSlugStaticParams(slugs: string[]): { slug: string }[] {
  const values = slugs.length > 0 ? slugs : [PLACEHOLDER_SLUG];
  return values.map((slug) => ({ slug }));
}

export function buildArticlePageStaticParams(pageCount: number): { n: string }[] {
  const pageTotal = Math.max(pageCount - FIRST_PAGINATED_PAGE + 1, 0);
  const pages = Array.from({ length: pageTotal }, (_, index) => FIRST_PAGINATED_PAGE + index);
  const values = pages.length > 0 ? pages : [FIRST_PAGINATED_PAGE];
  return values.map((page) => ({ n: String(page) }));
}
