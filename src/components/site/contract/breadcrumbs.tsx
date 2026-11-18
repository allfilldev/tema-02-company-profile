import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/seo/json-ld";

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const lastIndex = items.length - 1;

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
        {items.map((item, index) => (
          <li key={item.path} className="flex items-center gap-2">
            {index === lastIndex ? (
              <span aria-current="page" className="font-medium text-foreground">
                {item.name}
              </span>
            ) : (
              <>
                <Link href={item.path} className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-primary">
                  {item.name}
                </Link>
                <span aria-hidden="true">/</span>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
