import Link from "next/link";
import type { Metadata } from "next";

import { LocalInfoCard } from "@/components/blocks/LocalInfoCard";
import { MapReveal } from "@/components/blocks/MapReveal";
import { Tile, TileGrid } from "@/components/blocks/Tile";
import { ScopedFaqs } from "@/components/blocks/ScopedFaqs";
import { PageShell } from "@/components/blocks/PageShell";
import { Card } from "@/components/primitives/Card";
import { Container } from "@/components/primitives/Container";
import { Heading } from "@/components/primitives/Heading";
import { PillButton } from "@/components/primitives/PillButton";
import { Section } from "@/components/primitives/Section";
import { shouldRenderLink } from "@/lib/routes";
import { getCoreFaqContext } from "@/lib/content/core-context";
import { locationsFaqs } from "@/lib/content/core-faqs";
import { composeFaqs, globalLinks } from "@/lib/faq/scoping";
import { SERVICE_AREAS } from "@/lib/content/service-areas";
import { buildMetadata } from "@/lib/seo/metadata";
import { localBusiness, organization, webPage, website } from "@/lib/seo/schema";
import { SITE, TEL_HREF } from "@/lib/site";
import { getAllFaqs, getLocations, getReviewSummary, getSiteSettings } from "@/lib/data";

export const revalidate = 3600;

const PATH = "/locations";

export const metadata: Metadata = buildMetadata({
  title: "Phone Repair Near Me in Calgary",
  description:
    "TechBrotherz is at 3317 17 Ave SE on International Avenue in Calgary, serving Forest Lawn, southeast Calgary, Chestermere and Airdrie. Walk in, no appointment.",
  path: PATH,
});

