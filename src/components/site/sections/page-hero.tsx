import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { SiteImage } from "@/components/ui/site-image";
import { WaveDivider } from "@/components/ui/wave-divider";
import type { MediaAsset } from "@/core/domain/shared/media-asset";

type PageHeroProps = {
  eyebrow?: string | null;
  title: string;
  description?: string | null;
  image?: MediaAsset | null;
  children?: ReactNode;
};

const HERO_IMAGE_SIZES = "(min-width: 1024px) 560px, 100vw";

export function PageHero({ eyebrow, title, description, image, children }: PageHeroProps) {
  const layoutClassName = image ? "grid items-center gap-8 lg:grid-cols-2 lg:gap-12" : "max-w-3xl";

  return (
    <div className="relative overflow-hidden bg-surface-inverse text-surface-inverse-foreground">
      <Container className="pb-20 pt-10 md:pb-28 md:pt-16">
        <div className={layoutClassName}>
          <div className="min-w-0">
            {eyebrow ? <p className="text-sm font-semibold uppercase tracking-wide text-accent">{eyebrow}</p> : null}
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-surface-inverse-foreground md:text-5xl">{title}</h1>
            {description ? (
              <p className="mt-4 text-lg text-surface-inverse-foreground/80 md:text-xl">{description}</p>
            ) : null}
            {children}
          </div>
          {image ? (
            <div className="overflow-hidden rounded-2xl shadow-soft">
              <SiteImage media={image} priority sizes={HERO_IMAGE_SIZES} className="w-full" />
            </div>
          ) : null}
        </div>
      </Container>
      <WaveDivider position="bottom" tone="surface" />
    </div>
  );
}
