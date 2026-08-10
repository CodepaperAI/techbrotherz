import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { PortableTextBlock } from "@portabletext/types";

import { ScopedFaqs } from "@/components/blocks/ScopedFaqs";
import { PageShell } from "@/components/blocks/PageShell";
import { TrademarkNotice } from "@/components/blocks/TrademarkNotice";
import { RelatedLinks } from "@/components/blocks/RelatedLinks";
import { RichText } from "@/components/blocks/RichText";
import { Card } from "@/components/primitives/Card";
import { Chip } from "@/components/primitives/Chip";
import { Container } from "@/components/primitives/Container";
import { Heading } from "@/components/primitives/Heading";
import { PillButton } from "@/components/primitives/PillButton";
import { Section } from "@/components/primitives/Section";
import { repairPagesForBrand } from "@/lib/content/repairs";
import { composeFaqs, globalLinks } from "@/lib/faq/scoping";
import { brandFaqs as buildBrandFaqs } from "@/lib/faq/generated";
import { route, shouldRenderLink } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { localBusiness, organization, service, webPage, website } from "@/lib/seo/schema";
import { SITE, TEL_HREF } from "@/lib/site";
import { formatMinutes } from "@/lib/utils";
import {
  getAllFaqs,
  getBrandHub,
  getBrandParams,
  getReviewSummary,
  getSiteSettings,
} from "@/lib/data";

export const revalidate = 3600;

export async function generateStaticParams() {
  const params = await getBrandParams();
  return params.filter((entry) => entry.slug).map((entry) => ({ brand: entry.slug as string }));
}

