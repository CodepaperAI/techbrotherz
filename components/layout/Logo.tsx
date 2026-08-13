import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * The TechBrotherz logo, designed in-house 2026-08 on the client's request for
 * a different mark, replacing the supplied raster wordmark.
 *
 * Drawn entirely in the design system's own language, so it needs no image
 * request and stays crisp at any size: a rounded square in --tb-green holding
 * a phone with a repair checkmark, drawn in --tb-ink because dark-on-green is
 * the site's rule for green fills, and the wordmark set in the display face
 * with the closing z in green, which carries over the one identity cue from
 * the old wordmark. The descriptor is the exact SITE.descriptor string, NAP
 * rule as ever.
 *
 * The previous client-supplied PNGs stay in public/ untouched, so reverting is
 * a one-line change if the client prefers the old mark after seeing this one.
 *
 * The link carries the accessible name; the mark is decorative and hidden, and
 * the wordmark is real text, so a screen reader announces "TechBrotherz, home"
 * once and search engines read the name as text.
 */
export function Logo({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="TechBrotherz, home"
      className={cn("inline-flex items-center gap-2.5", className)}
    >
      <svg viewBox="0 0 32 32" width="34" height="34" aria-hidden="true" className="shrink-0">
        <rect width="32" height="32" rx="8" className="fill-tb-green" />
        <rect
          x="10.75"
          y="6.75"
          width="10.5"
          height="18.5"
          rx="2.75"
          strokeWidth="2"
          className="fill-none stroke-tb-ink"
        />
        <path
          d="M12.9 16.1l2.3 2.3 4.2-4.9"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="fill-none stroke-tb-ink"
        />
      </svg>

      <span className="flex flex-col">
        <span
          className={cn(
            "font-display text-lg leading-none font-extrabold tracking-tight",
            onDark ? "text-tb-white" : "text-tb-ink",
          )}
        >
          TechBrother
          <span className={onDark ? "text-tb-green" : "text-tb-green-deep"}>z</span>
        </span>
        <span
          className={cn(
            "mt-1 text-[0.5625rem] leading-none font-semibold tracking-[0.13em] uppercase",
            onDark ? "text-tb-muted-dark" : "text-tb-muted",
          )}
        >
          Cell Phone / Computer Repair
        </span>
      </span>
    </Link>
  );
}
