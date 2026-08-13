import { existsSync } from "node:fs";
import path from "node:path";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { RepairIllustration, type RepairSubject } from "@/components/blocks/RepairIllustration";
import { Card } from "@/components/primitives/Card";
import { blurFor, demoImage } from "@/lib/content/images";
import { cn } from "@/lib/utils";

export interface ServiceCardProps {
  title: string;
  /** Two or three lines. Use a number rather than an adjective. */
  description: string;
  /**
   * Demo image slot. Falls back to the illustration when no photograph cleared
   * for this service, and when public/demo/ has been deleted: the demo set is a
   * stand-in for photography the client has not taken and must never be
   * load-bearing. lib/content/images.ts
   */
  image?: string;
  illustration: RepairSubject;
  /** Small tag chips under the description, e.g. Screen, Battery, Charging port. */
  tags?: string[];
  /** Trailing link. Anchor text is the full page name, never "read more". */
  link?: { label: string; href: string };
  sizes?: string;
  className?: string;
}

/**
 * A service in the home grid: media frame, title, two lines, one link.
 *
 * **Every card uses the same media frame**, whichever branch renders. Same 3:2
 * ratio, same image radius, same inset inside the card padding, same hover.
 * That is what lets a photograph and a line drawing sit in one grid: a grid of
 * matched frames reads as intentional, and a grid of a 3:2 photo beside a square
 * icon well reads as broken. Do not give either branch its own geometry.
 */
export function ServiceCard({
  title,
  description,
  image,
  illustration,
  tags,
  link,
  sizes = "(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw",
  className,
}: ServiceCardProps) {
  // Server component, so this runs at build. A slot whose file is missing falls
  // through to the illustration rather than leaving an empty frame.
  const photo = image ? demoImage(image) : undefined;
  const onDisk =
    photo && existsSync(path.join(process.cwd(), "public", photo.file.replace(/^\//, "")));

  return (
    <Card className={cn("flex flex-col", className)}>
      {photo && onDisk ? (
        <div className="rounded-image bg-tb-paper-2 relative aspect-3/2 w-full overflow-hidden">
          <Image
            src={photo.file}
            alt={photo.alt}
            fill
            sizes={sizes}
            loading="lazy"
            placeholder={blurFor(photo.slot) ? "blur" : "empty"}
            blurDataURL={blurFor(photo.slot)}
            className="object-cover"
          />
        </div>
      ) : (
        <RepairIllustration subject={illustration} ratio="3:2" className="w-full" />
      )}

      <h3 className="type-h3 text-tb-text mt-6">{title}</h3>
      <p className="type-body text-tb-muted mt-3">{description}</p>

      {tags && tags.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <li
              key={tag}
              className="type-caption border-tb-border text-tb-muted rounded-chip border px-2.5 py-1"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}

      {/* mt-auto, so the six links sit on one line across a row whatever the
          description length. Six cards with the link floating at six heights is
          the same untidiness the matched media frames exist to avoid. */}
      {link ? (
        <div className="mt-auto pt-6">
          <Link
            href={link.href}
            className="group text-tb-green-deep inline-flex items-center gap-1.5 font-medium hover:underline"
          >
            {link.label}
            <ArrowRight
              aria-hidden="true"
              size={16}
              strokeWidth={1.5}
              className="transition-transform duration-[180ms] ease-out group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      ) : null}
    </Card>
  );
}
