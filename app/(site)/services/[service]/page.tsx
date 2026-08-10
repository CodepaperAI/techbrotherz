import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";

import { DemoImage } from "@/components/blocks/DemoImage";
import { PageShell } from "@/components/blocks/PageShell";
import { RelatedLinks } from "@/components/blocks/RelatedLinks";
import { ScopedFaqs } from "@/components/blocks/ScopedFaqs";
import { StepCard } from "@/components/blocks/StepCard";
import { Card } from "@/components/primitives/Card";
import { Container } from "@/components/primitives/Container";
import { Heading } from "@/components/primitives/Heading";
import { PillButton } from "@/components/primitives/PillButton";
import { Section } from "@/components/primitives/Section";
import { buildPriceContext } from "@/lib/content/prices";
import { repairsForService } from "@/lib/content/repairs";
import { SERVICES, serviceContent } from "@/lib/content/services";
import { composeFaqs, globalLinks } from "@/lib/faq/scoping";
import { route, shouldRenderLink } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { localBusiness, organization, service, webPage, website } from "@/lib/seo/schema";
import { SITE, TEL_HREF } from "@/lib/site";
import {
  getAllFaqs,
  getAllPricedModels,
  getBrands,
  getFlatServices,
  getRepairTypes,
  getReviewSummary,
  getSiteSettings,
} from "@/lib/data";

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((entry) => ({ service: entry.slug }));
}

