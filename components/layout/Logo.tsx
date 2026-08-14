import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * The client's original logo, restored at their request 2026-08 after the
 * redrawn character and the Z mark were both set aside, and displayed larger
 * than before (the earlier render was 95x44; the header now shows 132x61 and
 * the footer 160x74). Both files were re-exported from the higher-resolution
 * originals at 200px tall, roughly 3x display size, so the bigger render
 * stays crisp. logo-on-light.png carries the dark wordmark for light
 * surfaces, logo-on-dark.png the white wordmark for dark ones; both are
 * transparent PNGs.
 *
 * The link carries the accessible name, so the image is decorative and its
 * alt stays empty: a screen reader announces "TechBrotherz, home" once.
 */

export type LogoVariant = "full" | "compact" | "icon";

/**
 * The Z mark, kept for the /styleguide logo-directions comparison only. It is
 * no longer wired into the header.
 */
export function Mark({ size = 40, onDark = false }: { size?: number; onDark?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" className="shrink-0">
      <rect width="64" height="64" rx="16" className={onDark ? "fill-tb-green" : "fill-tb-ink"} />
      <path
        d="M18 20h28L18 44h28"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("fill-none", onDark ? "stroke-tb-ink" : "stroke-tb-green")}
      />
    </svg>
  );
}

export function Logo({
  className,
  onDark = false,
  variant = "compact",
}: {
  className?: string;
  onDark?: boolean;
  variant?: LogoVariant;
}) {
  /* The source files are 432x200 and 430x200; both render at a 2.16 ratio. */
  const height = variant === "full" ? 74 : variant === "icon" ? 44 : 61;
  const width = Math.round(height * 2.16);

  return (
    <Link
      href="/"
      aria-label="TechBrotherz, home"
      className={cn("inline-flex items-center", className)}
    >
      <Image
        src={onDark ? "/logo-on-dark.png" : "/logo-on-light.png"}
        alt=""
        width={width}
        height={height}
        priority={!onDark}
      />
    </Link>
  );
}
