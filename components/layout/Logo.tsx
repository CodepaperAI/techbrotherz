import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * The TechBrotherZ logo, redrawn as vector from the client's own mark 2026-08.
 *
 * This reproduces their brand rather than inventing one: the green circle, the
 * phone character, and the TechBrotherZ wordmark with its capital Z. The
 * original raster carried an antenna, a waving hand and keypad detail that
 * turn to mush at header size, so the mark is simplified to the essential
 * silhouette the client's customers recognise: the circle, the phone, and the
 * glasses. No baked background on any variant.
 *
 * Variants: "full" adds the strapline (footer, large placements), "compact" is
 * mark plus wordmark (header), "icon" is the circular mark alone (favicon,
 * small placements). In the compact header the wordmark hides on the
 * narrowest screens, leaving the icon, per the small-placement rule.
 *
 * Colourways follow the surface: on light, "Tech" is --tb-green-deep (plain
 * --tb-green fails contrast on cream, DESIGN.md Section 10) and "BrotherZ" is
 * ink; on dark, "Tech" is --tb-green and "BrotherZ" is white. The mark itself
 * is self-contained on both surfaces.
 *
 * The link carries the accessible name; the mark is decorative and the
 * wordmark is real text.
 */

export type LogoVariant = "full" | "compact" | "icon";

/**
 * The Z mark, direction C from the /styleguide comparison, wired in on the
 * client's request 2026-08 after they rejected the character reproduction.
 * The capital Z is the one distinctive element of the TechBrotherZ name, and
 * it survives any size. On light: ink square, green Z. On dark: green square,
 * ink Z, because dark-on-green is the site's rule for green fills.
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
  return (
    <Link
      href="/"
      aria-label="TechBrotherz, home"
      className={cn("inline-flex items-center gap-2.5", className)}
    >
      <Mark size={variant === "icon" ? 40 : variant === "full" ? 46 : 40} onDark={onDark} />

      {variant !== "icon" ? (
        <span className={cn("flex-col", variant === "compact" ? "hidden sm:flex" : "flex")}>
          <span className="font-display text-lg leading-none font-extrabold tracking-tight">
            <span className={onDark ? "text-tb-green" : "text-tb-green-deep"}>Tech</span>
            <span className={onDark ? "text-tb-white" : "text-tb-ink"}>BrotherZ</span>
          </span>
          {variant === "full" ? (
            <span
              className={cn(
                "mt-1 text-[0.5625rem] leading-none font-semibold tracking-[0.13em] uppercase",
                onDark ? "text-tb-muted-dark" : "text-tb-muted",
              )}
            >
              CellPhone / Computer Repair
            </span>
          ) : null}
        </span>
      ) : (
        <span className="sr-only">TechBrotherz</span>
      )}
    </Link>
  );
}
