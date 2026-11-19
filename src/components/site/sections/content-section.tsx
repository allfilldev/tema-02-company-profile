import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { joinClassNames } from "@/lib/ui/class-names";
import { SectionHeading } from "./section-heading";
import { WaveEdge } from "./wave-edge";

export type ContentSectionTone = "surface" | "surface-muted" | "inverse";

type ContentSectionProps = {
  id?: string;
  tone?: ContentSectionTone;
  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;
  align?: "left" | "center";
  className?: string;
  children?: ReactNode;
};

const TONE_CLASS_NAMES: Record<ContentSectionTone, string> = {
  surface: "",
  "surface-muted": "relative z-10 bg-surface-muted",
  inverse: "relative z-10 bg-surface-inverse text-surface-inverse-foreground",
};

export function ContentSection({ id, tone = "surface", eyebrow, title, description, align, className, children }: ContentSectionProps) {
  const titleId = id && title ? `${id}-title` : undefined;
  const isInverse = tone === "inverse";

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={joinClassNames("py-16 md:py-24", TONE_CLASS_NAMES[tone], isInverse ? "md:py-28" : "", className)}
    >
      {tone === "surface" ? null : <WaveEdge edge="top" tone={isInverse ? "inverse" : "surface-muted"} />}
      <Container>
        <SectionHeading
          id={titleId}
          eyebrow={eyebrow}
          title={title}
          description={description}
          align={align}
          tone={isInverse ? "dark" : "light"}
        />
        {children}
      </Container>
      {isInverse ? <WaveEdge edge="bottom" tone="inverse" /> : null}
    </section>
  );
}
