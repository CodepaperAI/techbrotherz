import { existsSync } from "node:fs";
import path from "node:path";

import Image from "next/image";

import { blurFor, demoImage } from "@/lib/content/images";
import { cn } from "@/lib/utils";

export interface DemoImageProps {
  slot: string;
  /** Only the home hero should set this. Everything else lazy loads. */
  priority?: boolean;
  /** Layout hint for the browser, per the position this sits in. */
  sizes?: string;
  className?: string;
}

/**
 * A demo photograph, rendered only when the file is actually present.
 *
 * The demo set is a placeholder for photography the client has not taken, so
 * it must not be load-bearing: deleting public/demo/ has to leave a site that
 * still builds and still reads correctly, just without pictures. Checking the
 * file on disk at render time is what guarantees that, rather than trusting a
 * manifest to stay in step with the folder.
 *
 * DESIGN.md: radius 24 on images, no new visual language in this pass.
 */
export function DemoImage({ slot, priority = false, sizes, className }: DemoImageProps) {
  const image = demoImage(slot);
  if (!image) return null;

  // Server component, so this runs at build. A missing file renders nothing
  // rather than a broken image or a build failure.
  const onDisk = path.join(process.cwd(), "public", image.file.replace(/^\//, ""));
  if (!existsSync(onDisk)) return null;

  const blur = blurFor(slot);

  return (
    <div
      className={cn(
        "rounded-image bg-tb-border/40 relative overflow-hidden",
        image.ratio === "4:3" ? "aspect-4/3" : "aspect-3/2",
        className,
      )}
    >
      <Image
        src={image.file}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes={sizes ?? "(min-width: 1024px) 50vw, 100vw"}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        placeholder={blur ? "blur" : "empty"}
        blurDataURL={blur}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
