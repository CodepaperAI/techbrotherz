import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * The client-supplied logo, in the variant matching the surface behind it.
 *
 * Two files, both supplied 2026-08: logo-on-light.png carries the dark
 * wordmark for the white header, logo-on-dark.png the white wordmark for the
 * dark footer and the mobile sheet. Both are transparent PNGs processed to 3x
 * the display size. The wordmark reads TechBrotherZ as one word, which is why
 * the typeset two-span fallback this component used to render is gone.
 *
 * The link carries the accessible name, so the image is decorative and its
 * alt stays empty: a screen reader announces "TechBrotherz, home" once.
 */
export function Logo({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="TechBrotherz, home"
      className={cn("inline-flex items-center", className)}
    >
      <Image
        src={onDark ? "/logo-on-dark.png" : "/logo-on-light.png"}
        alt=""
        width={95}
        height={44}
        priority={!onDark}
      />
    </Link>
  );
}
