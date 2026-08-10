import { type ElementType, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface CardProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Raise on hover. Only set this when the whole card is a link. */
  interactive?: boolean;
  padding?: "default" | "tight" | "none";
}

const PADDING = {
  default: "p-6 md:p-8",
  tight: "p-5 md:p-6",
  none: "",
} as const;

/**
 * White fill, 1px rule, 10px radius, no shadow at rest. On hover the rule goes
 * green and the card lifts 2px, which is the whole interaction: no shadow bloom,
 * no scale. Inside a dark Section the rule drops away and the fill does the work.
 * DESIGN.md Section 6.6.
 */
export function Card({
  children,
  className,
  as: Tag = "div",
  interactive = false,
  padding = "default",
}: CardProps) {
  return (
    <Tag
      className={cn(
        "rounded-card bg-tb-white text-tb-ink",
        "border-tb-rule on-dark:border-tb-rule-dark border",
        PADDING[padding],
        interactive &&
          "hover:border-tb-green hover:-translate-y-0.5 on-dark:hover:border-tb-green " +
            "transition-[transform,border-color] duration-[--duration-hover] ease-[--ease-out] " +
            "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
