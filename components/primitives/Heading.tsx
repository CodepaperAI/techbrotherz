import { Children, type ReactNode } from "react";

import { Eyebrow } from "@/components/primitives/Eyebrow";
import { cn, titleCase } from "@/lib/utils";

export interface HeadingProps {
  /** 1 for the page H1. Exactly one per page. Never skip a level. */
  level: 1 | 2 | 3;
  children: ReactNode;
  /** Renders an Eyebrow above the heading with the correct 16px gap. */
  eyebrow?: string;
  /** Renders a lead paragraph below with the correct 20px gap and 68ch cap. */
  lead?: ReactNode;
  align?: "left" | "centre";
  className?: string;
  id?: string;
}

const LEVEL_CLASS = {
  1: "type-h1",
  2: "type-h2",
  3: "type-h3",
} as const;

/**
 * Heading plus its optional eyebrow and lead paragraph, spaced to the design
 * system so the three never drift apart. DESIGN.md Sections 4.2 and 6.4.
 */
export function Heading({
  level,
  children,
  eyebrow,
  lead,
  align = "left",
  className,
  id,
}: HeadingProps) {
  const Tag = `h${level}` as const;
  const centred = align === "centre";

  return (
    <div className={cn(centred && "flex flex-col items-center text-center", className)}>
      {eyebrow ? <Eyebrow className="mb-4">{eyebrow}</Eyebrow> : null}

      <Tag id={id} className={cn(LEVEL_CLASS[level], "text-tb-text on-dark:text-tb-white")}>
        {/* Title Case at render, string nodes only, so headings holding JSX
            (the home H1's coloured span) keep their markup. The heading rule
            lives in titleCase(); prose surfaces never pass through here. */}
        {Children.map(children, (child) => (typeof child === "string" ? titleCase(child) : child))}
      </Tag>

      {lead ? (
        <p
          className={cn(
            "type-lead measure text-tb-muted on-dark:text-tb-muted-dark mt-5",
            centred && "mx-auto",
          )}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}
