import Link from "next/link";
import type { Metadata } from "next";
import type { PortableTextBlock } from "@portabletext/types";

import { ScopedFaqs } from "@/components/blocks/ScopedFaqs";
import { PageShell } from "@/components/blocks/PageShell";
import { TrademarkNotice } from "@/components/blocks/TrademarkNotice";
import { PriceFilter } from "@/components/blocks/PriceFilter";
import { RichText } from "@/components/blocks/RichText";
import { Card } from "@/components/primitives/Card";
import { Container } from "@/components/primitives/Container";
import { Heading } from "@/components/primitives/Heading";
import { PillButton } from "@/components/primitives/PillButton";
import { Section } from "@/components/primitives/Section";
import { shouldRenderLink } from "@/lib/routes";
import { getCoreFaqContext } from "@/lib/content/core-context";
import { pricesFaqs } from "@/lib/content/core-faqs";
import { composeFaqs, globalLinks } from "@/lib/faq/scoping";
import { buildMetadata } from "@/lib/seo/metadata";
import { localBusiness, organization, webPage, website } from "@/lib/seo/schema";
import { SITE, TEL_HREF } from "@/lib/site";
import { formatMinutes, formatPrice, formatPriceRange } from "@/lib/utils";
import {
  getAllFaqs,
  getBrands,
  getFlatServices,
  getModelSummaries,
  getReviewSummary,
  getSiteSettings,
  getUnlocking,
} from "@/sanity/queries";

export const revalidate = 3600;

const PATH = "/repair-prices";

export const metadata: Metadata = buildMetadata({
  title: "Phone Repair Prices in Calgary",
  description:
    "Every TechBrotherz repair price in Calgary, by brand and model. Parts and labour included, 60-day warranty, no appointment needed. iPhone screens from $44.99.",
  path: PATH,
});