interface PageProps {
  params: Promise<{ brand: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { brand: slug } = await params;
  const brand = await getBrandHub(slug);

  if (!brand) {
    return buildMetadata({
      title: "Brand not found",
      description: "That brand is not in the TechBrotherz repair catalogue.",
      path: `/repair/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: brand.seoTitle ?? `${brand.name} Repair in Calgary`,
    description:
      brand.seoDescription ??
      `${brand.name} repair at TechBrotherz in Calgary. Parts and labour included, 60-day warranty, no appointment needed.`,
    path: `/repair/${slug}`,
    noIndex: brand.noIndex ?? false,
  });
}

/** Groups models into decades-free, human generation bands by release year. */
function generationBands(models: { releaseYear: number | null }[]) {
  const years = models.map((model) => model.releaseYear ?? 0).filter(Boolean);
  if (years.length === 0) return [] as { label: string; from: number; to: number }[];

  const newest = Math.max(...years);
  const oldest = Math.min(...years);

  const bands: { label: string; from: number; to: number }[] = [];
  for (let top = newest; top >= oldest; top -= 3) {
    const bottom = Math.max(top - 2, oldest);
    bands.push({
      label: bottom === top ? `${top}` : `${bottom} to ${top}`,
      from: bottom,
      to: top,
    });
    if (bottom === oldest) break;
  }
  return bands;
}

export default async function BrandHubPage({ params }: PageProps) {
  const { brand: brandSlug } = await params;
  const brand = await getBrandHub(brandSlug);

  if (!brand) notFound();

  const [settings, reviews, allFaqs] = await Promise.all([
    getSiteSettings(),
    getReviewSummary(),
    getAllFaqs(),
  ]);

  const path = `/repair/${brandSlug}`;
  const warrantyDays = settings?.warrantyDays ?? 60;
  const waitMinutes = settings?.typicalWaitMinutes ?? 30;

  const models = brand.models ?? [];
  const awaiting = brand.awaitingPrices ?? [];


  const bands = generationBands(models);

  /** Repair types that apply to the kinds of device in this brand. */
  const deviceTypes = new Set<string>(models.map((model) => model.deviceType ?? "phone"));
  const relevantRepairs = (brand.repairTypes ?? []).filter((repair) =>
    (repair.appliesTo ?? []).some((applies) => deviceTypes.has(applies)),
  );

  const brandCategory: Record<string, string> = {
    "apple-iphone": "iphone",
    "samsung-galaxy": "samsung",
    "apple-ipad": "ipad",
    "laptops-desktops": "computer",
  };

  /**
   * FAQ scoping rule, CLAUDE.md Section 8.8. Four questions built from this
   * brand's own catalogue, so the text differs across all nine hubs, plus at
   * most two pointers to the canonical answers on /faq.
   */
  const years = models.map((model) => model.releaseYear ?? 0).filter(Boolean);

  const faqs = composeFaqs({
    path,
    pageSpecific: buildBrandFaqs({
      brandName: brand.name ?? "this brand",
      modelCount: models.length,
      awaitingCount: awaiting.length,
      repairNames: relevantRepairs.map((repair) => repair.name ?? "").filter(Boolean),
      warrantyDays,
      waitMinutes,
      phone: settings?.phone ?? SITE.phone,
      oldestYear: years.length > 0 ? Math.min(...years) : null,
      newestYear: years.length > 0 ? Math.max(...years) : null,
    }),
    globalLinks: globalLinks(allFaqs, [brandCategory[brandSlug] ?? "pricing", "warranty"], 2),
  });

  /** The Tier 5 page for this brand, gated by the registry until Phase 6. */
  const brandLocalPath: Record<string, string> = {
    "apple-iphone": "/iphone-screen-repair-calgary",
    "samsung-galaxy": "/samsung-repair-calgary",
    "apple-ipad": "/ipad-repair-calgary",
    "laptops-desktops": "/laptop-repair-calgary",
  };
  const localPath = brandLocalPath[brandSlug] ?? "/phone-repair-calgary";

  /** The Tier 3 repair pages that belong to this brand. */
  const repairPages = repairPagesForBrand(brandSlug);

  /** Maps a repairType slug to the Tier 3 page that covers it, for this brand. */
  function repairPageFor(repairSlug: string | null | undefined): string | null {
    if (!repairSlug) return null;
    const match = repairPages.find(
      (entry) => entry.source.kind === "catalogue" && entry.source.repairSlugs.includes(repairSlug),
    );
    return match?.slug ?? null;
  }

  const schema = [
    organization(settings ?? {}),
    website(settings ?? {}),
    localBusiness(settings ?? {}, reviews),
    webPage({
      type: "CollectionPage",
      name: `${brand.name} repair in Calgary`,
      description: `${brand.name} repair prices, times and warranty at TechBrotherz in Calgary.`,
      path,
      speakableSelectors: ['[data-speakable="answer"]'],
      dateModified: brand._updatedAt,
    }),
    service({
      name: `${brand.name} repair`,
      description: `Screen, battery, charging port and camera repairs on ${brand.name} devices at TechBrotherz in Calgary.`,
      path,
      serviceType: `${brand.name} repair`,
    }),
    {
      "@type": "ItemList",
      "@id": `${path}#models`,
      name: `${brand.name} models repaired at TechBrotherz`,
      numberOfItems: models.length,
      itemListElement: models.map((model, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: model.name,
        url: `/repair/${brandSlug}/${model.slug}`,
      })),
    },
    faqs.schema,
  ];

  const priceSentence = `${brand.name} repairs at TechBrotherz in Calgary are quoted per model at the counter, free of charge, and every quote includes the part and the labour.`;

  return (
    <PageShell
      path={path}
      eyebrow={brand.name ?? "Brand"}
      title={`${brand.name} Repair in Calgary`}
      crumbLabel={brand.name ?? "Brand"}
      lead={
        <>
          TechBrotherz, a walk-in cell phone and computer repair shop at {SITE.street} in{" "}
          {SITE.city}, {SITE.region}, publishes a price for every {brand.name} model it holds parts
          for. Pick your model below for its full price table.
        </>
      }
      answerBox={{
        answer: `${priceSentence} Most repairs take about ${waitMinutes} minutes while you wait, no appointment is needed, and every repair carries a ${warrantyDays}-day warranty on the part and the workmanship.`,
        keyFacts: [
          { label: "Quote", value: "Free at the counter, part and labour included" },
          { label: "Models repaired", value: String(models.length) },
          { label: "Typical time", value: `About ${waitMinutes} minutes on most repairs` },
          { label: "Warranty", value: `${warrantyDays} days on every repair` },
          { label: "Appointment", value: "Not needed, walk in during opening hours" },
        ],
        lastUpdated: brand._updatedAt,
      }}
      schema={schema}
    >
      {brand.intro ? (
        <Section variant="tint" className="pt-0 md:pt-0 lg:pt-0" aria-labelledby="brand-intro">
          <h2 id="brand-intro" className="sr-only">
            About {brand.name} repairs at TechBrotherz
          </h2>
          <RichText value={brand.intro as unknown as PortableTextBlock[]} />
        </Section>
      ) : null}

      {/* ------------------------------------------------------ model grid */}
      <Section aria-labelledby="models-heading">
        <Heading
          level={2}
          id="models-heading"
          eyebrow="Models"
          lead="Newest first. Every model links to its own page with the full price table, the common faults and an honest answer on whether it is still worth repairing."
        >
          Which {brand.name} models do we repair?
        </Heading>

        <div className="mt-12 space-y-12">
          {bands.map((band) => {
            const inBand = models.filter(
              (model) =>
                (model.releaseYear ?? 0) >= band.from && (model.releaseYear ?? 0) <= band.to,
            );
            if (inBand.length === 0) return null;

            return (
              <div key={band.label}>
                <h3 className="type-h3 text-tb-text">{band.label}</h3>

                <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {inBand.map((model) => {
                    const href = `/repair/${brandSlug}/${model.slug}`;
                    const body = (
                      <>
                        <span className="text-tb-text block font-medium">{model.name}</span>
                        <span className="type-caption text-tb-muted mt-1 block">
                          {model.repairCount} repair{model.repairCount === 1 ? "" : "s"} listed
                        </span>
                      </>
                    );

                    return (
                      <li key={model._id}>
                        {shouldRenderLink(href) ? (
                          <Link
                            href={href}
                            className="border-tb-border bg-tb-white hover:border-tb-ink rounded-card block h-full border p-5 transition-colors duration-[180ms] ease-out"
                          >
                            {body}
                          </Link>
                        ) : (
                          <div className="border-tb-border bg-tb-white rounded-card block h-full border p-5">
                            {body}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ------------------------------------------------- price summary */}
      <Section variant="tint" aria-labelledby="summary-heading">
        <Heading level={2} id="summary-heading" eyebrow="At a glance">
          What does each {brand.name} model cost to repair?
        </Heading>

        <div className="border-tb-border bg-tb-white rounded-card mt-8 overflow-x-auto border">
          <table className="tabular w-full min-w-[34rem] border-collapse text-left">
            <caption className="type-body text-tb-text border-tb-border border-b px-6 py-4 text-left font-medium">
              {brand.name} repair price summary at TechBrotherz in Calgary
            </caption>
            <thead>
              <tr className="tb-thead">
                <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-3">
                  Model
                </th>
                <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-3">
                  Released
                </th>
                <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-3 md:text-right">
                  Repairs from (CAD)
                </th>
                <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-3">
                  Repairs listed
                </th>
              </tr>
            </thead>
            <tbody>
              {models.map((model) => {
                const href = `/repair/${brandSlug}/${model.slug}`;
                return (
                  <tr key={model._id} className="border-tb-border border-t">
                    <th scope="row" className="text-tb-text px-6 py-3.5 text-left font-normal">
                      {shouldRenderLink(href) ? (
                        <Link href={href} className="text-tb-green-deep hover:underline">
                          {model.name}
                        </Link>
                      ) : (
                        model.name
                      )}
                    </th>
                    <td className="text-tb-muted px-6 py-3.5">{model.releaseYear ?? "n/a"}</td>
                    <td className="text-tb-muted px-6 py-3.5">{model.repairCount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="type-caption text-tb-muted mt-4">
          {settings?.priceDisclaimer ?? SITE.priceDisclaimer}
        </p>
      </Section>

      {/* -------------------------------------------------- repair types */}
      {relevantRepairs.length > 0 ? (
        <Section aria-labelledby="repairs-heading">
          <Heading
            level={2}
            id="repairs-heading"
            eyebrow="Repairs"
            lead={`These are the repairs we carry out on ${brand.name} devices. The price depends on the model, so check yours in the table above.`}
          >
            What {brand.name} repairs do we do?
          </Heading>

          <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {relevantRepairs.map((repair) => (
              <li
                key={repair.slug}
                className="border-tb-border bg-tb-white rounded-card border p-5"
              >
                <h3 className="type-h3 text-tb-text">
                  {repairPageFor(repair.slug) ? (
                    <Link
                      href={`/repairs/${repairPageFor(repair.slug)}`}
                      className="hover:text-tb-green-deep"
                    >
                      {repair.name}
                    </Link>
                  ) : (
                    repair.name
                  )}
                </h3>
                {repair.shortDescription ? (
                  <p className="type-body text-tb-muted mt-2">{repair.shortDescription}</p>
                ) : null}
                <p className="type-caption text-tb-muted mt-3">
                  {formatMinutes(repair.estimatedMinutes) ?? `About ${waitMinutes} minutes`}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* ------------------------------------------------------- process */}
      <Section variant="tint" aria-labelledby="process-heading">
        <Heading level={2} id="process-heading" eyebrow="How it works">
          How does a {brand.name} repair work?
        </Heading>

        <ol className="mt-10 grid gap-6 lg:grid-cols-3">
          {[
            {
              step: "1",
              title: "Bring it in, or call first",
              body: `Come to ${SITE.street} during opening hours. If your model is unusual, call ${SITE.phone} first and we will check the part is here rather than ordered in.`,
            },
            {
              step: "2",
              title: "We confirm the price",
              body: "We identify the exact model from the device rather than the box, and confirm the price before any work starts. What you see in the table is what you pay.",
            },
            {
              step: "3",
              title: "Repair, test, warranty",
              body: `Most repairs take about ${waitMinutes} minutes. We test the work before handing it back, and you leave with a ${warrantyDays}-day warranty.`,
            },
          ].map((item) => (
            <li key={item.step}>
              <Card>
                <span className="type-eyebrow text-tb-green-deep">Step {item.step}</span>
                <h3 className="type-h3 text-tb-text mt-3">{item.title}</h3>
                <p className="type-body text-tb-muted mt-3">{item.body}</p>
              </Card>
            </li>
          ))}
        </ol>
      </Section>

      {/* --------------------------------------------- awaiting prices */}
      {awaiting.length > 0 ? (
        <Section aria-labelledby="awaiting-heading">
          <Heading
            level={2}
            id="awaiting-heading"
            eyebrow="Also repaired"
            lead="We repair these models too. They do not have their own pages yet because we have not published prices for them, and we would rather say that than put up a page with nothing on it."
          >
            What about the {brand.name} models not listed above?
          </Heading>

          <div className="mt-8 flex flex-wrap gap-2">
            {awaiting.map((model) => (
              <Chip key={model.name} variant="soft">
                {model.name}
              </Chip>
            ))}
          </div>

          <p className="type-body measure text-tb-muted mt-8">
            Call {SITE.phone} with any of these and we will quote it while you are on the phone. The{" "}
            {warrantyDays}-day warranty and the parts-and-labour pricing are the same as every other
            repair we do.
          </p>

          <PillButton href={TEL_HREF} className="mt-8" withArrow={false}>
            Call {SITE.phone} for a quote
          </PillButton>
        </Section>
      ) : null}

      {/* ---------------------------------------------------------- faqs */}
      <ScopedFaqs
        faqs={faqs}
        id="brand-faq-heading"
        heading={`Questions about ${brand.name} repairs`}
      />

      <Section aria-labelledby="brand-related-heading">
        <h2 id="brand-related-heading" className="sr-only">
          Related pages
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          {repairPages.length > 0 ? (
            <RelatedLinks
              title={`${brand.name} repairs, priced across every model`}
              links={repairPages.map((repair) => ({
                label: repair.h1.replace(" Prices", ""),
                href: `/repairs/${repair.slug}`,
              }))}
            />
          ) : null}

          <RelatedLinks
            title="Where to go next"
            links={[
              { label: "How TechBrotherz quotes a repair", href: "/contact" },
              ...(shouldRenderLink(localPath)
                ? [{ label: route(localPath)?.label ?? "In Calgary", href: localPath }]
                : []),
              { label: `Our ${warrantyDays}-day warranty`, href: "/warranty" },
              { label: "All repair services we offer", href: "/services" },
              { label: "Directions to the Calgary shop", href: "/contact" },
            ]}
          />
        </div>
      </Section>

      <Section variant="dark" contained={false}>
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <h2 className="type-h2 text-tb-white">Walk in with your {brand.name}</h2>
              <p className="type-lead measure text-tb-muted-dark mt-4">
                We are at {SITE.street} in {SITE.city}, seven days a week, and no appointment is
                needed at any time.
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
      {/* Independence notice, repeated here because this is where
          manufacturer names appear most densely. CLAUDE.md, trademark position. */}
      <Section variant="tint" className="pt-0 md:pt-0 lg:pt-0">
        <TrademarkNotice />
      </Section>
    </PageShell>
  );
}
