import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { PortableTextBlock } from "@portabletext/types";
import { CheckCircle2 } from "lucide-react";

import { ScopedFaqs } from "@/components/blocks/ScopedFaqs";
import { PageShell } from "@/components/blocks/PageShell";
import { RelatedLinks } from "@/components/blocks/RelatedLinks";
import { RichText } from "@/components/blocks/RichText";
import { Card } from "@/components/primitives/Card";
import { Chip } from "@/components/primitives/Chip";
import { Container } from "@/components/primitives/Container";
import { Heading } from "@/components/primitives/Heading";
import { PillButton } from "@/components/primitives/PillButton";
import { Section } from "@/components/primitives/Section";
import { repairPagesForModel } from "@/lib/content/repairs";
import { composeFaqs, globalLinks } from "@/lib/faq/scoping";
import { modelFaqs as buildModelFaqs } from "@/lib/faq/generated";
import { route, shouldRenderLink } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  localBusiness,
  organization,
  serviceWithContactAction,
  webPage,
  website,
} from "@/lib/seo/schema";
import { SITE, TEL_HREF } from "@/lib/site";
import { formatMinutes } from "@/lib/utils";
import {
  getAllFaqs,
  getModelBySlug,
  getModelParams,
  getRelatedModels,
  getReviewSummary,
  getSiteSettings,
} from "@/lib/data";

export const revalidate = 3600;

/**
 * The Tier 5 local page and the Tier 2 service hub each brand belongs to.
 *
 * Mirrors the map on the brand hub. Every phone brand falls to the defaults,
 * which is why only the exceptions are listed: writing out nine identical rows
 * would be a table of one fact.
 */
const BRAND_LOCAL_PATH: Record<string, string> = {
  "apple-iphone": "/iphone-screen-repair-calgary",
  "samsung-galaxy": "/samsung-repair-calgary",
  "apple-ipad": "/ipad-repair-calgary",
  "laptops-desktops": "/laptop-repair-calgary",
};
const DEFAULT_LOCAL_PATH = "/phone-repair-calgary";

const BRAND_SERVICE_PATH: Record<string, string> = {
  "apple-ipad": "/services/ipad-repair",
  "laptops-desktops": "/services/laptop-repair",
};
const DEFAULT_SERVICE_PATH = "/services/phone-repair";

/**
 * Prerenders every published model at build time. dynamicParams stays on, so a
 * model published in the Studio afterwards renders on first request without a
 * redeploy. An unknown or unpublished slug still 404s, because the query
 * filters on published and the page calls notFound when it returns nothing.
 */
export async function generateStaticParams() {
  const params = await getModelParams();
  return params
    .filter((entry) => entry.brandSlug && entry.slug)
    .map((entry) => ({ brand: entry.brandSlug as string, model: entry.slug as string }));
}

interface PageProps {
  params: Promise<{ brand: string; model: string }>;
}

/**
 * The wider phone repair menu the client asked to surface on every model
 * (2026-08): battery, back glass, charging port, earpiece, loudspeaker. A
 * model page names whichever of these its own table does not already carry.
 */
const EXTRA_PHONE_REPAIRS: { slug: string; label: string }[] = [
  { slug: "battery-replacement", label: "batteries" },
  { slug: "back-glass-replacement", label: "back glass" },
  { slug: "charging-port-repair", label: "charging ports" },
  { slug: "earpiece-repair", label: "earpieces" },
  { slug: "speaker-repair", label: "loudspeakers" },
];

/** "a, b and c" from a list of words. */
function listWords(words: string[]): string {
  if (words.length <= 1) return words[0] ?? "";
  return `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;
}

/** One lookup shared by generateMetadata and the page itself. */
async function loadModel(brand: string, slug: string) {
  const model = await getModelBySlug(slug);
  if (!model) return null;

  // A model reached through the wrong brand is a 404, not a redirect. Two URLs
  // resolving to one page is exactly the duplicate we are trying to avoid.
  if (model.brand?.slug !== brand) return null;

  return model;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { brand, model: slug } = await params;
  const model = await loadModel(brand, slug);

  if (!model) {
    return buildMetadata({
      title: "Model not found",
      description: "That device is not in the TechBrotherz repair catalogue.",
      path: `/repair/${brand}/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: model.seoTitle ?? `${model.name} Repair in Calgary`,
    description:
      model.seoDescription ??
      `${model.name} repair at TechBrotherz in Calgary. Parts and labour included, 60-day warranty, free quote, no appointment needed.`,
    path: `/repair/${brand}/${slug}`,
    noIndex: model.noIndex ?? false,
  });
}

