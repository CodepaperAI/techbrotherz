import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";

import { LocalInfoCard } from "@/components/blocks/LocalInfoCard";
import { PageShell } from "@/components/blocks/PageShell";
import { RelatedLinks } from "@/components/blocks/RelatedLinks";
import { ScopedFaqs } from "@/components/blocks/ScopedFaqs";
import { Card } from "@/components/primitives/Card";
import { Container } from "@/components/primitives/Container";
import { Heading } from "@/components/primitives/Heading";
import { PillButton } from "@/components/primitives/PillButton";
import { Section } from "@/components/primitives/Section";
import { factHref, SHARED_FACTS } from "@/lib/content/local-shared";
import { PLACES, placeContent } from "@/lib/content/places";
import { buildPriceContext } from "@/lib/content/prices";
import { composeFaqs, globalLinks } from "@/lib/faq/scoping";
import { route, shouldRenderLink } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { localBusiness, organization, service, webPage, website } from "@/lib/seo/schema";
import { SITE, TEL_HREF } from "@/lib/site";
import {
  getAllFaqs,
  getReviewSummary,
  getSiteSettings,
} from "@/lib/data";

export const revalidate = 3600;

/**
 * Three place pages, at two different depths. Everything else under
 * /locations/ is a 404, which retires the seven cut neighbourhood URLs and
 * /locations/airdrie without needing redirects, because none of them were ever
 * live. content/local-inventory.md records why.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return PLACES.map((entry) => ({ place: entry.segments }));
}

interface PageProps {
  params: Promise<{ place: string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { place } = await params;
  const path = `/locations/${place.join("/")}`;
  const content = placeContent(path);

  if (!content) {
    return buildMetadata({
      title: "Location not found",
      description: "That location page is not part of the TechBrotherz site.",
      path,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: content.seoTitle,
    description: content.seoDescription,
    path: content.path,
  });
}

export default async function PlacePage({ params }: PageProps) {
  const { place } = await params;
  const content = placeContent(`/locations/${place.join("/")}`);

  if (!content) notFound();

  const [settings, reviews, allFaqs] = await Promise.all([
    getSiteSettings(),
    getReviewSummary(),
    getAllFaqs(),
  ]);

  const path = content.path;
  const warrantyDays = settings?.warrantyDays ?? 60;
  const waitMinutes = settings?.typicalWaitMinutes ?? 30;

  const ctx = buildPriceContext({ warrantyDays, waitMinutes });

  const faqs = composeFaqs({
    path,
    pageSpecific: content.faqs(ctx),
    globalLinks: globalLinks(allFaqs, content.globalCategories, 2),
  });

  const schema = [
    organization(settings ?? {}),
    website(settings ?? {}),
    // One business, one @id, identical on every location page. A place page
    // that invented its own variation to look more local would be describing a
    // second business that does not exist.
    localBusiness(settings ?? {}, reviews),
    webPage({
      type: "WebPage",
      name: content.h1,
      description: content.seoDescription,
      path,
      speakableSelectors: ['[data-speakable="answer"]'],
      dateModified: settings?._updatedAt,
    }),
    service({
      name: `Device repair, ${content.crumbLabel}`,
      description: content.seoDescription,
      path,
      serviceType: "Device repair",
    }),
    faqs.schema,
  ];

  const fullFacts = content.facts.filter((use) => use.treatment === "full");
  const mentions = content.facts.filter((use) => use.treatment === "mention");

  return (
    <PageShell
      path={path}
      eyebrow={content.eyebrow}
      title={content.h1}
      crumbLabel={content.crumbLabel}
      lead={content.lead(ctx)}
      answerBox={{
        answer: content.answer(ctx),
        keyFacts: content.keyFacts(ctx),
        lastUpdated: settings?._updatedAt,
      }}
      schema={schema}
    >
      {/* ------------------------------------------------- NAP and the map */}
      <Section className="pt-0 md:pt-0 lg:pt-0" aria-labelledby="nap-heading">
        <Heading
          level={2}
          id="nap-heading"
          eyebrow="The shop"
          lead="One address, one counter, and the same details on every page of this site."
        >
          Address, hours and directions
        </Heading>

        <div className="mt-10">
          <LocalInfoCard heading="TechBrotherz" headingLevel={3} />
        </div>
      </Section>

      {/* ---------------------------------------------------------- prose */}
      {content.sections(ctx).map((section, index) => (
        <Section
          key={section.heading}
          variant={index % 2 === 0 ? "tint" : "light"}
          aria-labelledby={`prose-${index}`}
        >
          <Heading level={2} id={`prose-${index}`}>
            {section.heading}
          </Heading>
          <div className="measure mt-6 space-y-5">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="type-body text-tb-muted">
                {paragraph}
              </p>
            ))}
          </div>
        </Section>
      ))}

      {/* --------------------------------------- shared facts, where borrowed */}
      {mentions.length > 0 && (
        <Section aria-labelledby="facts-heading">
          <Heading level={2} id="facts-heading" eyebrow="Worth knowing">
            Getting here, in short
          </Heading>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {mentions.map((use) => (
              <Card key={use.fact}>
                <h3 className="type-h3 text-tb-text">{SHARED_FACTS[use.fact].label}</h3>
                <p className="type-body text-tb-muted mt-2">{use.sentence}</p>
                <Link
                  href={factHref(use.fact)}
                  className="text-tb-green-deep mt-4 inline-flex items-center gap-1.5 hover:underline"
                >
                  The full version
                  <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} />
                </Link>
              </Card>
            ))}
          </div>
        </Section>
      )}

      {/* ------------------------------------------- neighbourhood sections */}
      {content.neighbourhoods && content.neighbourhoods.length > 0 && (
        <Section variant="tint" aria-labelledby="areas-heading">
          <Heading
            level={2}
            id="areas-heading"
            eyebrow="Areas we serve"
            lead="Sections rather than separate pages, because a page needs facts of its own and these are neighbourhoods around one shop."
          >
            Which areas does TechBrotherz serve?
          </Heading>

          <div className="mt-10 space-y-8">
            {content.neighbourhoods.map((area) => (
              <div key={area.id} id={area.id} className="scroll-mt-28">
                <h3 className="type-h3 text-tb-text">{area.name}</h3>
                <div className="measure mt-3 space-y-3">
                  {area.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)} className="type-body text-tb-muted">
                      {paragraph}
                    </p>
                  ))}
                </div>
                {!area.verified && (
                  <p className="type-caption text-tb-muted mt-3">
                    Directions for this area are not published because they could not be verified.
                    Phone {SITE.phone} and we will give you the route from your end.
                  </p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ----------------------------------------------------- what we fix */}
      <Section aria-labelledby="repairs-heading">
        <Heading
          level={2}
          id="repairs-heading"
          eyebrow="What we repair"
          lead="Each page below carries the prices and the detail for that service rather than repeating them here."
        >
          What can you get repaired here?
        </Heading>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {content.servicePaths
            .filter((href) => shouldRenderLink(href))
            .map((href) => (
              <li key={href}>
                <Link
                  href={href}
                  className="border-tb-border bg-tb-white rounded-card hover:border-tb-green-deep block h-full border px-5 py-4 transition-colors duration-[180ms]"
                >
                  {route(href)?.label ?? href}
                </Link>
              </li>
            ))}
        </ul>
      </Section>

      {/* ---------------------------------------------------------- faqs */}
      <ScopedFaqs
        faqs={faqs}
        id="place-faq-heading"
        heading={`Questions about finding TechBrotherz${content.crumbLabel === "Calgary" ? "" : ` from ${content.crumbLabel}`}`}
        variant="tint"
      />

      {/* ------------------------------------------------------- related */}
      <Section aria-labelledby="related-heading">
        <h2 id="related-heading" className="sr-only">
          Related pages
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <RelatedLinks
            title="Repairs by device"
            links={[
              ...content.brandPaths.map((href) => ({ label: route(href)?.label ?? href, href })),
              { label: "Ask for a quote", href: "/contact" },
            ]}
          />
          <RelatedLinks
            title="Other places we serve"
            links={[
              ...content.siblings
                .filter((href) => shouldRenderLink(href))
                .map((href) => ({ label: route(href)?.label ?? href, href })),
              { label: "Areas we serve", href: "/locations" },
              { label: "Directions, parking and opening hours", href: "/contact" },
            ]}
          />
        </div>
      </Section>

      {/* ------------------------------------------------------ cta band */}
      <Section variant="dark" contained={false}>
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <h2 className="type-h2 text-tb-white">Come in, or call first</h2>
              <p className="type-lead measure text-tb-muted-dark mt-4">
                TechBrotherz is at {SITE.street} in {SITE.city}. No appointment, and most phone
                repairs are finished in about {waitMinutes} minutes at the counter.
                {fullFacts.length > 0 ? " Everything you need to find us is on this page." : ""}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <PillButton href={TEL_HREF} withArrow={false}>
                Call {SITE.phone}
              </PillButton>
              <PillButton href="/contact" variant="ghostOnDark">
                Ask for a quote
              </PillButton>
            </div>
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}
