import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

import { Card } from "@/components/primitives/Card";
import { cn } from "@/lib/utils";

export interface IconCardProps {
  icon: LucideIcon;
  title: string;
  /** Two lines of copy. Use a number rather than an adjective. */
  description: string;
  /** Optional trailing link. Anchor text is the full page name, never "read more". */
  link?: { label: string; href: string };
  className?: string;
}

/** Thin outline icon top-left, then a title and two lines. DESIGN.md Section 6.8. */
export function IconCard({ icon: Icon, title, description, link, className }: IconCardProps) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <span
        aria-hidden="true"
        className="bg-tb-green-soft inline-flex size-14 items-center justify-center rounded-2xl"
      >
        <Icon size={28} strokeWidth={1.5} className="text-tb-green-deep" />
      </span>

      <h3 className="type-h3 text-tb-text mt-6">{title}</h3>
      <p className="type-body text-tb-muted mt-3">{description}</p>

      {link ? (
        <Link
          href={link.href}
          className="group text-tb-green-deep mt-6 inline-flex items-center gap-1.5 font-medium hover:underline"
        >
          {link.label}
          <ArrowRight
            aria-hidden="true"
            size={16}
            strokeWidth={1.5}
            className="transition-transform duration-[180ms] ease-out group-hover:translate-x-0.5"
          />
        </Link>
      ) : null}
    </Card>
  );
}
