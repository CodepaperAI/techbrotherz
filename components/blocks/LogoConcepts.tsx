import { cn } from "@/lib/utils";

/**
 * Three candidate logo directions, rendered on /styleguide for comparison and
 * wired into nothing else. The header keeps the current mark until a
 * direction is chosen.
 *
 * All three share the wordmark rules: Archivo (the site display face), "Tech"
 * in --tb-green-deep on light and --tb-green on dark, "BrotherZ" in ink or
 * white, capital Z preserved.
 *
 * A: wordmark-led, with a TB monogram in a green rounded square for small
 *    placements. No character.
 * B: a minimal phone outline crossed by a green screwdriver. Two shapes, one
 *    accent, says "phone repair" without a face.
 * C: the capital Z as the mark, bold and green, cut into a dark rounded
 *    square. Keeps the one distinctive element of the current brand.
 */

export type ConceptDirection = "a" | "b" | "c";
export type ConceptVariant = "full" | "compact" | "icon";

function MonogramA({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" className="shrink-0">
      <rect width="64" height="64" rx="16" className="fill-tb-green" />
      {/* TB drawn as strokes so it never depends on a loaded font. */}
      {/* T */}
      <path d="M13 22h18M22 22v22" strokeWidth="6" strokeLinecap="round" className="stroke-tb-ink fill-none" />
      {/* B */}
      <path
        d="M38 22v22M38 22h7a5.5 5.5 0 0 1 0 11h-7M38 33h8a5.5 5.5 0 0 1 0 11h-8"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-tb-ink fill-none"
      />
    </svg>
  );
}

function PhoneDriverB({ size, onDark }: { size: number; onDark: boolean }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" className="shrink-0">
      {/* Phone outline. */}
      <rect
        x="19.5"
        y="8.5"
        width="25"
        height="47"
        rx="6"
        strokeWidth="5"
        className={cn("fill-none", onDark ? "stroke-tb-white" : "stroke-tb-ink")}
      />
      {/* Screwdriver at 45 degrees: thick shaft, short handle, both green. */}
      <path
        d="M14 50 38 26"
        strokeWidth="7"
        strokeLinecap="round"
        className="stroke-tb-green fill-none"
      />
      <path
        d="M40 24l8-8"
        strokeWidth="12"
        strokeLinecap="round"
        className="stroke-tb-green fill-none"
      />
    </svg>
  );
}

function ZMarkC({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" className="shrink-0">
      <rect width="64" height="64" rx="16" className="fill-tb-ink" />
      {/* A chunky Z, drawn as one stroke path. */}
      <path
        d="M18 20h28L18 44h28"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-tb-green fill-none"
      />
    </svg>
  );
}

export function ConceptMark({
  direction,
  size = 40,
  onDark = false,
}: {
  direction: ConceptDirection;
  size?: number;
  onDark?: boolean;
}) {
  if (direction === "a") return <MonogramA size={size} />;
  if (direction === "b") return <PhoneDriverB size={size} onDark={onDark} />;
  return <ZMarkC size={size} />;
}

function Wordmark({ onDark, strapline }: { onDark: boolean; strapline: boolean }) {
  return (
    <span className="flex flex-col">
      <span className="font-display text-lg leading-none font-extrabold tracking-tight">
        <span className={onDark ? "text-tb-green" : "text-tb-green-deep"}>Tech</span>
        <span className={onDark ? "text-tb-white" : "text-tb-ink"}>BrotherZ</span>
      </span>
      {strapline ? (
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
  );
}

export function LogoConcept({
  direction,
  variant = "compact",
  onDark = false,
  className,
}: {
  direction: ConceptDirection;
  variant?: ConceptVariant;
  onDark?: boolean;
  className?: string;
}) {
  /* Direction A is wordmark-led: full and compact carry no mark at all. */
  const showMark = variant === "icon" || direction !== "a";

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {showMark ? (
        <ConceptMark direction={direction} size={variant === "full" ? 46 : 40} onDark={onDark} />
      ) : null}
      {variant !== "icon" ? <Wordmark onDark={onDark} strapline={variant === "full"} /> : null}
    </span>
  );
}
