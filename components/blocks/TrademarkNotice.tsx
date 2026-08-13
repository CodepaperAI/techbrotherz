import { cn } from "@/lib/utils";

/**
 * The independence notice.
 *
 * TechBrotherz is not an authorised service provider for any manufacturer, and
 * a repair site that names iPhone, Galaxy and Pixel throughout should say so
 * plainly rather than leave the impression open. This is also the single
 * cheapest piece of trademark hygiene available: naming devices is fair
 * nominative use, and stating non-affiliation is what keeps it unambiguous.
 *
 * Rendered in the footer site-wide, and again on /repair-prices and every
 * brand hub, which are the pages where manufacturer names appear most densely.
 */
export const TRADEMARK_NOTICE =
  "All product names, logos and brands are the property of their respective owners. " +
  "TechBrotherz is an independent repair Store and is not affiliated with, authorised by, " +
  "or endorsed by Apple, Samsung, Google or any other manufacturer.";

export interface TrademarkNoticeProps {
  className?: string;
  /** "footer" is quieter, for the site-wide placement. */
  tone?: "footer" | "page";
}

export function TrademarkNotice({ className, tone = "page" }: TrademarkNoticeProps) {
  return (
    <p
      className={cn(
        "type-caption measure",
        tone === "footer" ? "text-tb-muted-dark" : "text-tb-muted",
        className,
      )}
    >
      {TRADEMARK_NOTICE}
    </p>
  );
}