export default async function ModelPage({ params }: PageProps) {
  const { brand: brandSlug, model: modelSlug } = await params;
  const model = await loadModel(brandSlug, modelSlug);

  if (!model) notFound();

  const [settings, reviews, allFaqs, siblings] = await Promise.all([
    getSiteSettings(),
    getReviewSummary(),
    getAllFaqs(),
    getRelatedModels({
      modelId: model._id,
      brandSlug: model.brand?.slug ?? "",
      releaseYear: model.releaseYear ?? null,
    }),
  ]);

  const path = `/repair/${brandSlug}/${modelSlug}`;
  const warrantyDays = settings?.warrantyDays ?? 60;
  const waitMinutes = settings?.typicalWaitMinutes ?? 30;
  const phoneRaw = settings?.phoneRaw ?? SITE.phoneRaw;

  const prices = model.prices ?? [];
  const headline = prices[0];
  const headlineRepair = headline?.repair?.name?.toLowerCase() ?? "repair";

  const listedRepairSlugs = new Set(prices.map((entry) => entry.repair?.slug));
  const missingPhoneRepairs = EXTRA_PHONE_REPAIRS.filter(
    (entry) => !listedRepairSlugs.has(entry.slug),
  ).map((entry) => entry.label);

  const age = model.releaseYear ? new Date().getFullYear() - model.releaseYear : null;

  /**
   * FAQ scoping rule, CLAUDE.md Section 8.8.
   *
   * Phase 4 cut this block from eight shared questions to four, which moved
   * the median similarity between model pages from 52.9% to 12.8%. Phase 5
   * finished the job: the four questions are now generated from this model's
   * own record, so the text differs on all 84 pages rather than being the same
   * four answers repeated, and they are the only questions in this page's
   * FAQPage structured data. The site-wide answers live once, on /faq, and
   * appear here as two links rather than as a second full copy.
   */
  const categoryForDevice: Record<string, string> = {
    phone: model.brand?.slug === "apple-iphone" ? "iphone" : "samsung",
    tablet: "ipad",
    laptop: "computer",
    desktop: "computer",
  };
  const preferred = categoryForDevice[model.deviceType ?? "phone"] ?? "pricing";

  /*
   * Phase 8: model pages carry no FAQ block.
   *
   * The four questions here were generated from the model's own record, and the
   * price was what made them differ. Re-grounding them on age, repair count and
   * software support (Option 1) was tried and measured: the model tier went from
   * 21.3% to 27.7% median and pairs above 50% went from 45 to 135, because those
   * fields read alike across similar handsets in a way a price did not.
   *
   * So the block is cut rather than rewritten. Model pages already carry an
   * introduction, model-specific issues, a repair list and a verdict, all of
   * which measure 0.0% median similarity; a shared FAQ block was adding text
   * without adding an answer, and duplicating FAQPage nodes across 84 URLs.
   *
   * To re-add: raise MODEL_FAQ_COUNT one at a time and re-run the similarity
   * audit after each. Keep only the questions that hold the tier at 21.5% or
   * better. Do not re-add as a block.
   */
  const MODEL_FAQ_COUNT = 0;
  const generated = buildModelFaqs({
    name: model.name ?? "this model",
    deviceType: model.deviceType,
    releaseYear: model.releaseYear,
    brandName: model.brand?.name,
    currentYear: new Date().getFullYear(),
    waitMinutes,
    warrantyDays,
    phone: settings?.phone ?? SITE.phone,
    stillReceivesUpdates: model.stillReceivesUpdates,
    lastSupportedOs: model.lastSupportedOs,
    prices: prices.map((entry) => ({
      repairName: entry.repair?.name ?? "Repair",
      minutes: entry.turnaroundMinutes ?? entry.repair?.estimatedMinutes ?? null,
    })),
  }).slice(0, MODEL_FAQ_COUNT);

  /* Scoping requires at least half of a page's questions to be its own, so with
     no page-specific questions the global teasers go too rather than standing
     alone. See lib/faq/scoping.ts. */
  const faqs = composeFaqs({
    path,
    pageSpecific: generated,
    globalLinks: generated.length > 0 ? globalLinks(allFaqs, [preferred, "warranty"], 2) : [],
  });

  /** The Tier 3 pages that cover the repairs this model actually gets. */
  const repairPages = repairPagesForModel(
    model.brand?.slug ?? "",
    prices.map((entry) => entry.repair?.slug ?? "").filter(Boolean),
  );

  /* ------------------------------------------------------------- schema */

  /* Phase 8: no Offer nodes. An Offer without a price is invalid, and there are
     no prices. The Service node with its ContactAction carries the intent. */
  const schema = [
    organization(settings ?? {}),
    website(settings ?? {}),
    localBusiness(settings ?? {}, reviews),
    webPage({
      type: "WebPage",
      name: `${model.name} repair in Calgary`,
      description: `${model.name} repair, times and warranty at TechBrotherz in Calgary.`,
      path,
      speakableSelectors: ['[data-speakable="answer"]'],
      dateModified: model._updatedAt,
    }),
    // Only priced repairs become Offers. Quote-only repairs are described by
    serviceWithContactAction({
      name: `${model.name} repairs quoted in person`,
      description: `Repairs on the ${model.name} whose price depends on the part supply on the day, quoted at the Store or by phone.`,
      path,
      phoneRaw,
      repairNames: prices.map((entry) => entry.repair?.name ?? "Repair"),
    }),
    faqs.schema,
  ];

  /* -------------------------------------------------------------- answer */

  const answer = `A ${model.name} ${headlineRepair} at TechBrotherz in Calgary is quoted at the Store, free of charge, before any work starts, with the part and the labour in one figure. Most ${model.deviceType === "tablet" ? "tablet repairs are ready the same day" : `repairs take about ${waitMinutes} minutes while you wait`}, no appointment is needed, and every repair carries a ${warrantyDays}-day warranty.`;

  return (
    <PageShell
      path={path}
      eyebrow={model.brand?.name ?? "Repair"}
      title={`${model.name} Repair in Calgary`}
      crumbLabel={model.name ?? "Model"}
      lead={
        <>
          TechBrotherz, a walk-in cell phone and computer repair store at {SITE.street} in{" "}
          {SITE.city}, {SITE.region}, repairs the {model.name}
          {age !== null && age >= 2 ? `, now about ${age} years old` : ""}. Every repair
          is quoted free at the Store, with the part and the labour in one figure.
        </>
      }
      answerBox={{
        answer,
        keyFacts: [
          {
            label: "Quote",
            value: "Free at the Store, part and labour included",
          },
          {
            label: "Time",
            value:
              formatMinutes(headline?.turnaroundMinutes ?? headline?.repair?.estimatedMinutes) ??
              `About ${waitMinutes} minutes`,
          },
          { label: "Warranty", value: `${warrantyDays} days on the part and the workmanship` },
          { label: "Appointment", value: "Not needed, walk in during opening hours" },
          { label: "Repairs listed", value: `${prices.length} for this model` },
        ],
        lastUpdated: model._updatedAt,
      }}
      schema={schema}
    >
      {/* --------------------------------------------------- price table */}
      <Section variant="tint" className="pt-0 md:pt-0 lg:pt-0" aria-labelledby="prices-heading">
        <Heading level={2} id="prices-heading" eyebrow="Prices">
          How much does a {model.name} repair cost in Calgary?
        </Heading>

        <div className="border-tb-border bg-tb-white rounded-card mt-8 overflow-x-auto border">
          <table className="tabular w-full min-w-[36rem] border-collapse text-left">
            <caption className="type-body text-tb-text border-tb-border border-b px-6 py-4 text-left font-medium">
              {model.name} repairs at TechBrotherz in Calgary, with the part and the labour included
              in every quote
            </caption>
            <thead>
              <tr className="tb-thead">
                <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-3">
                  Repair
                </th>
                <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-3">
                  Typical time
                </th>
                <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-3">
                  Warranty
                </th>
              </tr>
            </thead>
            <tbody>
              {prices.map((entry) => {
                return (
                  <tr key={entry._id} className="border-tb-border border-t">
                    <th
                      scope="row"
                      className="text-tb-text px-6 py-3.5 text-left align-top font-normal"
                    >
                      {entry.repair?.name ?? "Repair"}
                      {entry.note ? (
                        <span className="type-caption text-tb-muted mt-1 block">{entry.note}</span>
                      ) : null}
                    </th>
                    <td className="text-tb-muted px-6 py-3.5 align-top">
                      {formatMinutes(entry.turnaroundMinutes ?? entry.repair?.estimatedMinutes) ??
                        `About ${waitMinutes} minutes`}
                    </td>
                    <td className="text-tb-muted px-6 py-3.5 align-top">
                      {entry.warrantyDays ?? warrantyDays} days
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="type-caption text-tb-muted mt-4">
          Every repair includes the part and the labour and carries a {warrantyDays}-day warranty,
          and the exact figure is quoted free before any work starts.
        </p>

        {/* The table lists the repairs curated for this model. The client asked
            (2026-08) for the wider menu to be visible on every model, so the
            options the table does not carry are named here and quoted at the
            Store, rather than padded into the table as identical rows on
            every page. Only the ones genuinely absent are listed, so the
            sentence never contradicts the table above it. */}
        <p className="type-body text-tb-muted mt-4">
          {model.deviceType === "phone" && missingPhoneRepairs.length > 0
            ? `A repair that is not in the table is not off the menu. TechBrotherz also replaces ${listWords(missingPhoneRepairs)} on the ${model.name}, quoted free at the Store once we have the phone in front of us.`
            : `A repair that is not in the table is not off the menu. Bring the ${model.name} to the Store and TechBrotherz will quote the fault it actually has, free, before any work starts.`}
        </p>

        {model.priceGroup?.models && model.priceGroup.models.length > 1 ? (
          <Card className="mt-6">
            <h3 className="type-h3 text-tb-text">A shared price, not a shared repair</h3>
            <p className="type-body text-tb-muted mt-3">
              {model.priceGroup.note ??
                `The ${model.priceGroup.name} share a printed price for this repair.`}{" "}
              The devices themselves are different, so bring yours in and we will confirm which part
              it takes.
            </p>
            <ul className="type-body mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {model.priceGroup.models
                .filter((entry) => entry.slug !== model.slug)
                .map((entry) => {
                  const href = `/repair/${entry.brandSlug}/${entry.slug}`;
                  return (
                    <li key={entry.slug}>
                      {shouldRenderLink(href) ? (
                        <Link href={href} className="text-tb-green-deep hover:underline">
                          {entry.name} repair details
                        </Link>
                      ) : (
                        <span className="text-tb-muted">{entry.name}</span>
                      )}
                    </li>
                  );
                })}
            </ul>
          </Card>
        ) : null}
      </Section>

      {/* --------------------------------------------------- what breaks */}
      <Section aria-labelledby="issues-heading">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <Heading level={2} id="issues-heading" eyebrow="Symptoms">
              What usually goes wrong with the {model.name}?
            </Heading>

            <RichText className="mt-6" value={model.intro as unknown as PortableTextBlock[]} />

            {model.commonIssues?.length ? (
              <ul className="mt-8 space-y-3">
                {model.commonIssues.map((issue) => (
                  <li key={issue} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="bg-tb-paper-2 mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full"
                    >
                      <CheckCircle2 size={14} strokeWidth={1.5} className="text-tb-green-deep" />
                    </span>
                    <span className="type-body text-tb-text">{issue}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="lg:col-span-5">
            <Card>
              <h3 className="type-h3 text-tb-text">What every repair includes</h3>
              <ul className="type-body text-tb-muted mt-4 space-y-3">
                <li>The part itself, whatever this device needs.</li>
                <li>The labour to fit it. No separate bench fee on a phone repair.</li>
                <li>
                  Testing before we hand it back: touch across the whole screen, cameras, speakers
                  and charging.
                </li>
                <li>
                  A {warrantyDays}-day warranty on the part and the workmanship.{" "}
                  <Link href="/warranty" className="text-tb-green-deep hover:underline">
                    See what that covers
                  </Link>
                  .
                </li>
              </ul>

              {/* The release-year chip went on the client's instruction 2026-08:
                  no year labels in the listings. Age still argues the verdict in
                  prose, where it carries reasoning rather than a number. */}
              <div className="mt-6 flex flex-wrap gap-2">
                {model.lastSupportedOs ? (
                  <Chip variant={model.stillReceivesUpdates ? "soft" : "dark"}>
                    {model.stillReceivesUpdates
                      ? "Still updated"
                      : `Last OS: ${model.lastSupportedOs}`}
                  </Chip>
                ) : null}
              </div>
            </Card>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------- verdict */}
      {model.verdict ? (
        <Section variant="tint" aria-labelledby="verdict-heading">
          <Heading level={2} id="verdict-heading" eyebrow="Straight answer">
            Is the {model.name} still worth repairing in {new Date().getFullYear()}?
          </Heading>

          <Card className="border-l-tb-green mt-8 border-l-4">
            <RichText value={model.verdict as unknown as PortableTextBlock[]} />

            <dl className="type-caption text-tb-muted border-tb-border mt-6 grid gap-x-8 gap-y-2 border-t pt-5 sm:grid-cols-3">
              {age !== null ? (
                <div>
                  <dt className="text-tb-text font-medium">Age</dt>
                  <dd>
                    About {age} year{age === 1 ? "" : "s"} old
                  </dd>
                </div>
              ) : null}
              <div>
                <dt className="text-tb-text font-medium">Repairs offered</dt>
                <dd>{prices.length}</dd>
              </div>
              <div>
                <dt className="text-tb-text font-medium">Software</dt>
                <dd>
                  {model.stillReceivesUpdates
                    ? "Still receiving updates"
                    : (model.lastSupportedOs ?? "No longer updated")}
                </dd>
              </div>
            </dl>
          </Card>
        </Section>
      ) : null}

      {/* -------------------------------------------------- repair notes */}
      {model.repairNotes ? (
        <Section aria-labelledby="notes-heading">
          <Heading level={2} id="notes-heading" eyebrow="Worth knowing">
            What is different about repairing this model?
          </Heading>
          <RichText className="mt-6" value={model.repairNotes as unknown as PortableTextBlock[]} />
        </Section>
      ) : null}

      {/* ----------------------------------------------------------- faqs */}
      <ScopedFaqs
        faqs={faqs}
        id="model-faq-heading"
        heading={`Questions about ${model.name} repairs`}
      />

      {/* -------------------------------------------------------- related */}
      <Section aria-labelledby="related-heading">
        <h2 id="related-heading" className="sr-only">
          Related pages
        </h2>

        <div className="grid gap-6 lg:grid-cols-2">
          {repairPages.length > 0 ? (
            <RelatedLinks
              title={`These repairs across every ${model.brand?.name ?? "device"} model`}
              links={repairPages.map((repair) => ({
                label: repair.h1.replace(" Prices", ""),
                href: `/repairs/${repair.slug}`,
              }))}
            />
          ) : null}

          <RelatedLinks
            title={`Other ${model.brand?.name ?? "devices"} we repair`}
            /**
             * Siblings first, then a fixed spine. The spine matters: a brand
             * with only one published model, such as Google Pixel, has no
             * siblings to offer, and without it that page would fall below the
             * six-outbound-link minimum the link audit enforces.
             *
             * The local page and the service hub joined the spine when
             * /repair-prices was deleted and took its spine entry with it.
             * Both were owed anyway: CLAUDE.md Section 9 rule 4 requires the
             * matching local page on every model page, and it was missing.
             */
            links={[
              ...siblings
                .filter((sibling) =>
                  shouldRenderLink(`/repair/${sibling.brandSlug}/${sibling.slug}`),
                )
                .map((sibling) => ({
                  label: `${sibling.name} repair details`,
                  href: `/repair/${sibling.brandSlug}/${sibling.slug}`,
                })),
              {
                label: `Every ${model.brand?.name ?? "device"} we repair`,
                href: `/repair/${model.brand?.slug}`,
              },
              {
                label:
                  route(BRAND_SERVICE_PATH[brandSlug] ?? DEFAULT_SERVICE_PATH)?.label ??
                  "Repair services",
                href: BRAND_SERVICE_PATH[brandSlug] ?? DEFAULT_SERVICE_PATH,
              },
              ...(shouldRenderLink(BRAND_LOCAL_PATH[brandSlug] ?? DEFAULT_LOCAL_PATH)
                ? [
                    {
                      label:
                        route(BRAND_LOCAL_PATH[brandSlug] ?? DEFAULT_LOCAL_PATH)?.label ??
                        "In Calgary",
                      href: BRAND_LOCAL_PATH[brandSlug] ?? DEFAULT_LOCAL_PATH,
                    },
                  ]
                : []),
              { label: "How TechBrotherz quotes a repair", href: "/contact" },
              { label: `Our ${warrantyDays}-day warranty`, href: "/warranty" },
              { label: "All the repair services we offer", href: "/services" },
            ]}
          />
        </div>
      </Section>

      {/* ------------------------------------------------------- cta band */}
      <Section variant="dark" contained={false}>
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <h2 className="type-h2 text-tb-white">Bring your {model.name} in</h2>
              <p className="type-lead measure text-tb-muted-dark mt-4">
                We are at {SITE.street} in {SITE.city}, open seven days a week. Walk in during
                opening hours and we will look at it while you wait.
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
    </PageShell>
  );
}
