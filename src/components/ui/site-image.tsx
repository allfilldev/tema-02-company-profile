import Image from "next/image";
import type { MediaAsset } from "@/core/domain/shared/media-asset";
import { joinClassNames } from "@/lib/ui/class-names";

type SiteImageProps = {
  media: MediaAsset;
  priority?: boolean;
  eager?: boolean;
  sizes?: string;
  className?: string;
};

export function SiteImage({ media, priority = false, eager = false, sizes, className }: SiteImageProps) {
  const loading = eager && !priority ? "eager" : undefined;

  return (
    <Image
      src={media.url}
      alt={media.alt}
      width={media.width}
      height={media.height}
      preload={priority}
      loading={loading}
      sizes={sizes}
      className={joinClassNames("h-auto max-w-full", className)}
    />
  );
}
