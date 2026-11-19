import { SiteImage } from "@/components/ui/site-image";
import { joinClassNames } from "@/lib/ui/class-names";

type BlobImageProps = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

const BLOB_IMAGE_SIZE = 800;

export function BlobImage({ src, alt, sizes, priority = false, className }: BlobImageProps) {
  return (
    <div className={joinClassNames("shape-blob aspect-square overflow-hidden bg-secondary shadow-soft", className)}>
      <SiteImage
        media={{ id: src, url: src, alt, width: BLOB_IMAGE_SIZE, height: BLOB_IMAGE_SIZE }}
        priority={priority}
        sizes={sizes}
        className="size-full object-cover"
      />
    </div>
  );
}
