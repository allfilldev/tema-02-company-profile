import { SiteImage } from "@/components/ui/site-image";
import { WaveDivider } from "@/components/ui/wave-divider";
import type { MediaAsset } from "@/core/domain/shared/media-asset";

type HeroBackdropProps = {
  image?: MediaAsset | null;
  sizes: string;
};

const OVERLAY_CLASS_NAME = "absolute inset-0 bg-linear-to-b from-surface-inverse/85 via-surface-inverse/75 to-surface-inverse/90";

// Full-bleed duotone photo: grayscale image under a surface-inverse gradient. Never wrapped in Reveal (LCP).
export function HeroBackdrop({ image, sizes }: HeroBackdropProps) {
  return (
    <div aria-hidden={image ? undefined : "true"} className="absolute inset-0 -z-10">
      {image ? (
        <SiteImage media={image} priority sizes={sizes} className="absolute inset-0 h-full! w-full! object-cover grayscale" />
      ) : null}
      <div aria-hidden="true" className={OVERLAY_CLASS_NAME} />
      <div aria-hidden="true" className="shape-blob absolute -left-24 top-24 size-72 bg-primary/30 md:size-96" />
      <div aria-hidden="true" className="shape-blob absolute -bottom-32 -right-16 size-72 bg-highlight/15 md:size-96" />
    </div>
  );
}

export function HeroWave() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-14 md:h-24 lg:h-32">
      <WaveDivider position="bottom" tone="background" className="h-full! translate-y-px" />
    </div>
  );
}
