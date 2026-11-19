import type { ReactNode } from "react";
import { BlobImage } from "@/components/ui/blob-image";
import { Container } from "@/components/ui/container";
import { WaveDivider } from "@/components/ui/wave-divider";
import type { MediaAsset } from "@/core/domain/shared/media-asset";

type HomeHeroProps = {
  eyebrow?: string | null;
  title: string;
  description?: string | null;
  image?: MediaAsset | null;
  children?: ReactNode;
};

const HERO_IMAGE_SIZES = "(min-width: 1024px) 560px, 100vw";

export function HomeHero({ eyebrow, title, description, image, children }: HomeHeroProps) {
  const layoutClassName = image ? "grid items-center gap-10 lg:grid-cols-2 lg:gap-16" : "max-w-3xl";

  return (
    <div className="relative overflow-hidden bg-surface-inverse text-surface-inverse-foreground">
      <div aria-hidden="true" className="shape-blob absolute -left-24 -top-24 size-72 bg-primary/30 md:size-96" />
      <Container className="relative pb-24 pt-12 md:pb-36 md:pt-20">
        <div className={layoutClassName}>
          <div className="min-w-0">
            {eyebrow ? <p className="text-sm font-bold uppercase tracking-widest text-accent">{eyebrow}</p> : null}
            <h1 className="mt-3 text-4xl font-extrabold tracking-tighter text-surface-inverse-foreground md:text-6xl">{title}</h1>
            {description ? <p className="mt-5 text-lg text-surface-inverse-foreground/80 md:text-xl">{description}</p> : null}
            {children}
          </div>
          {image ? (
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div aria-hidden="true" className="shape-blob absolute -bottom-4 -right-4 size-full bg-primary/40" />
              <BlobImage src={image.url} alt={image.alt} sizes={HERO_IMAGE_SIZES} priority className="relative" />
            </div>
          ) : null}
        </div>
      </Container>
      <WaveDivider position="bottom" tone="surface" />
    </div>
  );
}
