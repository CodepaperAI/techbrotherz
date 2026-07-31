import { existsSync } from "node:fs";
import path from "node:path";

import Link from "next/link";
import type { Metadata } from "next";
import {
  Clock,
  DoorOpen,
  Laptop,
  Monitor,
  ShieldCheck,
  Smartphone,
  Tablet,
  Unlock,
  KeyRound,
  Wrench,
} from "lucide-react";

import { ScopedFaqs } from "@/components/blocks/ScopedFaqs";
import { IconCard } from "@/components/blocks/IconCard";
import { LocalInfoCard } from "@/components/blocks/LocalInfoCard";
import { PageShell } from "@/components/blocks/PageShell";
import { SplitBlock } from "@/components/blocks/SplitBlock";
import { StepCard } from "@/components/blocks/StepCard";
import { TrustStrip } from "@/components/blocks/TrustStrip";
import { Card } from "@/components/primitives/Card";
import { Container } from "@/components/primitives/Container";
import { Heading } from "@/components/primitives/Heading";
import { PillButton } from "@/components/primitives/PillButton";
import { Section } from "@/components/primitives/Section";
import { shouldRenderLink } from "@/lib/routes";
import { BRAND_SILHOUETTE, BrandCard, brandRange } from "@/components/blocks/BrandCard";
import { blurFor, demoImage } from "@/lib/content/images";
import { getCoreFaqContext } from "@/lib/content/core-context";
import { homeFaqs } from "@/lib/content/core-faqs";
import { composeFaqs, globalLinks } from "@/lib/faq/scoping";
import { buildMetadata } from "@/lib/seo/metadata";
import { localBusiness, organization, webPage, website } from "@/lib/seo/schema";
import { SITE, TEL_HREF } from "@/lib/site";
import { formatMinutes, formatPrice } from "@/lib/utils";
import {
  getAllPricedModels,
  getBrands,
  getGlobalFaqs,
  getReviewSummary,
  getSiteSettings,
} from "@/sanity/queries";

export const revalidate = 3600;

const PATH = "/";

export const metadata: Metadata = buildMetadata({
  title: "Cell Phone & Computer Repair in Calgary",
  description:
    "Walk-in phone, tablet and computer repair at 3317 17 Ave SE, Calgary. Most repairs take about 30 minutes. Parts and labour included, 60-day warranty.",
  path: PATH,
});

const SERVICE_CARDS = [
  {
    icon: Smartphone,
    title: "Phone repair",
    description:
      "Screens, batteries, charging ports and cameras on iPhone, Samsung, LG, Motorola and HTC. Most take about 30 minutes.",
    href: "/services/phone-repair",
  },
  {
    icon: Tablet,
    title: "iPad and tablet repair",
    description:
      "Cracked iPad glass from $69.99. On older iPads the glass alone can be replaced, which costs far less than a full screen.",
    href: "/services/ipad-repair",
  },
  {
    icon: Laptop,
    title: "Laptop repair",
    description:
      "Screen replacement from $120, charging port at $109.99, keyboards between $69.99 and $149.99. Usually ready the same day.",
    href: "/services/laptop-repair",
  },
  {
    icon: Monitor,
    title: "Computer repair",
    description:
      "Diagnostics at $24.99, virus removal at $34.99, and a full clean-up and tune-up at $79.99 including dust removal.",
    href: "/services/computer-repair",
  },
  {
    icon: Unlock,
    title: "Carrier unlocking",
    description:
      "Any Canadian carrier unlocked for $35, usually the same day. Unlocking does not erase your data.",
    href: "/services/phone-unlocking",
  },
  {
    icon: KeyRound,
    title: "Password reset",
    description:
      "A locked Windows account reset for $49.99, with the files on the machine left exactly where they are.",
    href: "/services/password-reset",
  },
];

