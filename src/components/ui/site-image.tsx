import Image from "next/image";
import type { MediaAsset } from "@/core/domain/shared/media-asset";
import { joinClassNames } from "@/lib/ui/class-names";

type SiteImageProps = {
  media: MediaAsset;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

export function SiteImage({ media, priority = false, sizes, className }: SiteImageProps) {
  return (
    <Image
      src={media.url}
      alt={media.alt}
      width={media.width}
      height={media.height}
      preload={priority}
      sizes={sizes}
      className={joinClassNames("h-auto max-w-full", className)}
    />
  );
}