export default async function LocationsPage() {
  const [settings, reviews, locations, allFaqs] = await Promise.all([
    getSiteSettings(),
    getReviewSummary(),
    getLocations(),
    getAllFaqs(),
  ]);

  const warrantyDays = settings?.warrantyDays ?? 60;
  const waitMinutes = settings?.typicalWaitMinutes ?? 30;

  /**
   * Only locations with genuinely local content are published in Sanity, and
   * the query already filters on that. A neighbourhood without a real route,
   * a real drive time and real landmarks does not get a card here, because a
   * spun page is worse than no page. CLAUDE.md Section 7.
   */
  const cities = locations.filter((entry) => entry.kind === "city" && !entry.isPrimary);
  const neighbourhoods = locations.filter((entry) => entry.kind === "neighbourhood");
  const primary = locations.find((entry) => entry.isPrimary);

  // FAQ scoping rule, CLAUDE.md Section 8.8. Questions this page can answer
  // with its own numbers, plus at most two pointers to the canonical
  // answers on /faq. Only the page-specific ones reach structured data.
  const coreCtx = await getCoreFaqContext();
  const faqs = composeFaqs({
    path: PATH,
    pageSpecific: locationsFaqs(coreCtx),
    globalLinks: globalLinks(allFaqs, ["location", "walkin"], 2),
  });

  const schema = [
    organization(settings ?? {}),
    website(settings ?? {}),
    localBusiness(settings ?? {}, reviews),
    webPage({
      type: "CollectionPage",
      name: "Areas TechBrotherz serves from its Calgary Store",
      description:
        "TechBrotherz is at 3317 17 Ave SE in Calgary and serves Calgary, Chestermere, Airdrie and the surrounding Calgary communities.",
      path: PATH,
      speakableSelectors: ['[data-speakable="answer"]'],
    }),
    faqs.schema,
  ];

  return (
    <PageShell
      path={PATH}
      eyebrow="Find us"
      title="Phone and computer repair near you in Calgary"
      crumbLabel="Locations"
      lead={
        <>
          TechBrotherz, a walk-in cell phone and computer repair Store at {SITE.street} in{" "}
          {SITE.city}, {SITE.region}, is on the stretch of 17 Avenue SE known as International
          Avenue, in the southeast, a few blocks west of Forest Lawn.
        </>
      }
      answerBox={{
        answer: `TechBrotherz has one Store, at ${SITE.street} in Calgary, in a plaza on International Avenue. It serves Calgary, Chestermere, Airdrie and the surrounding Calgary communities. Parking in front of the store is free, the MAX Purple bus rapid transit line runs along 17 Avenue SE, and no appointment is needed to walk in.`,
        keyFacts: [
          { label: "Address", value: `${SITE.street}, ${SITE.city}, ${SITE.region}` },
          { label: "Area", value: "Forest Lawn, on International Avenue in southeast Calgary" },
          { label: "Transit", value: "MAX Purple runs the length of 17 Avenue SE" },
          { label: "Parking", value: "Free, in the plaza in front of the store" },
          {
            label: "Service area",
            value: "Calgary, Chestermere, Airdrie and the surrounding Calgary communities",
          },
        ],
        lastUpdated: settings?._updatedAt,
      }}
      schema={schema}
    >
      {/* ------------------------------------------------------- the Store */}
      <Section variant="tint" className="pt-0 md:pt-0 lg:pt-0" aria-labelledby="the-shop-heading">
        <Heading level={2} id="the-shop-heading" eyebrow="The Store">
          Where exactly is the TechBrotherz Store?
        </Heading>

        <LocalInfoCard className="mt-10" headingLevel={3} heading="TechBrotherz, Calgary" />

        {/* Added on client request 2026-08, alongside the switch to a
            default-loaded map: the index that routes people to the Store
            should show where the Store is. */}
        <MapReveal
          className="mt-6 h-80 md:h-96"
          src={SITE.googleMapsEmbedUrl}
          title="Map showing TechBrotherz at 3317 17 Ave SE, Calgary"
          addressLine={`${SITE.street}, ${SITE.city}, ${SITE.region}`}
        />

        {primary?.routeDescription ? (
          <p className="type-body measure text-tb-muted mt-8">{primary.routeDescription}</p>
        ) : null}

        {/* The Google Business Profile service-area list, 2026-08. Every tile
            navigates to a page or an anchored section; none is a dead link. */}
        <h3 className="type-h3 text-tb-ink mt-12">Every area we serve</h3>
        <TileGrid className="mt-5">
          {[...SERVICE_AREAS, { name: "Airdrie", href: "/locations/calgary#airdrie" }].map(
            (area) => (
              <Tile key={area.name} href={area.href}>
                {area.name}
              </Tile>
            ),
          )}
        </TileGrid>
      </Section>

      {/* ------------------------------------------------- neighbourhoods */}
      <Section aria-labelledby="areas-heading">
        <Heading
          level={2}
          id="areas-heading"
          eyebrow="Calgary"
          lead="These are the Calgary areas TechBrotherz publishes real directions for. An area only appears here once we can give a genuine route, a real drive time and landmarks locals actually use."
        >
          Which Calgary areas does TechBrotherz serve?
        </Heading>

        {neighbourhoods.length > 0 ? (
          <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {neighbourhoods.map((entry) => {
              const href = `/locations/calgary/${entry.slug}`;
              const body = (
                <>
                  <span className="type-h3 text-tb-text block">{entry.city}</span>
                  <span className="type-caption text-tb-muted mt-2 block">
                    {entry.driveTimeMinutes
                      ? `About ${entry.driveTimeMinutes} minutes from the Store`
                      : "Directions published on the area page"}
                    {entry.distanceKm ? `, ${entry.distanceKm} km` : ""}
                  </span>
                </>
              );

              return (
                <li key={entry._id}>
                  {shouldRenderLink(href) ? (
                    <Link
                      href={href}
                      className="border-tb-border bg-tb-white hover:border-tb-ink rounded-card block border p-6 transition-colors duration-[180ms] ease-out"
                    >
                      {body}
                    </Link>
                  ) : (
                    <div className="border-tb-border bg-tb-white rounded-card block border p-6">
                      {body}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <Card className="border-l-tb-green mt-10 border-l-4">
            <h3 className="type-h3 text-tb-text">Area pages are being written</h3>
            <p className="type-body text-tb-muted mt-3">
              TechBrotherz serves the whole of southeast Calgary from {SITE.street}. Individual area
              pages are published only once they carry a real driving route, a real drive time and
              landmarks locals use, rather than the same paragraph with the name changed.
            </p>
          </Card>
        )}
      </Section>

      {/* --------------------------------------------------- other cities */}
      <Section variant="tint" aria-labelledby="cities-heading">
        <Heading
          level={2}
          id="cities-heading"
          eyebrow="Beyond Calgary"
          lead="Customers travel to the Calgary Store from the communities around the city. There is one Store, so every repair happens at 3317 17 Ave SE."
        >
          Does TechBrotherz serve Chestermere and Airdrie?
        </Heading>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {(cities.length > 0
            ? cities.map((entry) => ({
                name: entry.city ?? "",
                slug: entry.slug ?? "",
                drive: entry.driveTimeMinutes,
                distance: entry.distanceKm,
              }))
            : [
                { name: "Chestermere", slug: "chestermere", drive: null, distance: null },
                { name: "Airdrie", slug: "airdrie", drive: null, distance: null },
              ]
          ).map((entry) => {
            const href = `/locations/${entry.slug}`;
            const body = (
              <>
                <span className="type-h3 text-tb-text block">{entry.name}</span>
                <span className="type-body text-tb-muted mt-2 block">
                  {entry.drive
                    ? `About ${entry.drive} minutes from the Store${entry.distance ? `, ${entry.distance} km` : ""}.`
                    : entry.name === "Airdrie"
                      ? `TechBrotherz repairs devices for Airdrie customers at the Calgary Store, and the honest position is that it is a real drive: Airdrie is north of the city and the Store is in the southeast, down Deerfoot Trail. There is no Airdrie page on this site, because we could not verify enough local detail to write one worth reading.`
                      : `TechBrotherz repairs devices for ${entry.name} customers at the Calgary Store.`}
                </span>
              </>
            );

            return (
              <div key={entry.slug}>
                {shouldRenderLink(href) ? (
                  <Link
                    href={href}
                    className="border-tb-border bg-tb-white hover:border-tb-ink rounded-card block border p-6 transition-colors duration-[180ms] ease-out"
                  >
                    {body}
                  </Link>
                ) : (
                  <div className="border-tb-border bg-tb-white rounded-card border p-6">{body}</div>
                )}
              </div>
            );
          })}
        </div>

        <p className="type-body measure text-tb-muted mt-8">
          Whichever community you travel from, the repair happens at {SITE.street} in {SITE.city},
          the quote is the one described on{" "}
          <Link href="/contact" className="text-tb-green-deep hover:underline">
            how quoting works
          </Link>
          , and the {warrantyDays}-day warranty is the same. Most phone repairs are finished in
          about {waitMinutes} minutes, so travelling in and waiting is usually practical.
        </p>
      </Section>

      {/* ------------------------------------------------------------ faqs */}
      <ScopedFaqs
        faqs={faqs}
        id="page-faq-heading"
        heading="Questions about finding us"
        variant="light"
      />

      <Section variant="dark" contained={false}>
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <h2 className="type-h2 text-tb-white">Come in to {SITE.street}</h2>
              <p className="type-lead measure text-tb-muted-dark mt-4">
                Parking is free in the plaza in front of the store, and MAX Purple stops close by.
                No appointment is needed at any time.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <PillButton href={SITE.googleMapsUrl}>Get directions</PillButton>
              <PillButton href={TEL_HREF} variant="ghostOnDark" withArrow={false}>
                Call {SITE.phone}
              </PillButton>
            </div>
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}
