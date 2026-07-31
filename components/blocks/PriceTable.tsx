import Link from "next/link";

import { SITE, TEL_HREF } from "@/lib/site";
import { cn, formatMinutes, formatPrice, formatPriceRange } from "@/lib/utils";

export interface PriceRow {
  /** The repair name, e.g. "Screen / LCD replacement". */
  repair: string;
  /** Null when the price is unknown. Never guess a price. */
  price: number | null;
  /** True when the shop quotes in person. Renders "Call for quote". */
  quoteOnly?: boolean;
  /** Renders "from $120" for an entry-level price. */
  from?: boolean;
  /** Renders "$69.99 to $149.99" for a genuine range. */
  priceTo?: number | null;
  turnaroundMinutes?: number | null;
  warrantyDays?: number | null;
  /** Links the repair name to its repair-type page. Internal linking, rule 4. */
  href?: string;
  /** A short qualifier, e.g. "Includes Microsoft Office and security". */
  note?: string;
}

export interface PriceTableProps {
  /**
   * Required. Every price table has a caption naming the device and the city,
   * even when it is visually hidden. Answer engines read it.
   */
  caption: string;
  captionVisible?: boolean;
  rows: PriceRow[];
  /** Column header for the first column. Defaults to "Repair". */
  itemLabel?: string;
  showTime?: boolean;
  showWarranty?: boolean;
  /** Set false when several tables sit together and one shared note follows. */
  showDisclaimer?: boolean;
  className?: string;
}

/**
 * Real table markup with <caption> and <th scope>. Never a div grid.
 * Answer engines extract tables well and a div grid is invisible to them.
 * CLAUDE.md Section 8.3, DESIGN.md Section 6.11.
 */
export function PriceTable({
  caption,
  captionVisible = false,
  rows,
  itemLabel = "Repair",
  showTime = true,
  showWarranty = true,
  showDisclaimer = true,
  className,
}: PriceTableProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="rounded-card border-tb-border bg-tb-white overflow-x-auto border">
        <table className="tabular w-full min-w-[34rem] border-collapse text-left">
          <caption
            className={cn(
              captionVisible
                ? "type-caption text-tb-muted px-6 pt-5 pb-2 text-left"
                : "sr-only-caption",
            )}
          >
            {caption}
          </caption>

          <thead>
            <tr className="bg-tb-green-soft">
              <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-4">
                {itemLabel}
              </th>
              <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-4 md:text-right">
                Price (CAD)
              </th>
              {showTime ? (
                <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-4">
                  Typical time
                </th>
              ) : null}
              {showWarranty ? (
                <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-4">
                  Warranty
                </th>
              ) : null}
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.repair} className="border-tb-border border-t">
                <th scope="row" className="text-tb-text px-6 py-4 text-left align-top font-normal">
                  {row.href ? (
                    <Link href={row.href} className="text-tb-green-deep hover:underline">
                      {row.repair}
                    </Link>
                  ) : (
                    row.repair
                  )}
                  {row.note ? (
                    <span className="type-caption text-tb-muted mt-1 block">{row.note}</span>
                  ) : null}
                </th>

                <td className="text-tb-text px-6 py-4 align-top font-medium md:text-right">
                  <PriceCell row={row} />
                </td>

                {showTime ? (
                  <td className="text-tb-muted px-6 py-4 align-top">
                    {formatMinutes(row.turnaroundMinutes) ??
                      `About ${SITE.typicalWaitMinutes} minutes`}
                  </td>
                ) : null}

                {showWarranty ? (
                  <td className="text-tb-muted px-6 py-4 align-top">
                    {row.warrantyDays ?? SITE.warrantyDays} days
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDisclaimer ? <p className="type-caption text-tb-muted">{SITE.priceDisclaimer}</p> : null}
    </div>
  );
}

/**
 * An unknown price is never a dash, an "N/A" or a guess. It is the words
 * "Call for quote" linked to the phone number. CLAUDE.md Section 3, rule 1.
 */
function PriceCell({ row }: { row: PriceRow }) {
  const formatted = row.quoteOnly
    ? null
    : formatPriceRange(row.price, { from: row.from, to: row.priceTo });

  if (formatted) return <>{formatted}</>;

  return (
    <a href={TEL_HREF} className="text-tb-green-deep font-medium hover:underline">
      Call for quote
    </a>
  );
}

/** Exported for callers that build a single row outside a full table. */
export function formatRowPrice(row: PriceRow): string {
  if (row.quoteOnly) return "Call for quote";
  return formatPriceRange(row.price, { from: row.from, to: row.priceTo }) ?? "Call for quote";
}

export { formatPrice };
