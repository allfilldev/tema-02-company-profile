import type { ComponentProps } from "react";
import { Section } from "@/components/ui/section";
import { joinClassNames } from "@/lib/ui/class-names";
import { WaveEdge } from "./wave-edge";

export type SectionTone = "surface" | "surface-muted";

type ToneSectionProps = ComponentProps<typeof Section> & {
  tone?: SectionTone;
};

export function ToneSection({ tone = "surface", className, children, ...props }: ToneSectionProps) {
  if (tone === "surface") {
    return (
      <Section className={className} {...props}>
        {children}
      </Section>
    );
  }

  return (
    <Section className={joinClassNames("relative z-10 bg-surface-muted", className)} {...props}>
      <WaveEdge edge="top" tone="surface-muted" />
      {children}
    </Section>
  );
}
