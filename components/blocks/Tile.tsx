import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * The neighbourhood row from the reference screenshot.
 *
 * A full-width bar in --tb-paper-2, a green arrow, then the name. Two columns
 * on desktop and one on mobile. It exists because a list of fourteen place
 * names as plain links reads as a footer, and the same fourteen as filled rows
 * reads as coverage, which is the job that section is doing.
 *
 * Renders as a link where a page exists and as a plain row where one does not,
 * because the Phase 6 local-fact rule means several areas are named honestly
 * without having earned a URL of their own.
 */
export interface TileProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
}

const BASE =
  "group bg-tb-paper-2 rounded-tile flex items-center gap-3 px-4 py-3.5 text-left " +
  "transition-colors duration-[--duration-hover] ease-[--ease-out]";

function Arrow() {
  return (
    <span
      aria-hidden="true"
      className={
        "text-tb-green shrink-0 transition-transform duration-[--duration-hover] " +
        "ease-[--ease-out] group-hover:translate-x-1 motion-reduce:transition-none " +
        "motion-reduce:group-hover:translate-x-0"
      }
    >
      &#8594;
    </span>
  );
}

export function Tile({ children, href, className }: TileProps) {
  const label = <span className="text-tb-ink type-body font-medium">{children}</span>;

  if (!href) {
    return (
      <div className={cn(BASE, className)}>
        <Arrow />
        {label}
      </div>
    );
  }

  return (
    <Link href={href} className={cn(BASE, "hover:bg-tb-white", className)}>
      <Arrow />
      {label}
    </Link>
  );
}

/** Two columns on desktop, one on mobile. */
export function TileGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("grid gap-3 sm:grid-cols-2", className)}>{children}</div>;
}
