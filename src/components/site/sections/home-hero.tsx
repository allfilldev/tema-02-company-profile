import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import type { MediaAsset } from "@/core/domain/shared/media-asset";
import { HeroBackdrop, HeroWave } from "./hero-backdrop";

type HomeHeroProps = {
  eyebrow?: string | null;
  title: string;
  description?: string | null;
  image?: MediaAsset | null;
  children?: ReactNode;
};

const HERO_IMAGE_SIZES = "100vw";

export function HomeHero({ eyebrow, title, description, image, children }: HomeHeroProps) {
  return (
    <div className="relative isolate overflow-hidden bg-surface-inverse text-surface-inverse-foreground">
      <HeroBackdrop image={image} sizes={HERO_IMAGE_SIZES} />
      <Container className="pb-32 pt-32 text-center md:pb-48 md:pt-44 lg:pb-56 lg:pt-48">
        <div className="mx-auto max-w-3xl">
          {eyebrow ? (
            <p className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-surface-inverse-foreground/90">
              <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-highlight" />
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-3 text-4xl font-extrabold tracking-tighter text-surface-inverse-foreground sm:text-5xl lg:text-6xl">{title}</h1>
          {description ? (
            <p className="mx-auto mt-5 max-w-xl text-base text-surface-inverse-foreground/85 md:text-lg">{description}</p>
          ) : null}
          {children}
        </div>
      </Container>
      <HeroWave />
    </div>
  );
}
