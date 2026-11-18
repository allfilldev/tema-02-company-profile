import type { ReactNode } from "react";
import { joinClassNames } from "@/lib/ui/class-names";
import { Container } from "./container";

type SectionProps = {
  id?: string;
  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;
  className?: string;
  children?: ReactNode;
};

export function Section({ id, eyebrow, title, description, className, children }: SectionProps) {
  const titleId = id && title ? `${id}-title` : undefined;
  const hasHeader = Boolean(eyebrow || title || description);

  return (
    <section id={id} aria-labelledby={titleId} className={joinClassNames("py-12 md:py-16", className)}>
      <Container>
        {hasHeader ? (
          <header className="mb-8 max-w-3xl md:mb-12">
            {eyebrow ? <p className="text-sm font-semibold uppercase tracking-wide text-primary">{eyebrow}</p> : null}
            {title ? (
              <h2 id={titleId} className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {title}
              </h2>
            ) : null}
            {description ? <p className="mt-4 text-lg text-muted-foreground">{description}</p> : null}
          </header>
        ) : null}
        {children}
      </Container>
    </section>
  );
}