interface PageProps {
  params: Promise<{ service: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { service: slug } = await params;
  const content = serviceContent(slug);

  if (!content) {
    return buildMetadata({
      title: "Service not found",
      description: "That service is not one TechBrotherz offers.",
      path: `/services/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: content.seoTitle,
    description: content.seoDescription,
    path: `/services/${content.slug}`,
  });
}

export default async function ServicePage({ params }: PageProps) {
  const { service: slug } = await params;
  const content = serviceContent(slug);

  if (!content) notFound();

  const [settings, reviews, models, flatServices, allFaqs, repairTypes, brands] =
    await Promise.all([
      getSiteSettings(),
      getReviewSummary(),
      getAllPricedModels(),
      getFlatServices(),
      getAllFaqs(),
      getRepairTypes(),
      getBrands(),
    ]);

  const path = `/services/${content.slug}`;
  const warrantyDays = settings?.warrantyDays ?? 60;
  const waitMinutes = settings?.typicalWaitMinutes ?? 30;

  const ctx = buildPriceContext({
    warrantyDays,
    waitMinutes,
  });

  /* ---------------------------------------------------- what this covers */
  const covered = repairTypes.filter((repair) =>
    (repair.appliesTo ?? []).some((applies) =>
      content.deviceTypes.includes(applies as "phone" | "tablet" | "laptop"),
    ),
  );

  /* ------------------------------------------------------- price table */
  const flatRows = content.flatSlugs
    .map((flatSlug) => flatServices.find((entry) => entry.slug === flatSlug))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  /** Cheapest published price per repair type, across the device types covered. */
  const catalogueRows = covered
    .map((repair) => {
      const prices = models
        .filter((model) =>
          content.deviceTypes.includes(
            (model.deviceType ?? "phone") as "phone" | "tablet" | "laptop",
          ),
        )
        .flatMap((model) =>
          (model.prices ?? [])
            .map(() => 0),
        );

      return {
        name: repair.name ?? "",
        minutes: repair.estimatedMinutes ?? null,
        from: prices.length > 0 ? Math.min(...prices) : null,
      };
    })
    .filter((row) => row.from !== null);

  /* -------------------------------------------------------------- faqs */
  const faqs = composeFaqs({
    path,
    pageSpecific: content.faqs(ctx),
    globalLinks: globalLinks(allFaqs, content.globalCategories, 2),
  });

  /* ------------------------------------------------------------ schema */
  const childRepairs = repairsForService(path);

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
    // The child repair pages are listed rather than emitted as an OfferCatalog.
    // An OfferCatalog wants Offers, and an Offer with no price is exactly what
    // Phase 4 removed from the site. See lib/seo/schema.ts.
    childRepairs.length > 0
      ? {
          "@type": "ItemList",
          "@id": `${path}#repairs`,
          name: `${content.serviceType} pages at TechBrotherz`,
          numberOfItems: childRepairs.length,
          itemListElement: childRepairs.map((repair, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: repair.serviceType,
            url: `/repairs/${repair.slug}`,
          })),
        }
      : null,
    faqs.schema,
  ];

  const brandName = new Map(brands.map((brand) => [brand.slug, brand.name]));

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
        keyFacts: content.keyFacts(ctx),
        lastUpdated: settings?._updatedAt,
      }}
      schema={schema}
    >
      {/* -------------------------------------------------- what it covers */}
      {covered.length > 0 && (
        <Section className="pt-0 md:pt-0 lg:pt-0" aria-labelledby="covers-heading">
          {/* Demo photography, rendered only where a picture of the work adds
              something. Several service pages have no image because no
              candidate met the no-manufacturer-mark constraint. See
              lib/content/images.ts and content/image-manifest.md. */}
          <DemoImage
            slot={`service-${content.slug}`}
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="mb-12"
          />
          <Heading
            level={2}
            id="covers-heading"
            eyebrow="Covered"
            lead={`Every repair below is one TechBrotherz carries out in Calgary, with the part and the labour in one price and a ${warrantyDays}-day warranty.`}
          >
            What does this service cover?
          </Heading>

          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {covered.map((repair) => (
              <li
                key={repair.slug}
                className="border-tb-border bg-tb-white rounded-card border px-5 py-4"
              >
                <span className="text-tb-text block">{repair.name}</span>
                {repair.estimatedMinutes ? (
                  <span className="type-small text-tb-muted mt-1 block">
                    About {repair.estimatedMinutes} minutes
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* -------------------------------------------------------- prose */}
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

      {/* ------------------------------------------------------ process */}
      <Section aria-labelledby="process-heading">
        <Heading
          level={2}
          id="process-heading"
          eyebrow="Process"
          lead="No appointment, no booking form, and no work starts before you have agreed the price."
        >
          How does a repair at TechBrotherz work?
        </Heading>

        <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {content.process.map((step, index) => (
            <li key={step.title}>
              <StepCard
                step={index + 1}
                title={step.title}
                description={step.body}
                illustration={step.art}
              />
            </li>
          ))}
        </ol>
      </Section>

      {/* -------------------------------------------------- price table */}
      {(catalogueRows.length > 0 || flatRows.length > 0) && (
        <Section variant="tint" aria-labelledby="prices-heading">
          <Heading
            level={2}
            id="prices-heading"
            eyebrow="Prices"
            lead="Every price includes the part and the labour. Prices that vary by model link through to the full list."
          >
            How much does this service cost?
          </Heading>

          <div className="border-tb-border bg-tb-white rounded-card mt-10 overflow-x-auto border">
            <table className="w-full min-w-[36rem] border-collapse text-left">
              <caption className="sr-only-caption">
                {content.serviceType} prices at TechBrotherz in Calgary, part and labour included
              </caption>
              <thead>
                <tr className="tb-thead">
                  <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-3">
                    Repair
                  </th>
                  <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-3">
                    Price
                  </th>
                  <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-3">
                    Typical time
                  </th>
                </tr>
              </thead>
              <tbody>
                {catalogueRows.map((row) => (
                  <tr key={row.name} className="border-tb-border border-t">
                    <th scope="row" className="text-tb-text px-6 py-4 text-left font-normal">
                      {row.name}
                    </th>
                    <td className="type-body text-tb-muted px-6 py-4">
                      {row.minutes ? `About ${row.minutes} minutes` : "Quoted at the counter"}
                    </td>
                  </tr>
                ))}
                {flatRows.map((row) => (
                  <tr key={row.slug} className="border-tb-border border-t">
                    <th scope="row" className="text-tb-text px-6 py-4 text-left font-normal">
                      {row.name}
                    </th>
                    <td className="type-body text-tb-muted px-6 py-4">
                      {row.category === "software"
                        ? "Usually the same day"
                        : "Same day in most cases"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="type-body measure text-tb-muted mt-8">
            Prices for every device TechBrotherz repairs are published on{" "}
            <Link href="/contact" className="text-tb-green-deep hover:underline">
              how quoting works
            </Link>
            , and the terms of the {warrantyDays}-day cover are set out on{" "}
            <Link href="/warranty" className="text-tb-green-deep hover:underline">
              the warranty page
            </Link>
            .
          </p>
        </Section>
      )}

      {/* --------------------------------------------------- repair pages */}
      {childRepairs.length > 0 && (
        <Section aria-labelledby="repairs-heading">
          <Heading
            level={2}
            id="repairs-heading"
            eyebrow="By repair"
            lead="Each page below lists that one repair across every model TechBrotherz does it on, with prices."
          >
            Which repair do you need?
          </Heading>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {childRepairs.map((repair) => (
              <li key={repair.slug}>
                <Link
                  href={`/repairs/${repair.slug}`}
                  className="border-tb-border bg-tb-white rounded-card hover:border-tb-green-deep block h-full border px-5 py-4 transition-colors duration-[180ms]"
                >
                  <span className="text-tb-text block">{repair.h1.replace(" Prices", "")}</span>
                  <span className="type-small text-tb-muted mt-1 block">
                    About {repair.minutes} minutes
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* -------------------------------------------------- devices we do */}
      {content.brandSlugs.length > 0 && (
        <Section variant="tint" aria-labelledby="devices-heading">
          <Heading
            level={2}
            id="devices-heading"
            eyebrow="Devices"
            lead="Each brand page lists every model in that range with its own published prices."
          >
            Which devices does TechBrotherz repair?
          </Heading>

          <ul className="mt-10 flex flex-wrap gap-3">
            {content.brandSlugs.map((brandSlug) => (
              <li key={brandSlug}>
                <Link
                  href={`/repair/${brandSlug}`}
                  className="border-tb-border bg-tb-white rounded-pill hover:border-tb-green-deep inline-flex items-center border px-5 py-2.5 transition-colors duration-[180ms]"
                >
                  {brandName.get(brandSlug) ?? brandSlug} repairs
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* ------------------------------------------------ who this is for */}
      <Section aria-labelledby="whofor-heading">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Heading level={2} id="whofor-heading" eyebrow="Who it suits">
              Who is this service for?
            </Heading>
            <ul className="mt-8 space-y-4">
              {content.whoFor.map((item) => (
                <li key={item.slice(0, 30)} className="type-body text-tb-muted flex gap-3">
                  <span aria-hidden="true" className="text-tb-green-deep mt-1">
                    &bull;
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Heading level={2} eyebrow="Honest limits">
              What TechBrotherz does not do
            </Heading>
            <div className="mt-8 space-y-5">
              {content.limits(ctx).map((limit) => (
                <Card key={limit.title}>
                  <h3 className="type-h3 text-tb-text">{limit.title}</h3>
                  <p className="type-body text-tb-muted mt-2">{limit.body}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ----------------------------------------------------- sources */}
      {content.sources.length > 0 && (
        <Section variant="tint" aria-labelledby="sources-heading">
          <Heading level={2} id="sources-heading" eyebrow="Sources">
            Where these facts come from
          </Heading>
          <ul className="mt-8 space-y-5">
            {content.sources.map((source) => (
              <li key={source.href} className="measure">
                <a
                  href={source.href}
                  rel="noopener"
                  className="text-tb-green-deep inline-flex items-center gap-1.5 hover:underline"
                >
                  {source.label}
                  <ExternalLink aria-hidden="true" size={14} strokeWidth={1.5} />
                </a>
                <p className="type-body text-tb-muted mt-1">{source.note}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* --------------------------------------------------------- faqs */}
      <ScopedFaqs
        faqs={faqs}
        id="service-faq-heading"
        heading={`Questions about ${content.serviceType.toLowerCase()}`}
        variant={content.sources.length > 0 ? "light" : "tint"}
      />

      {/* ------------------------------------------------------ related */}
      <Section aria-labelledby="related-heading">
        <h2 id="related-heading" className="sr-only">
          Related pages
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <RelatedLinks
            title="Other services at TechBrotherz"
            links={[
              ...content.siblings
                .filter((href) => shouldRenderLink(href))
                .map((href) => ({ label: route(href)?.label ?? href, href })),
              { label: "All repair services", href: "/services" },
              { label: "Ask for a quote", href: "/contact" },
            ]}
          />
          <RelatedLinks
            title="Practical details"
            links={[
              { label: `Our ${warrantyDays}-day repair warranty`, href: "/warranty" },
              { label: "Directions, parking and opening hours", href: "/contact" },
              ...(shouldRenderLink(content.localPath)
                ? [
                    {
                      label: route(content.localPath)?.label ?? "Our Calgary location",
                      href: content.localPath,
                    },
                  ]
                : [{ label: "Areas we serve around Calgary", href: "/locations" }]),
            ]}
          />
        </div>
      </Section>

      {/* ------------------------------------------------------ cta band */}
      <Section variant="dark" contained={false}>
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <h2 className="type-h2 text-tb-white">Bring it in and we will take a look</h2>
              <p className="type-lead measure text-tb-muted-dark mt-4">
                TechBrotherz is at {SITE.street} in {SITE.city}. No appointment, and you get the
                price before any work starts.
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
