import Link from "next/link";
import type { ReactNode } from "react";
import { ADMIN_ROUTES } from "@/lib/site/routes";

type PageHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  showBreadcrumb?: boolean;
};

export function PageHeader({ title, description, action, showBreadcrumb = true }: PageHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex min-w-0 flex-col gap-1">
        {showBreadcrumb ? (
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <Link href={ADMIN_ROUTES.root} className="inline-flex min-h-6 items-center hover:text-primary">
              Dashboard
            </Link>
          </nav>
        ) : null}
        <h1 className="break-words font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{title}</h1>
        {description ? <p className="break-words text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="flex shrink-0 flex-wrap gap-2">{action}</div> : null}
    </header>
  );
}
