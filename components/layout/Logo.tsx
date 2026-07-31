import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Wordmark placeholder.
 *
 * TODO(client): supply the TechBrotherz logo as an SVG. Drop it in
 * public/logo.svg and replace the span below with next/image, keeping the same
 * link wrapper, sizing and aria-label so nothing else changes.
 */
export function Logo({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="TechBrotherz, home"
      className={cn("inline-flex items-baseline gap-1", className)}
    >
      <span
        className={cn(
          "font-display text-xl font-extrabold tracking-tight",
          onDark ? "text-tb-white" : "text-tb-ink",
        )}
      >
        Tech
      </span>
      {/* --tb-green on cream is 2.55:1, which fails AA for text. This is real
          text in the DOM, not an image of a logo, so the contrast rule applies
          to it. Green text on light is --tb-green-deep. DESIGN.md Section 2.1. */}
      <span
        className={cn(
          "font-display text-xl font-extrabold tracking-tight",
          onDark ? "text-tb-green" : "text-tb-green-deep",
        )}
      >
        Brotherz
      </span>
    </Link>
  );
}
