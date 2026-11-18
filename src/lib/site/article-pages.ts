const ARTICLES_PATH = "/artikel";
const PAGE_PARAM_PATTERN = /^[1-9][0-9]*$/;
const FIRST_PAGINATED_PAGE = 2;

export function parseArticlePageParam(raw: string): number | null {
  if (!PAGE_PARAM_PATTERN.test(raw)) {
    return null;
  }

  const page = Number(raw);
  return Number.isSafeInteger(page) && page >= FIRST_PAGINATED_PAGE ? page : null;
}

export function articlePageHref(page: number): string {
  return page <= 1 ? ARTICLES_PATH : `${ARTICLES_PATH}/halaman/${page}`;
}
