import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn, titleCase } from "@/lib/utils";
import type { Crumb } from "@/lib/routes";

export type { Crumb };

export interface BreadcrumbsProps {
  /** Do not include Home. It is prepended for you. */
  items: Crumb[];
  className?: string;
}

/**
 * The visible breadcrumb trail. Present on every page except home.
 *
 * The matching BreadcrumbList structured data is emitted by PageShell from the
 * same array, into the page's single @graph, so the visible trail and the
 * schema cannot drift apart. CLAUDE.md Section 9, rule 1.
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const crumbs: Crumb[] = [{ label: "Home", href: "/" }, ...items];

  return (
    <nav aria-label="Breadcrumb" className={cn("type-caption", className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <li key={`${titleCase(crumb.label)}-${index}`} className="flex items-center gap-2">
              {crumb.href && !isLast ? (
                <Link
                  href={crumb.href}
                  className="text-tb-muted hover:text-tb-text on-dark:text-tb-muted-dark on-dark:hover:text-tb-white hover:underline"
                >
                  {titleCase(crumb.label)}
                </Link>
              ) : (
                <span aria-current="page" className="text-tb-text on-dark:text-tb-white">
                  {titleCase(crumb.label)}
                </span>
              )}

              {isLast ? null : (
                <ChevronRight
                  aria-hidden="true"
                  size={14}
                  strokeWidth={1.5}
                  className="text-tb-muted on-dark:text-tb-muted-dark"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
