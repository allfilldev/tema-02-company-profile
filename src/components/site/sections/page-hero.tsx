import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { SiteImage } from "@/components/ui/site-image";
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
    <div className="border-b border-border bg-surface">
      <Container className="py-10 md:py-16">
        <div className={layoutClassName}>
          <div>
            {eyebrow ? <p className="text-sm font-semibold uppercase tracking-wide text-primary">{eyebrow}</p> : null}
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground md:text-5xl">{title}</h1>
            {description ? <p className="mt-4 text-lg text-muted-foreground md:text-xl">{description}</p> : null}
            {children}
          </div>
          {image ? (
            <div className="overflow-hidden rounded-xl border border-border shadow-card">
              <SiteImage media={image} priority sizes={HERO_IMAGE_SIZES} className="w-full" />
            </div>
          ) : null}
        </div>
      </Container>
    </div>
  );
}
