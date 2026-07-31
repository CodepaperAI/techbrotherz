import Link from "next/link";

import { cn, formatPrice } from "@/lib/utils";

export interface ModelGridItem {
  /** Full model name. This is the anchor text. Never "view" or "see more". */
  name: string;
  href: string;
  /** Lowest price across this model's repairs. Null renders "Call for quote". */
  fromPrice?: number | null;
}

export interface ModelGridProps {
  items: ModelGridItem[];
  className?: string;
}

/** 4-up on desktop, 2-up on mobile. DESIGN.md Section 6.12. */
export function ModelGrid({ items, className }: ModelGridProps) {
  return (
    <ul className={cn("grid grid-cols-2 gap-4 lg:grid-cols-4", className)}>
      {items.map((item) => {
        const price = formatPrice(item.fromPrice);

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className="rounded-card border-tb-border bg-tb-white hover:border-tb-ink flex h-full flex-col justify-between border p-5 transition-colors duration-[180ms] ease-out"
            >
              <span className="text-tb-text font-medium">{item.name}</span>
              <span className="type-caption tabular text-tb-muted mt-3">
                {price ? `from ${price}` : "Call for quote"}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
