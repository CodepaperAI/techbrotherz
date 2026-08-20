import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Brand cards, set in our own type with our own device silhouettes.
 *
 * **No manufacturer logos.** Apple's trademark guidelines prohibit third
 * parties from using the Apple logo, and a logo sitting in a card like this
 * one would be a logo used as a mark: it would read as identification or
 * endorsement, and imply authorised service provider status TechBrotherz does
 * not have. Samsung's position is comparable. This is the narrow case the rule
 * in CLAUDE.md Section 8.9 is actually about.
 *
 * Naming the devices is different and is fine. So the card carries a wordmark
 * set in Plus Jakarta Sans and a generic silhouette drawn here.
 *
 * The card also carries **the model range and the starting price**, which is
 * what stops nine cards looking identical. Both are real catalogue data read
 * from Sanity, not decoration: without them a brand card is a name and a
 * number, and nine of those are indistinguishable at a glance.
 *
 * `brand.logo` in Sanity stays empty and functional.
 */

export type DeviceSilhouette = "phone" | "tablet" | "laptop";

export interface BrandCardProps {
  name: string;
  href: string;
  silhouette: DeviceSilhouette;
  /** e.g. "Iphone 4 to Iphone 16". Omitted when the catalogue cannot supply it. */
  range?: string | null;
  modelCount?: number | null;
  /** Formatted, e.g. "$44.99". */
  fromPrice?: string | null;
  /** Renders as a div rather than a link when the target is not built. */
  linked?: boolean;
  className?: string;
}

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/**
 * Generic device outlines at the icon set's stroke weight. Deliberately not a
 * rendering of any specific handset: a recognisable outline in a card slot
 * would carry the same implication a logo does.
 */
function Silhouette({ kind }: { kind: DeviceSilhouette }) {
  if (kind === "phone") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-12 w-12">
        <rect x="16" y="6" width="16" height="36" rx="3.5" {...STROKE} />
        <line x1="21" y1="10.5" x2="27" y2="10.5" {...STROKE} />
        <circle cx="24" cy="37.5" r="1.5" {...STROKE} />
      </svg>
    );
  }

  if (kind === "tablet") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-12 w-12">
        <rect x="10" y="7" width="28" height="34" rx="3" {...STROKE} />
        <circle cx="24" cy="37" r="1.5" {...STROKE} />
        <line x1="21" y1="11" x2="27" y2="11" {...STROKE} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-12 w-12">
      <rect x="9" y="11" width="30" height="21" rx="2.5" {...STROKE} />
      <path d="M4 36h40l-2.5 4h-35Z" {...STROKE} />
      <line x1="21" y1="36" x2="27" y2="36" {...STROKE} />
    </svg>
  );
}

export function BrandCard({
  name,
  href,
  silhouette,
  range,
  modelCount,
  fromPrice,
  linked = true,
  className,
}: BrandCardProps) {
  const body = (
    <>
      {/* The silhouette panel. Tint deepens on hover, per DESIGN.md. */}
      <span className="rounded-image bg-tb-paper-2 text-tb-green-deep group-hover:bg-tb-green/25 flex aspect-3/2 w-full items-center justify-center transition-colors duration-[180ms] ease-out">
        <Silhouette kind={silhouette} />
      </span>

      <span className="mt-5 block">
        <span className="type-h3 text-tb-text block">{name}</span>

        {range ? <span className="type-small text-tb-muted mt-1 block">{range}</span> : null}

        <span className="type-caption text-tb-muted mt-3 flex flex-wrap items-baseline gap-x-3">
          {typeof modelCount === "number" ? (
            <span>
              {modelCount} {modelCount === 1 ? "model" : "models"}
            </span>
          ) : null}
          {fromPrice ? <span className="text-tb-green-deep">From {fromPrice}</span> : null}
        </span>
      </span>
    </>
  );

  const shared =
    "rounded-card border-tb-border bg-tb-white group flex h-full flex-col border p-5 transition-[color,background-color,border-color,transform] duration-[180ms] ease-out";

  if (!linked) {
    return <div className={cn(shared, className)}>{body}</div>;
  }

  return (
    <Link
      href={href}
      className={cn(shared, "hover:border-tb-green-deep hover:-translate-y-0.5", className)}
    >
      {body}
    </Link>
  );
}

/** Which silhouette a brand slug gets. Everything unmapped is a phone. */
export const BRAND_SILHOUETTE: Record<string, DeviceSilhouette> = {
  "apple-Iphone": "phone",
  "samsung-galaxy": "phone",
  "google-pixel": "phone",
  "google-nexus": "phone",
  lg: "phone",
  motorola: "phone",
  htc: "phone",
  "apple-Ipad": "tablet",
  "laptops-desktops": "laptop",
};

/**
 * "Iphone 4 to Iphone 16", from the oldest and newest published models.
 *
 * Returns null rather than a half-formed string when the catalogue cannot
 * supply both ends, because a range with one end is worse than no range.
 */
export function brandRange(oldest?: string | null, newest?: string | null): string | null {
  if (!oldest || !newest) return null;
  if (oldest === newest) return oldest;
  return `${oldest} to ${newest}`;
}
