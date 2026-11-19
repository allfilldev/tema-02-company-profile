import Link from "next/link";

type PaginationProps = {
  page: number;
  pageCount: number;
  pageHrefs: string[];
};

const ITEM_BASE_CLASS_NAME = "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-4 font-semibold transition-colors";
const CURRENT_CLASS_NAME = `${ITEM_BASE_CLASS_NAME} bg-primary text-primary-foreground shadow-soft`;
const LINK_CLASS_NAME = `${ITEM_BASE_CLASS_NAME} border border-border bg-surface text-foreground shadow-soft hover:bg-primary-soft hover:text-primary`;
const PREVIOUS_LABEL = "Halaman sebelumnya";
const NEXT_LABEL = "Halaman berikutnya";

export function Pagination({ page, pageCount, pageHrefs }: PaginationProps) {
  if (pageCount <= 1) {
    return null;
  }

  const previousHref = page > 1 ? pageHrefs[page - 2] : undefined;
  const nextHref = page < pageCount ? pageHrefs[page] : undefined;

  return (
    <nav aria-label="Halaman artikel">
      <ul className="flex flex-wrap items-center justify-center gap-2">
        {previousHref ? (
          <li>
            <Link href={previousHref} rel="prev" className={LINK_CLASS_NAME}>
              {PREVIOUS_LABEL}
            </Link>
          </li>
        ) : null}
        {pageHrefs.map((href, index) => {
          const pageNumber = index + 1;
          return (
            <li key={href}>
              {pageNumber === page ? (
                <span aria-current="page" className={CURRENT_CLASS_NAME}>
                  {pageNumber}
                </span>
              ) : (
                <Link href={href} aria-label={`Halaman ${pageNumber}`} className={LINK_CLASS_NAME}>
                  {pageNumber}
                </Link>
              )}
            </li>
          );
        })}
        {nextHref ? (
          <li>
            <Link href={nextHref} rel="next" className={LINK_CLASS_NAME}>
              {NEXT_LABEL}
            </Link>
          </li>
        ) : null}
      </ul>
    </nav>
  );
}
