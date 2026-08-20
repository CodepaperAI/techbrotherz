import Image from "next/image";

import { RepairIllustration, type RepairSubject } from "@/components/blocks/RepairIllustration";
import { Card } from "@/components/primitives/Card";
import { Chip } from "@/components/primitives/Chip";
import { cn, titleCase } from "@/lib/utils";

export interface StepCardProps {
  /** Rendered in the chip as "Step 1". Never put the number in the title. */
  step: number;
  title: string;
  /** Two lines of copy. */
  description: string;
  image?: {
    src: string;
    /** Descriptive alt naming the device and the action. CLAUDE.md Section 8.1. */
    alt: string;
  };
  /**
   * Line illustration, used where a photograph would be a stock image repeated
   * across dozens of cards. Takes precedence over the placeholder, never over
   * a real photograph. Phase 6.5b.
   */
  illustration?: RepairSubject;
  className?: string;
}

const PLACEHOLDER = {
  src: "/placeholder-photo.svg",
  alt: "",
} as const;

/**
 * Inner rounded photo, a step chip, a title and two lines. 3-up on desktop,
 * 1-up on mobile. DESIGN.md Section 6.9.
 */
export function StepCard({
  step,
  title,
  description,
  image,
  illustration,
  className,
}: StepCardProps) {
  const photo = image ?? PLACEHOLDER;
  const isPlaceholder = !image;

  return (
    <Card className={cn("flex flex-col", className)}>
      {!image && illustration ? (
        <RepairIllustration subject={illustration} ratio="4:3" className="w-full" />
      ) : (
        <div className="rounded-image bg-tb-paper-2 relative aspect-4/3 w-full overflow-hidden">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
            {...(isPlaceholder ? { unoptimized: true, "aria-hidden": true } : {})}
          />
        </div>
      )}

      <Chip className="mt-6 self-start">Step {step}</Chip>
      <h3 className="type-h3 text-tb-text mt-4">{titleCase(title)}</h3>
      <p className="type-body text-tb-muted mt-3">{description}</p>
    </Card>
  );
}