export default async function HomePage() {
  const [settings, reviews, brands, models, faqs] = await Promise.all([
    getSiteSettings(),
    getReviewSummary(),
    getBrands(),
    getAllPricedModels(),
    getGlobalFaqs(8),
  ]);

  const warrantyDays = settings?.warrantyDays ?? 60;
  const waitMinutes = settings?.typicalWaitMinutes ?? 30;

  /**
   * The teaser pulls the eight cheapest priced screen and battery repairs
   * across iPhone and Samsung, straight from the catalogue. Nothing here is
   * typed into the copy, so it cannot go stale when a price changes.
   */
  const teaser = models
    .filter((model) => model.brandSlug === "apple-iphone" || model.brandSlug === "samsung-galaxy")
    .flatMap((model) =>
      (model.prices ?? [])
        .filter(
          (entry) =>
            typeof entry.price === "number" &&
            ["screen-replacement", "battery-replacement"].includes(entry.repair?.slug ?? ""),
        )
        .map((entry) => ({
          model: model.name ?? "",
          modelSlug: model.slug ?? "",
          repair: entry.repair?.name ?? "",
          price: entry.price as number,
          minutes: entry.turnaroundMinutes ?? entry.repair?.estimatedMinutes ?? null,
        })),
    )
    .sort((a, b) => a.price - b.price)
    .slice(0, 8);

  const activeBrands = brands.filter((brand) => (brand.modelCount ?? 0) > 0);

  // FAQ scoping rule, CLAUDE.md Section 8.8. The home page previously emitted
  // eight site-wide questions into its FAQPage graph, all of which also sat
  // in the graph on /faq. Now it answers three questions only it can answer.
  const coreCtx = await getCoreFaqContext();
  const scopedFaqs = composeFaqs({
    path: PATH,
    pageSpecific: homeFaqs(coreCtx),
    globalLinks: globalLinks(faqs, ["walkin", "warranty"], 2),
  });

  /*
   * The demo hero, when the demo set is present. Deleting public/demo/ falls
   * back to the placeholder rather than breaking the layout, because the demo
   * imagery is a stand-in for photography the client has not taken yet and
   * must not be load-bearing. lib/content/images.ts
   */
  const hero = demoImage("home-hero");
  const heroOnDisk =
    hero && existsSync(path.join(process.cwd(), "public", hero.file.replace(/^\//, "")));
  const heroImage = heroOnDisk
    ? { src: hero.file, alt: hero.alt, blurDataURL: blurFor("home-hero") }
    : { src: "/placeholder-photo.svg", alt: "", unoptimized: true };

  /*
   * Image props for the step and split blocks, present only when the demo set
   * is on disk. Spreading an empty object leaves the component on its own
   * fallback, so deleting public/demo/ degrades cleanly rather than breaking.
   */
  function onDisk(slot: string) {
    const entry = demoImage(slot);
    if (!entry) return null;
    return existsSync(path.join(process.cwd(), "public", entry.file.replace(/^\//, "")))
      ? entry
      : null;
  }

  function stepImage(slot: string) {
    const entry = onDisk(slot);
    return entry ? { image: { src: entry.file, alt: entry.alt } } : {};
  }

  function splitImage(slot: string) {
    const entry = onDisk(slot);
    return entry ? { image: { src: entry.file, alt: entry.alt } } : {};
  }

  const schema = [
    organization(settings ?? {}),
    website(settings ?? {}),
    localBusiness(settings ?? {}, reviews),
    webPage({
      type: "WebPage",
      name: "Cell phone and computer repair in Calgary",
      description:
        "TechBrotherz is a walk-in cell phone, tablet and computer repair shop at 3317 17 Ave SE in Calgary, Alberta.",
      path: PATH,
      speakableSelectors: ['[data-speakable="answer"]'],
    }),
    scopedFaqs.schema,
  ];

  return (
    <PageShell
      path={PATH}
      layout="hero"
      eyebrow="Calgary"
      title="Phone and computer repairs, done while you wait"
      lead={
        <>
          TechBrotherz is a walk-in cell phone and computer repair shop at {SITE.street} in{" "}
          {SITE.city}, {SITE.region}. No appointment is needed, most repairs take about{" "}
          {waitMinutes} minutes, and every price includes the part and the labour.
        </>
      }
      heroActions={
        <>
          <PillButton href="/repair-prices">See repair prices</PillButton>
          <PillButton href={TEL_HREF} variant="ghostOnDark" withArrow={false}>
            Call {SITE.phone}
          </PillButton>
        </>
      }
      heroImage={heroImage}
      answerBox={{
        answer: `TechBrotherz is a walk-in cell phone and computer repair shop at ${SITE.street} in Calgary. iPhone screen replacements start at $44.99 and Samsung Galaxy screens at $149.99, both including the part and the labour. Most repairs take about ${waitMinutes} minutes, no appointment is needed, and every repair carries a ${warrantyDays}-day warranty.`,
        keyFacts: [
          { label: "Address", value: `${SITE.street}, ${SITE.city}, ${SITE.region}` },
          { label: "Phone", value: SITE.phone },
          { label: "Typical wait", value: `About ${waitMinutes} minutes on most phone repairs` },
          { label: "Warranty", value: `${warrantyDays} days on the part and the workmanship` },
          { label: "Appointment", value: "Not needed, walk in during opening hours" },
        ],
        lastUpdated: settings?._updatedAt,
      }}
      schema={schema}
    >
      {/* ---------------------------------------------------- trust strip */}
      <Section className="pt-0 md:pt-0 lg:pt-0" aria-labelledby="why-techbrotherz">
        <h2 id="why-techbrotherz" className="sr-only">
          Why customers choose TechBrotherz
        </h2>
        <TrustStrip />
      </Section>

      {/* ------------------------------------------------------ icon cards */}
      <Section variant="tint" aria-labelledby="how-it-works-heading">
        <Heading
          level={2}
          id="how-it-works-heading"
          eyebrow="Why us"
          align="centre"
          lead="Four things that are true of every repair TechBrotherz does in Calgary, and that you can hold us to."
        >
          What you get on every repair
        </Heading>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <IconCard
            icon={DoorOpen}
            title="Walk in"
            description={`No appointment and no booking system. Come in during opening hours and TechBrotherz starts on your device when you arrive.`}
          />
          <IconCard
            icon={Clock}
            title="About 30 minutes"
            description={`Most phone screen and battery repairs are finished in about ${waitMinutes} minutes, so you can wait in the shop.`}
          />
          <IconCard
            icon={Wrench}
            title="Parts and labour included"
            description="Every price on this site includes both the part and the labour. There is no separate bench fee on a phone repair."
          />
          <IconCard
            icon={ShieldCheck}
            title={`${warrantyDays}-day warranty`}
            description={`Every repair is covered for ${warrantyDays} days on both the part fitted and the work done.`}
            link={{ label: `What the ${warrantyDays}-day warranty covers`, href: "/warranty" }}
          />
        </div>
      </Section>

      {/* -------------------------------------------------------- services */}
      <Section aria-labelledby="services-heading">
        <Heading
          level={2}
          id="services-heading"
          eyebrow="Services"
          align="centre"
          lead="TechBrotherz repairs phones, tablets, laptops and desktop computers, and unlocks phones for any Canadian carrier."
        >
          What can we fix for you?
        </Heading>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICE_CARDS.map((card) => (
            <IconCard
              key={card.title}
              icon={card.icon}
              title={card.title}
              description={card.description}
              {...(shouldRenderLink(card.href)
                ? { link: { label: `${card.title} details and prices`, href: card.href } }
                : {})}
            />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <PillButton href="/services" variant="ghost">
            See all repair services
          </PillButton>
        </div>
      </Section>

      {/* --------------------------------------------------------- process */}
      <Section variant="dark" aria-labelledby="process-heading">
        <Heading
          level={2}
          id="process-heading"
          eyebrow="How it works"
          align="centre"
          lead="Three steps, no booking system, and a firm price before any work starts."
        >
          How does a repair at TechBrotherz work?
        </Heading>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          <StepCard
            {...stepImage("home-process-1")}
            illustration="diagnostic"
            step={1}
            title="Walk in or call"
            description={`Bring the device to ${SITE.street}, or call ${SITE.phone} first to check the part for your model is in stock.`}
          />
          <StepCard
            {...stepImage("home-process-2")}
            illustration="board"
            step={2}
            title="We diagnose and quote"
            description="We test the device and give you the exact price before any work starts. Computer diagnostics are $24.99."
          />
          <StepCard
            {...stepImage("home-process-3")}
            illustration="screen"
            step={3}
            title={`Repair and ${warrantyDays}-day warranty`}
            description={`Most repairs take about ${waitMinutes} minutes. You leave with a ${warrantyDays}-day warranty on the part and the work.`}
          />
        </div>
      </Section>

      {/* --------------------------------------------------- price teaser */}
      <Section aria-labelledby="popular-prices-heading">
        <Heading
          level={2}
          id="popular-prices-heading"
          eyebrow="Prices"
          lead="These are the eight cheapest screen and battery repairs in the TechBrotherz catalogue right now. Every price includes the part and the labour."
        >
          How much do the most common repairs cost?
        </Heading>

        <div className="border-tb-border bg-tb-white rounded-card mt-10 overflow-x-auto border">
          <table className="tabular w-full min-w-[34rem] border-collapse text-left">
            <caption className="sr-only-caption">
              The eight cheapest iPhone and Samsung screen and battery repairs at TechBrotherz in
              Calgary
            </caption>
            <thead>
              <tr className="bg-tb-green-soft">
                <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-3">
                  Device
                </th>
                <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-3">
                  Repair
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
              {teaser.map((row) => (
                <tr key={`${row.modelSlug}-${row.repair}`} className="border-tb-border border-t">
                  <th scope="row" className="text-tb-text px-6 py-3.5 text-left font-normal">
                    {row.model}
                  </th>
                  <td className="text-tb-muted px-6 py-3.5">{row.repair}</td>
                  <td className="text-tb-text px-6 py-3.5 font-medium md:text-right">
                    {formatPrice(row.price)}
                  </td>
                  <td className="text-tb-muted px-6 py-3.5">
                    {formatMinutes(row.minutes) ?? `About ${waitMinutes} minutes`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="type-caption text-tb-muted mt-4">
          {settings?.priceDisclaimer ?? SITE.priceDisclaimer}
        </p>

        <div className="mt-8">
          <PillButton href="/repair-prices">See every repair price</PillButton>
        </div>
      </Section>

      {/* --------------------------------------------------- brand strip */}
      <Section variant="tint" aria-labelledby="brands-heading">
        <Heading
          level={2}
          id="brands-heading"
          eyebrow="Brands"
          align="centre"
          lead="TechBrotherz repairs devices from every major brand sold in Canada, including phones that most shops have stopped stocking parts for."
        >
          Which brands do we repair?
        </Heading>

        {/* Silhouette, wordmark, model range, count and starting price. The
            range and the price are what stop nine cards looking identical, and
            both are real catalogue data. No manufacturer logos: see
            components/blocks/BrandCard.tsx. */}
        <ul className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {activeBrands.map((brand) => {
            const href = `/repair/${brand.slug}`;
            return (
              <li key={brand._id}>
                <BrandCard
                  name={brand.name ?? "Devices"}
                  href={href}
                  silhouette={BRAND_SILHOUETTE[brand.slug ?? ""] ?? "phone"}
                  range={brandRange(brand.oldestModel, brand.newestModel)}
                  modelCount={brand.modelCount}
                  fromPrice={formatPrice(brand.fromPrice)}
                  linked={shouldRenderLink(href)}
                />
              </li>
            );
          })}
        </ul>
      </Section>

      {/* --------------------------------------------- individuals / business */}
      <Section aria-labelledby="who-we-help-heading">
        <h2 id="who-we-help-heading" className="sr-only">
          Who TechBrotherz repairs devices for
        </h2>

        <SplitBlock
          eyebrow="For individuals"
          heading="One device, fixed while you wait"
          lead="Bring a cracked phone, a slow laptop or a tablet that will not charge to the Calgary shop and leave with it working."
          checklist={[
            `Most phone repairs finished in about ${waitMinutes} minutes`,
            "Every price includes the part and the labour",
            `${warrantyDays}-day warranty on the part and the workmanship`,
          ]}
          cta={{ label: "See repair prices", href: "/repair-prices" }}
          {...splitImage("home-split-individuals")}
        />

        <SplitBlock
          className="mt-24"
          reverse
          eyebrow="For businesses"
          heading="Fleets of laptops and phones, kept working"
          lead="Small businesses across southeast Calgary use TechBrotherz for repairs, Windows installs and clean-ups on staff devices."
          checklist={[
            "Windows installation at $44.99 including Office and security",
            "Desktop clean-up and tune-up at $79.99 per machine",
            "Walk in with several devices, no appointment needed",
          ]}
          cta={{ label: "Talk to us about business repairs", href: "/contact" }}
          {...splitImage("home-split-business")}
        />
      </Section>

      {/* -------------------------------------------------------- location */}
      <Section variant="tint" aria-labelledby="location-heading">
        <Heading
          level={2}
          id="location-heading"
          eyebrow="Find us"
          lead={`TechBrotherz is on the stretch of 17 Avenue SE known as International Avenue, in the Forest Lawn area of southeast Calgary. Street parking runs along 17 Avenue SE outside the shop.`}
        >
          Where is TechBrotherz in Calgary?
        </Heading>

        <LocalInfoCard className="mt-10" headingLevel={3} heading="TechBrotherz, Calgary" />

        <p className="type-body measure text-tb-muted mt-8">
          We serve {SITE.city}, Chestermere, Airdrie and the surrounding Alberta communities. See{" "}
          <Link href="/locations" className="text-tb-green-deep hover:underline">
            the areas we serve
          </Link>{" "}
          for drive times, or{" "}
          <Link href="/contact" className="text-tb-green-deep hover:underline">
            directions and opening hours
          </Link>
          .
        </p>
      </Section>

      {/* ------------------------------------------------------------ faqs */}
      <ScopedFaqs
        faqs={scopedFaqs}
        id="home-faq-heading"
        heading="Common questions about repairs in Calgary"
        lead="The questions customers ask most before bringing a device in to the Calgary shop."
        variant="light"
        aside={
          <Card>
            <h3 className="type-h3 text-tb-text">Still not sure?</h3>
            <p className="type-body text-tb-muted mt-3">
              Call {SITE.phone} and describe the fault. We will tell you what it is likely to be,
              what it costs and whether the part is in stock, before you travel.
            </p>
            <ul className="type-body mt-5 space-y-2">
              <li>
                <Link href="/faq" className="text-tb-green-deep hover:underline">
                  All frequently asked questions
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="text-tb-green-deep hover:underline">
                  What the {warrantyDays}-day warranty covers
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-tb-green-deep hover:underline">
                  About the TechBrotherz shop
                </Link>
              </li>
            </ul>
          </Card>
        }
      />

      {/* --------------------------------------------------------- cta band */}
      <Section variant="dark" contained={false}>
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <h2 className="type-h2 text-tb-white">Walk in today, no appointment needed</h2>
              <p className="type-lead measure text-tb-muted-dark mt-4">
                We are at {SITE.street} in {SITE.city}, open seven days a week. Most phone repairs
                are done in about {waitMinutes} minutes while you wait.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <PillButton href={TEL_HREF} withArrow={false}>
                Call {SITE.phone}
              </PillButton>
              <PillButton href="/repair-prices" variant="ghostOnDark">
                See repair prices
              </PillButton>
            </div>
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}
