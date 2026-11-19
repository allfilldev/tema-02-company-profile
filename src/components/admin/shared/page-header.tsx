import Link from "next/link";
import type { ReactNode } from "react";
import { ADMIN_ROUTES } from "@/lib/site/routes";

type PageHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex min-w-0 flex-col gap-1">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <Link href={ADMIN_ROUTES.root} className="inline-flex min-h-6 items-center hover:text-primary">
            Dashboard
          </Link>
        </nav>
        <h1 className="break-words font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
        {description ? <p className="break-words text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="flex shrink-0 flex-wrap gap-2">{action}</div> : null}
    </header>
  );
}
