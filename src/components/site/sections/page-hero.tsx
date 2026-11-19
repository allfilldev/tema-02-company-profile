import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { SiteImage } from "@/components/ui/site-image";
import type { MediaAsset } from "@/core/domain/shared/media-asset";
import { HeroBackdrop, HeroWave } from "./hero-backdrop";

type PageHeroProps = {
  eyebrow?: string | null;
  title: string;
  description?: string | null;
  image?: MediaAsset | null;
  children?: ReactNode;
};

const HERO_IMAGE_SIZES = "(min-width: 1024px) 560px, 100vw";

export function PageHero({ eyebrow, title, description, image, children }: PageHeroProps) {
  const layoutClassName = image ? "grid items-center gap-8 lg:grid-cols-2 lg:gap-12" : "mx-auto max-w-3xl text-center";

  return (
    <div className="relative isolate overflow-hidden bg-surface-inverse text-surface-inverse-foreground">
      <HeroBackdrop sizes={HERO_IMAGE_SIZES} />
      <Container className="pb-24 pt-28 md:pb-36 md:pt-36 lg:pb-40">
        <div className={layoutClassName}>
          <div className="min-w-0">
            {eyebrow ? (
              <p className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-surface-inverse-foreground/90">
                <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-highlight" />
                {eyebrow}
              </p>
            ) : null}
            <h1 className="mt-2 text-4xl font-extrabold tracking-tighter text-surface-inverse-foreground md:text-5xl">{title}</h1>
            {description ? (
              <p className="mt-4 text-base text-surface-inverse-foreground/85 md:text-lg">{description}</p>
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
      <HeroWave />
    </div>
  );
}
