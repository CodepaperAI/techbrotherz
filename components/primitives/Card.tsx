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
 * White fill, 1px border, 20px radius, near-invisible shadow. Inside a dark
 * Section the border and shadow drop away and the white fill does the work.
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
        "rounded-card bg-tb-white text-tb-text shadow-card",
        "border-tb-border on-dark:border-transparent on-dark:shadow-none border",
        PADDING[padding],
        interactive &&
          "hover:shadow-lift on-dark:hover:shadow-none transition-shadow duration-[180ms] ease-out",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
