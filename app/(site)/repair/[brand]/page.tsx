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

  /* Published pages and quote-only seeds in one grid, newest first. */
  const gridModels = [
    ...models.map((model) => ({
      name: model.name,
      year: model.releaseYear ?? 0,
      href: `/repair/${brandSlug}/${model.slug}`,
      caption: `${model.repairCount} repair${model.repairCount === 1 ? "" : "s"} listed`,
    })),
    ...awaiting.map((model) => ({
      name: model.name,
      year: model.releaseYear ?? 0,
      href: null as string | null,
      caption: "Quoted at the counter",
    })),
  ].sort((a, b) => b.year - a.year || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

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
          lead="Newest first. Models with their own page link through to the full repair list, the common faults and an honest verdict; the newest arrivals are quoted at the counter while their pages are written."
        >
          Which {brand.name} models do we repair?
        </Heading>

        {/* One flat grid, newest first, published pages and quote-only models
            together. The seeded current range sits at the top of this grid
            rather than in a chip list at the bottom, because "which models do
            you repair" is exactly the question the newest handsets answer.
            Client instruction 2026-08. */}
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {gridModels.map((model) => {
            const body = (
              <>
                <span className="text-tb-text block font-medium">{model.name}</span>
                <span className="type-caption text-tb-muted mt-1 block">{model.caption}</span>
              </>
            );

            return (
              <li key={model.name}>
                {model.href && shouldRenderLink(model.href) ? (
                  <Link
                    href={model.href}
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

        <p className="type-body measure text-tb-muted mt-8">
          A model without its own page yet is still repaired at the same counter: call {SITE.phone}{" "}
          and it is quoted while you are on the phone, with the {warrantyDays}-day warranty and the
          parts-and-labour pricing the same as every other repair we do.
        </p>
      </Section>

      {/* The price-summary table that sat here was removed 2026-08. After the
          price scrub it carried only a release-year column, which the client
          asked to remove, under headers that still promised prices. The model
          grid above already lists every model with its repair count. */}

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

      {/* The "also repaired" chip section that sat here merged into the model
          grid above 2026-08: the quote-only models now sit in the grid itself,
          newest first, where a visitor actually looks for them. */}

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
