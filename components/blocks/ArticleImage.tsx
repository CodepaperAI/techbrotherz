import Image from "next/image";

import { isOptimisableImage } from "@/lib/uplift/image-hosts";
import { cn } from "@/lib/utils";

export interface ArticleImageProps {
  src: string | null;
  /** Describes what the photograph shows, never who it is. CLAUDE.md 8.9. */
  alt: string;
  /** Only the article's own hero should set this. Everything else lazy loads. */
  priority?: boolean;
  sizes?: string;
  className?: string;
}

/**
 * The featured image on a blog article or index card.
 *
 * The file lives on Uplift's CDN rather than under public/, which is the one
 * place this site fetches an image from a third party. Three consequences,
 * all handled here rather than at each call site:
 *
 * - **Fixed aspect ratio, `fill` inside it.** The payload carries no
 *   dimensions, and an image without them is layout shift. CLS is 0.000 on
 *   every page measured so far and this is not the change that breaks it.
 * - **A host off the allowlist renders unoptimised** rather than throwing.
 *   See lib/uplift/image-hosts.ts.
 * - **No image renders nothing.** An article without a featured image is a
 *   shorter card, not an empty frame.
 *
 * DESIGN.md: radius 24 on images.
 */
export function ArticleImage({ src, alt, priority = false, sizes, className }: ArticleImageProps) {
  if (!src) return null;

  return (
    <div
      className={cn(
        "rounded-image bg-tb-border/40 relative aspect-3/2 overflow-hidden",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? "(min-width: 1024px) 50vw, 100vw"}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        unoptimized={!isOptimisableImage(src)}
        className="object-cover"
      />
    </div>
  );
}
