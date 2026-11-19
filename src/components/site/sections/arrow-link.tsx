import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/ui/icon";
import { joinClassNames } from "@/lib/ui/class-names";

const ARROW_CLASS_NAME =
  "flex size-9 shrink-0 items-center justify-center rounded-full bg-highlight text-highlight-foreground transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0";

export function ArrowCircle({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={joinClassNames(ARROW_CLASS_NAME, className)}>
      <Icon name="arrow-right" className="size-4 shrink-0" />
    </span>
  );
}

type LinkProps = { href: string; children: ReactNode; className?: string };

export function ArrowLink({ href, children, className }: LinkProps) {
  return (
    <Link
      href={href}
      className={joinClassNames("group inline-flex min-h-11 items-center gap-3 font-semibold text-primary hover:text-primary-hover", className)}
    >
      <span>{children}</span>
      <ArrowCircle />
    </Link>
  );
}

export function PillArrowLink({ href, children, className }: LinkProps) {
  return (
    <Link href={href} className={joinClassNames("motion-press group inline-flex min-h-11 items-center gap-2", className)}>
      <span className="inline-flex min-h-11 items-center rounded-full bg-primary px-6 font-semibold text-primary-foreground transition-colors group-hover:bg-primary-hover">
        {children}
      </span>
      <ArrowCircle className="size-11" />
    </Link>
  );
}
