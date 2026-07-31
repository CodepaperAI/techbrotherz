import { cn } from "@/lib/utils";

export interface EyebrowProps {
  /** One word or two. Never a sentence. Sentence case, never uppercase. */
  children: string;
  className?: string;
}

/**
 * A filled dot in the brand green followed by a short label. Centred above
 * section headings, left-aligned in the hero. DESIGN.md Section 6.3.
 */
export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <p
      className={cn(
        "type-eyebrow text-tb-muted on-dark:text-tb-silver flex items-center gap-2",
        className,
      )}
    >
      <span aria-hidden="true" className="bg-tb-green size-2 shrink-0 rounded-full" />
      {children}
    </p>
  );
}