export default async function RepairPricesPage() {
  const [settings, reviews, brands, models, flatServices, unlocking, allFaqs] = await Promise.all([
    getSiteSettings(),
    getReviewSummary(),
    getBrands(),
    getModelSummaries(),
    getFlatServices(),
    getUnlocking(),
    getAllFaqs(),
  ]);

  const warrantyDays = settings?.warrantyDays ?? 60;

  /* Group the flat model list by brand, preserving the query's ordering. */
  const byBrand = new Map<string, { name: string; slug: string; models: typeof models }>();

  for (const model of models) {
    const slug = model.brandSlug ?? "other";
    const existing = byBrand.get(slug);
    if (existing) existing.models.push(model);
    else byBrand.set(slug, { slug, name: model.brandName ?? "Other devices", models: [model] });
  }

  const brandGroups = [...byBrand.values()];
  const brandIntro = new Map(brands.map((brand) => [brand.slug, brand.intro]));

  const totalRepairs = models.reduce((sum, model) => sum + (model.repairCount ?? 0), 0);

  const allFrom = models
    .map((model) => model.fromPrice)
    .filter((price): price is number => typeof price === "number");
  const cheapest = allFrom.length > 0 ? Math.min(...allFrom) : null;
  const cheapestLabel = formatPrice(cheapest) ?? "a published price";

  // FAQ scoping rule, CLAUDE.md Section 8.8. Questions this page can answer
  // with its own numbers, plus at most two pointers to the canonical
  // answers on /faq. Only the page-specific ones reach structured data.
  const coreCtx = await getCoreFaqContext();
  const faqs = composeFaqs({
    path: PATH,
    pageSpecific: pricesFaqs(coreCtx),
    globalLinks: globalLinks(allFaqs, ["pricing", "parts"], 2),
  });

  /**
   * The 344-offer ItemList that used to live here has moved to the model
   * pages. Each model now owns the Offers for its own repairs, which is both
   * the correct place for them and what removed roughly 200 KB from this page.
   */
  const schema = [
    organization(settings ?? {}),
    website(settings ?? {}),
    localBusiness(settings ?? {}, reviews),
    webPage({
      type: "CollectionPage",
      name: "Phone, tablet and computer repair prices in Calgary",
      description:
        "Every device TechBrotherz publishes a repair price for in Calgary, with a link to the full price table for each one.",
      path: PATH,
      speakableSelectors: ['[data-speakable="answer"]'],
    }),
    faqs.schema,
  ];

  return (
    <PageShell
      path={PATH}
      eyebrow="Prices"
      title="Phone, tablet and computer repair prices in Calgary"
      crumbLabel="Repair prices"
      lead={
        <>
          We publish a price for every repair we do. This page lists all {models.length} devices we
          hold prices for, with a link to the full table for each. Every price includes the part and
          the labour.
        </>
      }
      answerBox={{
        answer: `TechBrotherz in Calgary publishes a price for every repair it does, covering ${models.length} devices and ${totalRepairs} repairs. iPhone screen replacements start at ${cheapestLabel}, including the part and the labour. No appointment is needed, and every repair carries a ${warrantyDays}-day warranty on the part and the workmanship.`,
        keyFacts: [
          {
            label: "Devices priced",
            value: `${models.length} models across ${brandGroups.length} brands`,
          },
          { label: "Repairs from", value: `${cheapestLabel} CAD, part and labour included` },
          { label: "Computer diagnostics", value: "$24.99, quoted before any work starts" },
          { label: "Carrier unlocking", value: "$35 for any Canadian carrier" },
          { label: "Warranty", value: `${warrantyDays} days on every repair` },
        ],
        lastUpdated: settings?._updatedAt,
      }}
      schema={schema}
    >
      {/* --------------------------------------------------- jump nav */}
      <Section variant="tint" className="pt-0 md:pt-0 lg:pt-0">
        <div className="border-tb-border bg-tb-white rounded-card border p-5">
          <h2 className="type-eyebrow text-tb-muted">Jump to a brand</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {[
              ...brandGroups.map((group) => ({ href: `#${group.slug}`, label: group.name })),
              { href: "#shop-services", label: "Computer services" },
              { href: "#unlocking", label: "Unlocking" },
            ].map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="border-tb-border hover:border-tb-ink rounded-chip text-tb-text inline-flex h-9 items-center border px-4 text-[0.9375rem] transition-colors duration-[180ms] ease-out"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <PriceFilter totalRows={models.length} label="devices" />
        </div>

        <Card className="border-l-tb-green mt-6 border-l-4">
          <p className="type-body text-tb-text">
            <strong className="font-medium">Every price on this site is in Canadian dollars</strong>{" "}
            and includes both the part and the labour, so the figure you see is the figure you pay
            before tax. Every repair carries a {warrantyDays}-day warranty. Where a device shows
            Call for quote, we order the part in and the price depends on supply that day, so ring{" "}
            {SITE.phone} and we will give you an exact figure.
          </p>
        </Card>
      </Section>

      {/* ------------------------------------------------- brand tables */}
      {brandGroups.map((group, index) => {
        const intro = brandIntro.get(group.slug);
        const brandPath = `/repair/${group.slug}`;

        return (
          <div key={group.slug} data-brand-group="">
            <Section
              id={group.slug}
              variant={index % 2 === 0 ? "light" : "tint"}
              aria-labelledby={`heading-${group.slug}`}
            >
              <Heading level={2} id={`heading-${group.slug}`} eyebrow={group.name}>
                How much does a {group.name} repair cost in Calgary?
              </Heading>

              {intro ? (
                <RichText className="mt-6" value={intro as unknown as PortableTextBlock[]} />
              ) : null}

              <div className="border-tb-border bg-tb-white rounded-card mt-10 overflow-x-auto border">
                <table className="tabular w-full min-w-[34rem] border-collapse text-left">
                  <caption className="type-body text-tb-text border-tb-border border-b px-6 py-4 text-left font-medium">
                    {group.name} repair prices at TechBrotherz in Calgary
                  </caption>
                  <thead>
                    <tr className="bg-tb-green-soft">
                      <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-3">
                        Model
                      </th>
                      <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-3">
                        Released
                      </th>
                      <th
                        scope="col"
                        className="type-eyebrow text-tb-green-deep px-6 py-3 md:text-right"
                      >
                        Repairs from (CAD)
                      </th>
                      <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-3">
                        Repairs listed
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.models.map((model) => {
                      const href = `/repair/${model.brandSlug}/${model.slug}`;
                      const range = formatPriceRange(model.fromPrice, {
                        from: (model.pricedCount ?? 0) > 1,
                      });

                      return (
                        <tr
                          key={model._id}
                          data-price-row=""
                          data-search={`${model.name} ${model.brandName ?? ""} ${model.deviceType ?? ""}`.toLowerCase()}
                          className="border-tb-border border-t"
                        >
                          <th
                            scope="row"
                            className="text-tb-text px-6 py-3.5 text-left font-normal"
                          >
                            {shouldRenderLink(href) ? (
                              <Link href={href} className="text-tb-green-deep hover:underline">
                                {model.name} repair prices
                              </Link>
                            ) : (
                              `${model.name} repair prices`
                            )}
                          </th>
                          <td className="text-tb-muted px-6 py-3.5">
                            {model.releaseYear ?? "n/a"}
                          </td>
                          <td className="text-tb-text px-6 py-3.5 font-medium md:text-right">
                            {range ?? (
                              <a
                                href={TEL_HREF}
                                className="text-tb-green-deep font-medium hover:underline"
                              >
                                Call for quote
                              </a>
                            )}
                          </td>
                          <td className="text-tb-muted px-6 py-3.5">{model.repairCount}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {shouldRenderLink(brandPath) ? (
                <p className="type-body mt-6">
                  <Link href={brandPath} className="text-tb-green-deep hover:underline">
                    See every {group.name} model and repair
                  </Link>
                </p>
              ) : null}
            </Section>
          </div>
        );
      })}

      {/* ------------------------------------------------ shop services */}
      <Section id="shop-services" aria-labelledby="heading-shop-services">
        <Heading level={2} id="heading-shop-services" eyebrow="Computers">
          What do computer and laptop services cost in Calgary?
        </Heading>

        <p className="type-body measure text-tb-muted mt-6">
          We charge a flat price for computer and software work, so you know the figure before the
          machine is opened. Diagnostics are $24.99 and we quote the repair to you before you agree
          to it, which means you never pay for work you have not approved.
        </p>

        <div className="border-tb-border bg-tb-white rounded-card mt-8 overflow-x-auto border">
          <table className="tabular w-full min-w-[34rem] border-collapse text-left">
            <caption className="type-body text-tb-text border-tb-border border-b px-6 py-4 text-left font-medium">
              Computer and laptop service prices at TechBrotherz in Calgary
            </caption>
            <thead>
              <tr className="bg-tb-green-soft">
                <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-3">
                  Service
                </th>
                <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-3 md:text-right">
                  Price (CAD)
                </th>
                <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-3">
                  Typical time
                </th>
              </tr>
            </thead>
            <tbody>
              {flatServices.map((entry) => (
                <tr key={entry._id} className="border-tb-border border-t">
                  <th
                    scope="row"
                    className="text-tb-text px-6 py-3.5 text-left align-top font-normal"
                  >
                    {entry.name}
                    {entry.description ? (
                      <span className="type-caption text-tb-muted measure mt-1 block">
                        {entry.description}
                      </span>
                    ) : null}
                  </th>
                  <td className="text-tb-text px-6 py-3.5 align-top font-medium md:text-right">
                    {entry.quoteOnly ? (
                      <a href={TEL_HREF} className="text-tb-green-deep hover:underline">
                        Call for quote
                      </a>
                    ) : (
                      (formatPriceRange(entry.price, {
                        from: entry.priceFrom ?? false,
                        to: entry.priceTo,
                      }) ?? "Call for quote")
                    )}
                  </td>
                  <td className="text-tb-muted px-6 py-3.5 align-top">
                    {formatMinutes(entry.turnaroundMinutes) ?? "Same day in most cases"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ---------------------------------------------------- unlocking */}
      <Section id="unlocking" variant="tint" aria-labelledby="heading-unlocking">
        <Heading level={2} id="heading-unlocking" eyebrow="Unlocking">
          How much does it cost to unlock a phone in Calgary?
        </Heading>

        <p className="type-body measure text-tb-muted mt-6">
          We unlock phones locked to any Canadian carrier for $35, usually the same day. Ask your
          carrier first, though: since December 2017 the CRTC Wireless Code has required Canadian
          carriers to unlock phones free of charge on request. People come to us when the carrier
          will not do it, when the phone was bought secondhand, or when they want it done while they
          wait.
        </p>

        <div className="border-tb-border bg-tb-white rounded-card mt-8 overflow-x-auto border">
          <table className="tabular w-full min-w-[30rem] border-collapse text-left">
            <caption className="type-body text-tb-text border-tb-border border-b px-6 py-4 text-left font-medium">
              Carrier unlocking prices at TechBrotherz in Calgary
            </caption>
            <thead>
              <tr className="bg-tb-green-soft">
                <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-3">
                  Service
                </th>
                <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-3 md:text-right">
                  Price (CAD)
                </th>
                <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-3">
                  Turnaround
                </th>
              </tr>
            </thead>
            <tbody>
              {unlocking.map((entry) => (
                <tr key={entry._id} className="border-tb-border border-t">
                  <th
                    scope="row"
                    className="text-tb-text px-6 py-3.5 text-left align-top font-normal"
                  >
                    Unlock a phone locked to {entry.carrier?.toLowerCase()}
                  </th>
                  <td className="text-tb-text px-6 py-3.5 align-top font-medium md:text-right">
                    {formatPrice(entry.price) ?? "Call for quote"}
                  </td>
                  <td className="text-tb-muted px-6 py-3.5 align-top">
                    {entry.turnaround ?? "Usually the same day"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="type-caption text-tb-muted mt-4">
          A phone reported lost or stolen is on the national blacklist and cannot be unlocked by
          anyone, including us. We will tell you straight away if that is the case.
        </p>
      </Section>

      {/* --------------------------------------------------------- faqs */}
      <ScopedFaqs
        faqs={faqs}
        id="page-faq-heading"
        heading="Questions about our prices"
        variant="light"
      />

      {/* ----------------------------------------------------- cta band */}
      <Section variant="dark" contained={false}>
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <h2 className="type-h2 text-tb-white">
                Bring it in and we will price it at the counter
              </h2>
              <p className="type-lead measure text-tb-muted-dark mt-4">
                We are at {SITE.street} in {SITE.city}. Walk in during opening hours, no appointment
                needed, and most phone repairs are finished in about {SITE.typicalWaitMinutes}{" "}
                minutes.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <PillButton href={TEL_HREF} withArrow={false}>
                Call {SITE.phone}
              </PillButton>
              <PillButton href="/contact" variant="ghostOnDark">
                Get directions
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
