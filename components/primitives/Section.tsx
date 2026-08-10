import { type ElementType, type ReactNode } from "react";

import { Container } from "@/components/primitives/Container";
import { cn } from "@/lib/utils";

export type SectionVariant = "light" | "dark" | "tint";

export interface SectionProps {
  children: ReactNode;
  /**
   * light: cream page background.
   * tint:  soft green, used to lift a section without a full chapter break.
   * dark:  near-black chapter break. Sets data-surface="dark" so descendants
   *        can restyle with the `on-dark:` variant.
   */
  variant?: SectionVariant;
  className?: string;
  /** Inner container class. Use for grid layout, not for vertical spacing. */
  innerClassName?: string;
  /** Set false to lay out full-bleed content and supply your own Container. */
  contained?: boolean;
  as?: ElementType;
  id?: string;
  "aria-labelledby"?: string;
}

const VARIANT_STYLES: Record<SectionVariant, string> = {
  light: "bg-tb-paper text-tb-ink",
  tint: "bg-tb-paper-2 text-tb-ink",
  dark: "bg-tb-ink text-tb-white",
};

/**
 * Owns vertical rhythm: 72px mobile, 96px tablet, 128px desktop. Dark sections
 * carry an extra 16px at every breakpoint so a chapter break reads heavier than
 * the section above it. Pages never set their own section padding.
 * DESIGN.md Sections 4 and 6.2.
 */
export function Section({
  children,
  variant = "light",
  className,
  innerClassName,
  contained = true,
  as: Tag = "section",
  id,
  "aria-labelledby": ariaLabelledBy,
}: SectionProps) {
  const isDark = variant === "dark";

  return (
    <Tag
      id={id}
      aria-labelledby={ariaLabelledBy}
      data-surface={isDark ? "dark" : "light"}
      className={cn(
        VARIANT_STYLES[variant],
        isDark ? "py-14 md:py-28" : "py-14 md:py-24",
        className,
      )}
    >
      {contained ? <Container className={innerClassName}>{children}</Container> : children}
    </Tag>
  );
}
