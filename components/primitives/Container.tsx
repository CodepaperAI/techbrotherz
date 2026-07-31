import { type ElementType, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface ContainerProps {
  children: ReactNode;
  className?: string;
  /** Defaults to a div. Use "header", "nav" or "footer" for landmarks. */
  as?: ElementType;
}

/**
 * Owns horizontal constraint: 1280px max width, 24px gutter on mobile rising
 * to 40px on desktop. Nothing else on a page sets a max width.
 * DESIGN.md Section 6.1.
 */
export function Container({ children, className, as: Tag = "div" }: ContainerProps) {
  return (
    <Tag className={cn("max-w-site mx-auto w-full px-6 md:px-8 lg:px-10", className)}>
      {children}
    </Tag>
  );
}
