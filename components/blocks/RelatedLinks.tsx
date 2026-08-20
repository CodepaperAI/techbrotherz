import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Card } from "@/components/primitives/Card";
import { cn } from "@/lib/utils";

export interface RelatedLinksProps {
  /**
   * A real phrase or a question, e.g. "Other Iphone models we repair".
   * Never the word "Related" on its own.
   */
  title: string;
  /** 3 to 6 links. Anchor text is always the full descriptive page name. */
  links: { label: string; href: string }[];
  className?: string;
}

/** DESIGN.md Section 6.17. Internal linking rules, CLAUDE.md Section 9. */
export function RelatedLinks({ title, links, className }: RelatedLinksProps) {
  return (
    <Card as="aside" className={cn("", className)}>
      <h2 className="type-h3 text-tb-text">{title}</h2>

      <ul className="divide-tb-border mt-5 divide-y">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group text-tb-text hover:text-tb-green-deep flex items-center justify-between gap-4 py-3"
            >
              <span className="group-hover:underline">{link.label}</span>
              <ArrowUpRight
                aria-hidden="true"
                size={16}
                strokeWidth={1.5}
                className="text-tb-muted group-hover:text-tb-green-deep shrink-0 transition-colors duration-[180ms] ease-out"
              />
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
