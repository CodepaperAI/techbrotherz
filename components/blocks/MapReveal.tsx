import { cn } from "@/lib/utils";

export interface MapRevealProps {
  src: string;
  title: string;
  addressLine: string;
  className?: string;
}

/**
 * The Google Maps embed, shown without a click.
 *
 * This was a click-to-reveal placeholder until the client asked for the map
 * to load by default (2026-08). The performance concern that justified the
 * click gate is handled differently now: every mount of this component sits
 * well below the fold, so the iframe's native `loading="lazy"` defers the
 * third-party request until the visitor scrolls near it. The LCP element is
 * never this map, and the parent supplies fixed dimensions so nothing shifts
 * when it arrives.
 *
 * The address stays in the accessibility tree as real text, because the map
 * carries no SEO value: the address and the LocalBusiness structured data are
 * what search engines read.
 */
export function MapReveal({ src, title, addressLine, className }: MapRevealProps) {
  return (
    <div className={cn("bg-tb-paper-2 rounded-image relative overflow-hidden", className)}>
      <iframe
        src={src}
        title={title}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 size-full border-0"
      />
      <span className="sr-only">{addressLine}</span>
    </div>
  );
}
