import { cn, titleCase } from "@/lib/utils";

export interface EyebrowProps {
  /** One word or two. Never a sentence. */
  children: string;
  className?: string;
  /** Centred only where a section is deliberately symmetrical. */
  align?: "left" | "center";
}

/**
 * The section marker: a short green rule, then a letterspaced uppercase label.
 *
 * Phase 8 replaced the Phase 1 centred dot-and-label. Left alignment is the
 * point: every section in the reference set opens with a rule and a label hard
 * against the left margin, and that is what gives those pages a column and a
 * rhythm rather than a stack of centred blocks.
 *
 * The label is --tb-green-deep on light, never --tb-green, which is about 2.6:1
 * on paper and fails at 13px. On a dark surface the bright green is correct and
 * has strong contrast, so `on-dark:` swaps it. The rule itself is decorative
 * and carries the bright green on both surfaces.
 */
export function Eyebrow({ children, className, align = "left" }: EyebrowProps) {
  return (
    <p
      className={cn(
        "flex items-center gap-3",
        align === "center" && "justify-center",
        className,
      )}
    >
      <span aria-hidden="true" className="bg-tb-green h-[3px] w-8 shrink-0" />
      <span className="type-eyebrow text-tb-green-deep on-dark:text-tb-green">{titleCase(children)}</span>
    </p>
  );
}
