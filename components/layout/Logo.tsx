import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Wordmark placeholder.
 *
 * TODO(client): the supplied logo files are JPEGs with baked backgrounds and
 * have not been committed. Supply a transparent PNG or an SVG, drop it in
 * public/logo.svg and replace the spans below with next/image, keeping the
 * same link wrapper, sizing and aria-label so nothing else changes. Until
 * then this stays a typeset wordmark: one word, TechBrotherz, no gap, per the
 * logo itself.
 */
export function Logo({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="TechBrotherz, home"
      className={cn("inline-flex items-baseline", className)}
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
