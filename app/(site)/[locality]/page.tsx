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
import { LOCAL_PAGES, localContent } from "@/lib/content/local-pages";
import { factHref, SHARED_FACTS } from "@/lib/content/local-shared";
import { buildPriceContext } from "@/lib/content/prices";
import { composeFaqs, globalLinks } from "@/lib/faq/scoping";
import { route, shouldRenderLink } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  itemListOfOffers,
  localBusiness,
  offerFromPriceEntry,
  organization,
  service,
  webPage,
  website,
} from "@/lib/seo/schema";
import { SITE, TEL_HREF } from "@/lib/site";
import { formatPrice } from "@/lib/utils";
import {
  getAllFaqs,
  getAllPricedModels,
  getFlatServices,
  getReviewSummary,
  getSiteSettings,
  getUnlocking,
} from "@/sanity/queries";

export const revalidate = 3600;

/**
 * Only the Tier 5 slugs resolve here. Everything else on this segment is a
 * 404, which is what retires the seven cut neighbourhood URLs, the two Airdrie
 * pages and the second Chestermere page without a redirect.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCAL_PAGES.map((entry) => ({ locality: entry.slug }));
}

interface PageProps {
  params: Promise<{ locality: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locality } = await params;
  const content = localContent(locality);

  if (!content) {
    return buildMetadata({
      title: "Page not found",
      description: "That page is not part of the TechBrotherz site.",
      path: `/${locality}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: content.seoTitle,
    description: content.seoDescription,
    path: `/${content.slug}`,
  });
}

export default async function LocalPage({ params }: PageProps) {
  const { locality } = await params;
  const content = localContent(locality);

  if (!content) notFound();

  const [settings, reviews, models, flatServices, unlocking, allFaqs] = await Promise.all([
    getSiteSettings(),
    getReviewSummary(),
    getAllPricedModels(),
    getFlatServices(),
    getUnlocking(),
    getAllFaqs(),
  ]);

  const path = `/${content.slug}`;
  const warrantyDays = settings?.warrantyDays ?? 60;
  const waitMinutes = settings?.typicalWaitMinutes ?? 30;

  const ctx = buildPriceContext({ models, flatServices, unlocking, warrantyDays, waitMinutes });

  /* ------------------------------------------------------- price table */
  interface Row {
    name: string;
    price: number | null;
    href?: string;
    note?: string;
  }

  let rows: Row[] = [];

  if (content.priceSource.kind === "catalogue") {
    const brands = content.priceSource.brandSlugs ?? [];
    const repairs = content.priceSource.repairSlugs ?? [];

    rows = repairs
      .map((repairSlug) => {
        const found = models
          .filter((model) => brands.includes(model.brandSlug ?? ""))
          .flatMap((model) =>
            (model.prices ?? [])
              .filter(
                (entry) => entry.repair?.slug === repairSlug && typeof entry.price === "number",
              )
              .map((entry) => ({ price: entry.price as number, name: entry.repair?.name ?? "" })),
          );

        if (found.length === 0) return null;
        return {
          name: found[0]?.name ?? repairSlug,
          price: Math.min(...found.map((f) => f.price)),
          note: `${found.length} models priced`,
        } as Row;
      })
      .filter((row): row is Row => row !== null);
  } else {
    rows = (content.priceSource.flatSlugs ?? [])
      .map((slug) => {
        const entry = flatServices.find((item) => item.slug === slug);
        if (!entry) return null;
        return {
          name: entry.name ?? slug,
          price: entry.price ?? null,
          note: entry.priceTo ? `up to ${formatPrice(entry.priceTo)}` : undefined,
        } as Row;
      })
      .filter((row): row is Row => row !== null);
  }

  /* -------------------------------------------------------------- faqs */
  const faqs = composeFaqs({
    path,
    pageSpecific: content.faqs(ctx),
    globalLinks: globalLinks(allFaqs, content.globalCategories, 2),
  });

  /* ------------------------------------------------------------ schema */
  const offers = rows
    .filter((row) => typeof row.price === "number")
    .map((row) =>
      offerFromPriceEntry(
        { repairName: row.name, price: row.price, warrantyDays, url: path },
        { defaultWarrantyDays: warrantyDays, phoneRaw: settings?.phoneRaw },
      ),
    );

  const schema = [
    organization(settings ?? {}),
    website(settings ?? {}),
    // The same business, under the same @id, on every local page. Never a
    // page-specific variation invented to look more local.
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
      name: `${content.serviceType} in ${content.city}`,
      description: content.seoDescription,
      path,
      serviceType: content.serviceType,
    }),
    itemListOfOffers({
      name: `${content.serviceType} prices at TechBrotherz`,
      path,
      offers,
    }),
    faqs.schema,
  ];

  return (
    <PageShell
      path={path}
      eyebrow={content.eyebrow}
      title={content.h1}
      crumbLabel={route(path)?.label}
      lead={content.lead(ctx)}
      answerBox={{
        answer: content.answer(ctx),
        keyFacts: content.keyFacts(ctx),
        lastUpdated: settings?._updatedAt,
      }}
      schema={schema}
    >
      {/* ------------------------------------------------------- prices */}
      {rows.length > 0 && (
        <Section className="pt-0 md:pt-0 lg:pt-0" aria-labelledby="prices-heading">
          <Heading
            level={2}
            id="prices-heading"
            eyebrow="Prices"
            lead="Every price includes the part and the labour. Nothing changes based on where you travel from."
          >
            What does this cost in {content.city}?
          </Heading>

          <div className="border-tb-border bg-tb-white rounded-card mt-10 overflow-x-auto border">
            <table className="w-full min-w-[32rem] border-collapse text-left">
              <caption className="sr-only-caption">
                {content.serviceType} prices at TechBrotherz for {content.city} customers, part and
                labour included
              </caption>
              <thead>
                <tr className="bg-tb-green-soft">
                  <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-3">
                    Repair
                  </th>
                  <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-3">
                    Price
                  </th>
                  <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-3">
                    Detail
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.name} className="border-tb-border border-t">
                    <th scope="row" className="text-tb-text px-6 py-4 text-left font-normal">
                      {row.name}
                    </th>
                    <td className="type-body text-tb-text px-6 py-4">
                      {row.price !== null
                        ? content.priceSource.kind === "catalogue"
                          ? `From ${formatPrice(row.price)}`
                          : formatPrice(row.price)
                        : "Quoted at the counter"}
                    </td>
                    <td className="type-body text-tb-muted px-6 py-4">
                      {row.note ?? "Flat price"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="type-body measure text-tb-muted mt-8">
            Every device model TechBrotherz repairs is priced individually on{" "}
            <Link href="/repair-prices" className="text-tb-green-deep hover:underline">
              the full repair price list
            </Link>
            , and{" "}
            <Link href={content.servicePath} className="text-tb-green-deep hover:underline">
              the {content.serviceType.toLowerCase()} page
            </Link>{" "}
            explains what the service covers.
          </p>
        </Section>
      )}

      {/* -------------------------------------------------------- prose */}
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

      {/* ------------------------------------------------- getting here */}
      <Section variant="tint" aria-labelledby="here-heading">
        <Heading
          level={2}
          id="here-heading"
          eyebrow="Getting here"
          lead="One shop, one counter, and the address every page on this site gives."
        >
          Where is the shop and how do you get to it?
        </Heading>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <LocalInfoCard heading="TechBrotherz in Calgary" headingLevel={3} />

          <div className="space-y-5">
            {/*
             * The shared local facts appear here as a single sentence each,
             * written for this page, plus a link to the page that carries the
             * fact in full. Repeating a three-paragraph transitway section on
             * eleven pages would turn the best fact on the site into
             * boilerplate. lib/content/local-shared.ts
             */}
            {content.facts.map((use) => (
              <Card key={use.fact}>
                <h3 className="type-h3 text-tb-text">{SHARED_FACTS[use.fact].label}</h3>
                <p className="type-body text-tb-muted mt-2">{use.sentence}</p>
                <Link
                  href={factHref(use.fact)}
                  className="text-tb-green-deep mt-4 inline-flex items-center gap-1.5 hover:underline"
                >
                  {use.fact === "chestermere-road"
                    ? "The full route from Chestermere"
                    : "How to find us and get here"}
                  <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} />
                </Link>
              </Card>
            ))}

            <Card>
              <h3 className="type-h3 text-tb-text">Parking</h3>
              <p className="type-body text-tb-muted mt-2">
                We have not published parking details because we could not verify them, and a wrong
                answer about parking wastes your trip. Phone {SITE.phone} and ask, and we will tell
                you exactly where to leave the car.
              </p>
            </Card>
          </div>
        </div>
      </Section>

      {/* ----------------------------------------------- what locals bring */}
      <Section aria-labelledby="mix-heading">
        <Heading
          level={2}
          id="mix-heading"
          eyebrow="Most common"
          lead={`What ${content.city} customers actually bring in for this, and what we check first.`}
        >
          What do people bring in most often?
        </Heading>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {content.localMix.map((item) => (
            <Card key={item.title}>
              <h3 className="type-h3 text-tb-text">{item.title}</h3>
              <p className="type-body text-tb-muted mt-2">{item.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------- faqs */}
      <ScopedFaqs
        faqs={faqs}
        id="local-faq-heading"
        heading={`Questions about ${content.serviceType.toLowerCase()} in ${content.city}`}
        variant="tint"
      />

      {/* ------------------------------------------------------- related */}
      <Section aria-labelledby="related-heading">
        <h2 id="related-heading" className="sr-only">
          Related pages
        </h2>
        <div className="grid gap-6 lg:grid-cols-3">
          <RelatedLinks
            title={`More on ${content.serviceType.toLowerCase()}`}
            links={[
              {
                label: route(content.servicePath)?.label ?? "The service",
                href: content.servicePath,
              },
              ...content.repairPaths
                .filter((href) => shouldRenderLink(href))
                .map((href) => ({ label: route(href)?.label ?? href, href })),
            ]}
          />
          <RelatedLinks
            title="Prices by device"
            links={[
              ...content.brandPaths.map((href) => ({
                label: route(href)?.label ?? href,
                href,
              })),
              { label: "Full repair price list", href: "/repair-prices" },
            ]}
          />
          <RelatedLinks
            title="Where we are"
            links={[
              ...content.placePaths
                .filter((href) => shouldRenderLink(href))
                .map((href) => ({ label: route(href)?.label ?? href, href })),
              ...content.siblings
                .filter((href) => shouldRenderLink(href))
                .map((href) => ({ label: route(href)?.label ?? href, href })),
              { label: "Directions and opening hours", href: "/contact" },
            ]}
          />
        </div>
      </Section>

      {/* ------------------------------------------------------ cta band */}
      <Section variant="dark" contained={false}>
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <h2 className="type-h2 text-tb-white">
                {content.city === "Chestermere"
                  ? "Call before you drive in"
                  : "Walk in any time we are open"}
              </h2>
              <p className="type-lead measure text-tb-muted-dark mt-4">
                {content.city === "Chestermere"
                  ? `One call confirms the part for your model is in stock, which is what turns the trip into one journey rather than two. TechBrotherz is at ${SITE.street}.`
                  : `TechBrotherz is at ${SITE.street}. No appointment, and you get the price before any work starts.`}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <PillButton href={TEL_HREF} withArrow={false}>
                Call {SITE.phone}
              </PillButton>
              <PillButton href="/contact" variant="ghostOnDark">
                Directions and hours
              </PillButton>
            </div>
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}
