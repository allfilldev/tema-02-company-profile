import Link from "next/link";
import { joinClassNames } from "@/lib/ui/class-names";

type BrandLogoTone = "on-dark" | "on-light";

const NAME_CLASS_NAMES: Record<BrandLogoTone, string> = {
  "on-dark": "text-surface-inverse-foreground",
  "on-light": "text-primary",
};

const MARK_CLASS_NAMES: Record<BrandLogoTone, string> = {
  "on-dark": "bg-surface-inverse-foreground text-surface-inverse",
  "on-light": "bg-primary text-primary-foreground",
};

const ROOT_CLASS_NAME = "inline-flex min-h-11 items-center gap-2";
const MARK_BASE_CLASS_NAME =
  "inline-flex size-9 shrink-0 items-center justify-center rounded-lg font-heading text-lg font-bold";
const NAME_BASE_CLASS_NAME = "font-heading text-lg font-bold tracking-tight";

export type BrandLogoProps = {
  tone: BrandLogoTone;
  name: string;
  href?: string;
  className?: string;
};

export function BrandLogo({ tone, name, href, className }: BrandLogoProps) {
  const content = (
    <>
      <span aria-hidden="true" className={joinClassNames(MARK_BASE_CLASS_NAME, MARK_CLASS_NAMES[tone])}>
        {name.trim().charAt(0).toUpperCase()}
      </span>
      <span className={joinClassNames(NAME_BASE_CLASS_NAME, NAME_CLASS_NAMES[tone])}>{name}</span>
    </>
  );
  const resolvedClassName = joinClassNames(ROOT_CLASS_NAME, className);

  if (href) {
    return (
      <Link href={href} className={resolvedClassName}>
        {content}
      </Link>
    );
  }

  return <span className={resolvedClassName}>{content}</span>;
}
