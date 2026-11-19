import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { joinClassNames } from "@/lib/ui/class-names";
import { ArrowCircle } from "./arrow-link";

type RelatedCardProps = {
  href: string;
  title: string;
  summary: string;
  icon?: string;
  featured?: boolean;
};

export function RelatedCard({ href, title, summary, icon, featured = false }: RelatedCardProps) {
  return (
    <Card
      interactive
      className={joinClassNames(
        "relative flex h-full flex-col gap-4",
        featured ? "border-primary bg-primary text-primary-foreground" : "",
      )}
    >
      {icon ? (
        <span
          className={joinClassNames(
            "flex size-14 items-center justify-center rounded-2xl",
            featured ? "bg-surface text-primary" : "bg-primary-soft text-primary",
          )}
        >
          <Icon name={icon} className="size-7 shrink-0" />
        </span>
      ) : null}
      <h3 className={joinClassNames("text-xl font-bold tracking-tight", featured ? "text-primary-foreground" : "text-foreground")}>
        <Link href={href} className="inline-flex min-h-11 items-center after:absolute after:inset-0 after:rounded-2xl">
          {title}
        </Link>
      </h3>
      <p className={joinClassNames("line-clamp-3 flex-1 text-base", featured ? "text-primary-foreground/85" : "text-muted-foreground")}>
        {summary}
      </p>
      <ArrowCircle />
    </Card>
  );
}
