import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

export type ChipVariant = "soft" | "solid" | "dark";

export interface ChipProps {
  children: ReactNode;
  variant?: ChipVariant;
  className?: string;
}

const VARIANT_STYLES: Record<ChipVariant, string> = {
  soft: "bg-tb-green-soft text-tb-green-deep",
  solid: "bg-tb-green text-tb-ink",
  dark: "bg-tb-ink-2 text-tb-silver",
};

/** Small rounded label. DESIGN.md Section 6.7. */
export function Chip({ children, variant = "soft", className }: ChipProps) {
  return (
    <span
      className={cn(
        "type-eyebrow rounded-chip inline-flex h-7 items-center px-3",
        VARIANT_STYLES[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
