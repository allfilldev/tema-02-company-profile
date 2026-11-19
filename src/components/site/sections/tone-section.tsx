import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { joinClassNames } from "@/lib/ui/class-names";
import { WaveEdge } from "./wave-edge";

export type SectionTone = "surface" | "surface-muted";

type ToneSectionProps = {
  id?: string;
  tone?: SectionTone;
  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;
  align?: "left" | "center";
  className?: string;
  children?: ReactNode;
};

// Light or muted section with a centered header. The title stays one text node so it is searchable as written;
// muted tones get a wavy top edge.
export function ToneSection({ id, tone = "surface", eyebrow, title, description, align = "center", className, children }: ToneSectionProps) {
  const titleId = id && title ? `${id}-title` : undefined;
  const hasHeader = Boolean(eyebrow || title || description);

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={joinClassNames("py-16 md:py-24", tone === "surface-muted" && "relative z-10 bg-surface-muted", className)}
    >
      {tone === "surface-muted" ? <WaveEdge edge="top" tone="surface-muted" /> : null}
      <Container>
        {hasHeader ? (
          <header className={joinClassNames("mb-10 max-w-3xl md:mb-14", align === "center" && "mx-auto text-center")}>
            {eyebrow ? (
              <p className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground">
                <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-highlight" />
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2 id={titleId} className="mt-3 text-3xl font-extrabold tracking-tighter text-foreground md:text-5xl">
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
