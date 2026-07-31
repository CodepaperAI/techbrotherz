import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { PageShell } from "@/components/blocks/PageShell";
import { RelatedLinks } from "@/components/blocks/RelatedLinks";
import { ScopedFaqs } from "@/components/blocks/ScopedFaqs";
import { StepCard } from "@/components/blocks/StepCard";
import { Card } from "@/components/primitives/Card";
import { Chip } from "@/components/primitives/Chip";
import { Container } from "@/components/primitives/Container";
import { Heading } from "@/components/primitives/Heading";
import { PillButton } from "@/components/primitives/PillButton";
import { Section } from "@/components/primitives/Section";
import { buildPriceContext } from "@/lib/content/prices";
import { REPAIRS, repairContent } from "@/lib/content/repairs";
import { serviceContent } from "@/lib/content/services";
import { composeFaqs, globalLinks } from "@/lib/faq/scoping";
import { route, shouldRenderLink } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  itemListOfOffers,
  localBusiness,
  offerFromPriceEntry,
  organization,
  service,
  serviceWithContactAction,
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
export const dynamicParams = false;

export function generateStaticParams() {
  return REPAIRS.map((entry) => ({ repair: entry.slug }));
}

interface PageProps {
  params: Promise<{ repair: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { repair: slug } = await params;
  const content = repairContent(slug);

  if (!content) {
    return buildMetadata({
      title: "Repair not found",
      description: "That repair is not one TechBrotherz publishes a page for.",
      path: `/repairs/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: content.seoTitle,
    description: content.seoDescription,
    path: `/repairs/${content.slug}`,
  });
}

export default async function RepairPage({ params }: PageProps) {
  const { repair: slug } = await params;
  const content = repairContent(slug);

  if (!content) notFound();

  const [settings, reviews, models, flatServices, unlocking, allFaqs] = await Promise.all([
    getSiteSettings(),
    getReviewSummary(),
    getAllPricedModels(),
    getFlatServices(),
    getUnlocking(),
    getAllFaqs(),
  ]);

  const path = `/repairs/${content.slug}`;
  const warrantyDays = settings?.warrantyDays ?? 60;
  const waitMinutes = settings?.typicalWaitMinutes ?? 30;

  const ctx = buildPriceContext({ models, flatServices, unlocking, warrantyDays, waitMinutes });

  /* -------------------------------------------------- cross-model table */

  interface Row {
    model: string;
    href: string;
    year: number | null;
    price: number | null;
  }

  let rows: Row[] = [];
  let quoteOnly: Row[] = [];

  if (content.source.kind === "catalogue") {
    const source = content.source;

    const all: Row[] = models
      .filter((model) => model.brandSlug === source.brandSlug)
      .map((model) => {
        const prices = (model.prices ?? [])
          .filter(
            (entry) =>
              entry.repair?.slug &&
              source.repairSlugs.includes(entry.repair.slug) &&
              typeof entry.price === "number",
          )
          .map((entry) => entry.price as number);

        // Does the catalogue carry this repair for this model at all, priced or not?
        const offered = (model.prices ?? []).some(
          (entry) => entry.repair?.slug && source.repairSlugs.includes(entry.repair.slug),
        );

        return offered
          ? {
              model: model.name ?? "",
              href: `/repair/${model.brandSlug}/${model.slug}`,
              year: model.releaseYear ?? null,
              price: prices.length > 0 ? Math.min(...prices) : null,
            }
          : null;
      })
      .filter((row): row is Row => row !== null);

    rows = all
      .filter((row) => row.price !== null)
      .sort((a, b) => (a.price as number) - (b.price as number));
    quoteOnly = all
      .filter((row) => row.price === null)
      .sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
  }

  const lowest = rows[0]?.price ?? null;
  const highest = rows[rows.length - 1]?.price ?? null;

  /* ---------------------------------------------------- top models by demand */
  // Newest first is the honest proxy for search demand: we do not have query
  // volume data, and pretending otherwise would be inventing a signal.
  const topModels = [...rows, ...quoteOnly]
    .filter((row) => row.year !== null)
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
    .slice(0, 6);

  /* --------------------------------------------------------------- faqs */
  const faqs = composeFaqs({
    path,
    pageSpecific: content.faqs(ctx),
    globalLinks: globalLinks(allFaqs, content.globalCategories, 2),
  });

  /* -------------------------------------------------------------- schema */
  const offers = rows.map((row) =>
    offerFromPriceEntry(
      {
        repairName: content.serviceType,
        modelName: row.model,
        price: row.price,
        warrantyDays,
        url: row.href,
      },
      { defaultWarrantyDays: warrantyDays, phoneRaw: settings?.phoneRaw },
    ),
  );

  const parent = serviceContent(content.parentService.replace("/services/", ""));

  const schema = [
    organization(settings ?? {}),
    website(settings ?? {}),
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
      name: content.serviceType,
      description: content.seoDescription,
      path,
      serviceType: content.serviceType,
    }),
    itemListOfOffers({
      name: `${content.serviceType} prices at TechBrotherz`,
      path,
      offers,
    }),
    // Models we do this repair on without a published price get a ContactAction
    // rather than a price-less Offer. Phase 4 rule, unchanged.
    quoteOnly.length > 0
      ? serviceWithContactAction({
          name: `${content.serviceType}, quoted models`,
          description: `${content.serviceType} on models TechBrotherz prices at the counter.`,
          path,
          phoneRaw: settings?.phoneRaw,
          repairNames: quoteOnly.map((row) => row.model),
        })
      : null,
    faqs.schema,
  ];

  const siblings = content.siblings
    .filter((href) => shouldRenderLink(href))
    .map((href) => ({ label: route(href)?.label ?? href, href }));

  const sections = content.sections(ctx);

  return (
    <PageShell
      path={path}
      eyebrow={content.eyebrow}
      title={content.h1}
      crumbLabel={route(path)?.label}
      lead={content.lead(ctx)}
      answerBox={{
        answer: content.answer(ctx),
        keyFacts: [
          {
            label: "Price",
            value:
              lowest !== null && highest !== null && lowest !== highest
                ? `${formatPrice(lowest)} to ${formatPrice(highest)} by model`
                : lowest !== null
                  ? `${formatPrice(lowest)}, part and labour`
                  : "Quoted at the counter",
          },
          { label: "Typical time", value: `About ${content.minutes} minutes` },
          { label: "Included", value: "The part, the labour and the testing" },
          { label: "Warranty", value: `${warrantyDays} days on the part and the work` },
          { label: "Appointment", value: "Not needed, walk in during opening hours" },
        ],
        lastUpdated: settings?._updatedAt,
      }}
      schema={schema}
    >
      {/* ---------------------------------------------- cross-model prices */}
      {rows.length > 0 && (
        <Section className="pt-0 md:pt-0 lg:pt-0" aria-labelledby="prices-heading">
          <Heading
            level={2}
            id="prices-heading"
            eyebrow="Every model"
            lead="Sorted from cheapest, and every price includes the part and the labour. Each model name links to that handset's full repair list."
          >
            How much does this repair cost on each model?
          </Heading>

          <div className="border-tb-border bg-tb-white rounded-card mt-10 overflow-x-auto border">
            <table className="w-full min-w-[34rem] border-collapse text-left">
              <caption className="sr-only-caption">
                {content.serviceType} prices by model at TechBrotherz in Calgary, part and labour
                included
              </caption>
              <thead>
                <tr className="bg-tb-green-soft">
                  <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-3">
                    Model
                  </th>
                  <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-3">
                    Price
                  </th>
                  <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-3">
                    Released
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.href} className="border-tb-border border-t">
                    <th scope="row" className="px-6 py-4 text-left font-normal">
                      <Link href={row.href} className="text-tb-text hover:text-tb-green-deep">
                        {row.model}
                      </Link>
                    </th>
                    <td className="type-body text-tb-text px-6 py-4">{formatPrice(row.price)}</td>
                    <td className="type-body text-tb-muted px-6 py-4">
                      {row.year ?? "Not stated"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {quoteOnly.length > 0 && (
            <div className="mt-8">
              <h3 className="type-h3 text-tb-text">Models quoted at the counter</h3>
              <p className="type-body measure text-tb-muted mt-2">
                TechBrotherz carries out this repair on the models below and does not publish a
                price for them, because the part is ordered in and priced when we know the cost.
                Call {SITE.phone} for a figure before you come down.
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {quoteOnly.map((row) => (
                  <li key={row.href}>
                    <Link href={row.href}>
                      <Chip>{row.model}</Chip>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Section>
      )}

      {/* ------------------------------------------------ comparison table */}
      {content.comparison && (
        <Section
          className={rows.length === 0 ? "pt-0 md:pt-0 lg:pt-0" : undefined}
          aria-labelledby="comparison-heading"
        >
          <Heading level={2} id="comparison-heading" eyebrow="Compared">
            {content.comparison.caption}
          </Heading>

          <div className="border-tb-border bg-tb-white rounded-card mt-10 overflow-x-auto border">
            <table className="w-full min-w-[38rem] border-collapse text-left">
              <caption className="sr-only-caption">{content.comparison.caption}</caption>
              <thead>
                <tr className="bg-tb-green-soft">
                  {content.comparison.columns.map((column) => (
                    <th
                      key={column}
                      scope="col"
                      className="type-eyebrow text-tb-green-deep px-6 py-3"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {content.comparison.rows.map((row) => (
                  <tr key={row[0]} className="border-tb-border border-t">
                    <th scope="row" className="text-tb-text px-6 py-4 text-left font-normal">
                      {row[0]}
                    </th>
                    <td className="type-body text-tb-muted px-6 py-4">{row[1]}</td>
                    <td className="type-body text-tb-muted px-6 py-4">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* ---------------------------------------------------------- symptoms */}
      <Section variant="tint" aria-labelledby="symptoms-heading">
        <Heading
          level={2}
          id="symptoms-heading"
          eyebrow="Symptoms"
          lead="If your device is doing one of these, this is usually the repair it needs."
        >
          Which symptoms point at this repair?
        </Heading>

        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {content.symptoms.map((symptom) => (
            <li
              key={symptom.slice(0, 30)}
              className="border-tb-border bg-tb-white rounded-card type-body text-tb-muted border px-5 py-4"
            >
              {symptom}
            </li>
          ))}
        </ul>
      </Section>

      {/* ------------------------------------------------------------- steps */}
      <Section aria-labelledby="steps-heading">
        <Heading
          level={2}
          id="steps-heading"
          eyebrow="The repair"
          lead="Written out so you know what you are paying for, not to make it sound complicated."
        >
          What does this repair actually involve?
        </Heading>

        <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {content.steps.map((step, index) => (
            <li key={step.title}>
              <StepCard
                step={index + 1}
                title={step.title}
                description={step.body}
                illustration={content.art}
              />
            </li>
          ))}
        </ol>
      </Section>

      {/* -------------------------------------------------------------- prose */}
      {sections.map((section, index) => (
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

      {/* --------------------------------------------------- model-specific */}
      <Section aria-labelledby="notes-heading">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Heading level={2} id="notes-heading" eyebrow="By model">
              Where this repair differs by model
            </Heading>
            <div className="mt-8 space-y-5">
              {content.modelNotes.map((note) => (
                <Card key={note.model}>
                  <h3 className="type-h3 text-tb-text">{note.model}</h3>
                  <p className="type-body text-tb-muted mt-2">{note.note}</p>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <Heading level={2} eyebrow="Honest limits">
              When this repair is not worth it
            </Heading>
            <ul className="mt-8 space-y-4">
              {content.notWorthIt.map((item) => (
                <li key={item.slice(0, 30)} className="type-body text-tb-muted flex gap-3">
                  <span aria-hidden="true" className="text-tb-green-deep mt-1">
                    &bull;
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="type-body measure text-tb-muted mt-8">
              Every price on this page includes the part and the labour, and every repair carries a{" "}
              <Link href="/warranty" className="text-tb-green-deep hover:underline">
                {warrantyDays}-day warranty on the part and the workmanship
              </Link>
              . Prices for every device TechBrotherz repairs are on{" "}
              <Link href="/repair-prices" className="text-tb-green-deep hover:underline">
                the full repair price list
              </Link>
              .
            </p>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------- top models */}
      {topModels.length > 0 && (
        <Section variant="tint" aria-labelledby="models-heading">
          <Heading
            level={2}
            id="models-heading"
            eyebrow="Popular models"
            lead="Each page below lists every repair TechBrotherz does on that handset, with prices."
          >
            The models people ask about most
          </Heading>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topModels.map((row) => (
              <li key={row.href}>
                <Link
                  href={row.href}
                  className="border-tb-border bg-tb-white rounded-card hover:border-tb-green-deep block h-full border px-5 py-4 transition-colors duration-[180ms]"
                >
                  <span className="text-tb-text block">{row.model} repair prices</span>
                  <span className="type-small text-tb-muted mt-1 block">
                    {row.price !== null
                      ? `${content.eyebrow} from ${formatPrice(row.price)}`
                      : "Priced at the counter"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* ---------------------------------------------------------- faqs */}
      <ScopedFaqs
        faqs={faqs}
        id="repair-faq-heading"
        heading={`Questions about ${content.serviceType.toLowerCase()}`}
        variant={topModels.length > 0 ? "light" : "tint"}
      />

      {/* -------------------------------------------------------- related */}
      <Section variant={topModels.length > 0 ? "tint" : "light"} aria-labelledby="related-heading">
        <h2 id="related-heading" className="sr-only">
          Related pages
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <RelatedLinks
            title="Related repairs"
            links={[
              ...siblings,
              {
                label: parent ? `All ${parent.serviceType.toLowerCase()}` : "All repair services",
                href: content.parentService,
              },
            ]}
          />
          <RelatedLinks
            title="Prices and practical details"
            links={[
              { label: "Full repair price list", href: "/repair-prices" },
              ...(content.brandSlug
                ? [
                    {
                      label: route(`/repair/${content.brandSlug}`)?.label ?? "Brand repair prices",
                      href: `/repair/${content.brandSlug}`,
                    },
                  ]
                : []),
              ...(shouldRenderLink(content.localPath)
                ? [
                    {
                      label: route(content.localPath)?.label ?? "This repair in Calgary",
                      href: content.localPath,
                    },
                  ]
                : []),
              { label: `Our ${warrantyDays}-day repair warranty`, href: "/warranty" },
              { label: "Directions, parking and opening hours", href: "/contact" },
            ]}
          />
        </div>
      </Section>

      {/* ------------------------------------------------------- cta band */}
      <Section variant="dark" contained={false}>
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <h2 className="type-h2 text-tb-white">Walk in and we will price it at the counter</h2>
              <p className="type-lead measure text-tb-muted-dark mt-4">
                TechBrotherz is at {SITE.street} in {SITE.city}. No appointment needed, and nothing
                starts until you have agreed the price.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <PillButton href={TEL_HREF} withArrow={false}>
                Call {SITE.phone}
              </PillButton>
              <PillButton href={content.parentService} variant="ghostOnDark">
                {parent ? parent.h1.replace(" in Calgary", "") : "All services"}
              </PillButton>
            </div>
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}
