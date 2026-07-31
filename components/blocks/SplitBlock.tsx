import Image from "next/image";
import { Check } from "lucide-react";

import { Eyebrow } from "@/components/primitives/Eyebrow";
import { PillButton } from "@/components/primitives/PillButton";
import { cn } from "@/lib/utils";

export interface SplitBlockProps {
  eyebrow?: string;
  heading: string;
  lead?: string;
  /** Exactly three benefits. Each carries a number, not an adjective. */
  checklist: string[];
  cta?: { label: string; href: string };
  image?: { src: string; alt: string };
  /** Swap the image to the right. Alternate this down the page. */
  reverse?: boolean;
  className?: string;
}

/**
 * Alternating image and text block with a three-point checklist and one pill
 * CTA. Stacks with the image first on mobile. DESIGN.md Section 6.10.
 */
export function SplitBlock({
  eyebrow,
  heading,
  lead,
  checklist,
  cta,
  image,
  reverse = false,
  className,
}: SplitBlockProps) {
  const photo = image ?? { src: "/placeholder-photo.svg", alt: "" };
  const isPlaceholder = !image;

  return (
    <div className={cn("grid items-center gap-10 lg:grid-cols-2 lg:gap-16", className)}>
      <div
        className={cn(
          "rounded-image bg-tb-green-soft relative aspect-4/3 w-full overflow-hidden",
          reverse && "lg:order-2",
        )}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          {...(isPlaceholder ? { unoptimized: true, "aria-hidden": true } : {})}
        />
      </div>

      <div className={cn(reverse && "lg:order-1")}>
        {eyebrow ? <Eyebrow className="mb-4">{eyebrow}</Eyebrow> : null}

        <h2 className="type-h2 text-tb-text on-dark:text-tb-white">{heading}</h2>

        {lead ? (
          <p className="type-lead measure text-tb-muted on-dark:text-tb-muted-dark mt-5">{lead}</p>
        ) : null}

        <ul className="mt-8 space-y-4">
          {checklist.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="bg-tb-green-soft mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full"
              >
                <Check size={14} strokeWidth={1.5} className="text-tb-green-deep" />
              </span>
              <span className="type-body text-tb-text on-dark:text-tb-muted-dark">{item}</span>
            </li>
          ))}
        </ul>

        {cta ? (
          <PillButton href={cta.href} className="mt-10">
            {cta.label}
          </PillButton>
        ) : null}
      </div>
    </div>
  );
}
