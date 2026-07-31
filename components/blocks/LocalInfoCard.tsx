import { MapPin, Phone } from "lucide-react";

import { MapReveal } from "@/components/blocks/MapReveal";
import { OpenNowBadge } from "@/components/blocks/OpenNowBadge";
import { Card } from "@/components/primitives/Card";
import { PillButton } from "@/components/primitives/PillButton";
import { ADDRESS_LINE, SITE, TEL_HREF, groupedHours } from "@/lib/site";
import { cn } from "@/lib/utils";

export interface LocalInfoCardProps {
  /** Overrides the default heading on a city or neighbourhood page. */
  heading?: string;
  /** Heading level, so the card can sit under an h2 without skipping a level. */
  headingLevel?: 2 | 3;
  className?: string;
}

const MAP_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(
  `${SITE.street}, ${SITE.city}, ${SITE.region}`,
)}&output=embed`;

/**
 * Map, full NAP, hours and directions.
 *
 * The NAP text here must match CLAUDE.md Section 2 character for character,
 * since it is the same string the LocalBusiness structured data emits.
 *
 * The hours table is rendered on the server so crawlers read it. Only the
 * open or closed badge is computed on the client, because that answer depends
 * on the current time in America/Edmonton and would otherwise either be baked
 * into static HTML or cause a hydration mismatch.
 */
export function LocalInfoCard({
  heading = "Find us in Calgary",
  headingLevel = 2,
  className,
}: LocalInfoCardProps) {
  const hours = groupedHours();
  const Title = headingLevel === 2 ? "h2" : "h3";
  const SubTitle = headingLevel === 2 ? "h3" : "h4";

  return (
    <Card className={cn("grid gap-8 lg:grid-cols-2 lg:gap-10", className)}>
      <MapReveal
        src={MAP_EMBED_SRC}
        title={`Map showing TechBrotherz at ${SITE.street}, ${SITE.city}`}
        addressLine={ADDRESS_LINE}
        className="aspect-4/3 w-full lg:aspect-auto lg:min-h-[22rem]"
      />

      <div>
        <Title className="type-h3 text-tb-text">{heading}</Title>

        <address className="mt-4 not-italic">
          <p className="type-body text-tb-text flex items-start gap-2">
            <MapPin
              aria-hidden="true"
              size={18}
              strokeWidth={1.5}
              className="text-tb-green-deep mt-1 shrink-0"
            />
            <span>{ADDRESS_LINE}</span>
          </p>

          <p className="type-body mt-2 flex items-start gap-2">
            <Phone
              aria-hidden="true"
              size={18}
              strokeWidth={1.5}
              className="text-tb-green-deep mt-1 shrink-0"
            />
            <a href={TEL_HREF} className="text-tb-green-deep hover:underline">
              {SITE.phone}
            </a>
          </p>
        </address>

        <div className="mt-6 flex items-center gap-3">
          <SubTitle className="type-eyebrow text-tb-muted">Opening hours</SubTitle>
          <OpenNowBadge />
        </div>

        <table className="mt-3 w-full text-left">
          <caption className="sr-only-caption">
            TechBrotherz opening hours at {SITE.street}, {SITE.city}
          </caption>
          <tbody>
            {hours.map((row) => (
              <tr key={row.label} className="border-tb-border border-b last:border-b-0">
                <th scope="row" className="text-tb-muted py-2.5 pr-4 font-normal">
                  {row.label}
                </th>
                <td className="text-tb-text py-2.5 text-right font-medium">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="type-caption text-tb-muted mt-4">{SITE.appointmentPolicy}.</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <PillButton href={SITE.googleMapsUrl} size="sm">
            Get directions
          </PillButton>
          <PillButton href={TEL_HREF} variant="ghost" size="sm" withArrow={false}>
            Call {SITE.phone}
          </PillButton>
        </div>
      </div>
    </Card>
  );
}
