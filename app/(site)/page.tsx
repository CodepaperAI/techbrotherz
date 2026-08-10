import { existsSync } from "node:fs";
import path from "node:path";

import Link from "next/link";
import type { Metadata } from "next";
import { Clock, DoorOpen, ShieldCheck, Wrench } from "lucide-react";

import { BenefitStrip } from "@/components/blocks/BenefitStrip";
import { ScopedFaqs } from "@/components/blocks/ScopedFaqs";
import { Ticker } from "@/components/blocks/Ticker";
import { Tile, TileGrid } from "@/components/blocks/Tile";
import { IconCard } from "@/components/blocks/IconCard";
import { LocalInfoCard } from "@/components/blocks/LocalInfoCard";
import { PageShell } from "@/components/blocks/PageShell";
import { ServiceCard } from "@/components/blocks/ServiceCard";
import type { RepairSubject } from "@/components/blocks/RepairIllustration";
import { SplitBlock } from "@/components/blocks/SplitBlock";
import { StepCard } from "@/components/blocks/StepCard";
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
import { getBrands, getGlobalFaqs, getReviewSummary, getSiteSettings } from "@/lib/data";

/**
 * The areas named on the Calgary location record, rendered as tiles.
 *
 * Forest Lawn is the one neighbourhood that cleared the Phase 6
 * four-distinct-fact rule and earned a URL. The areas that became anchored
 * sections on /locations/calgary link to their section, so every tile that
 * looks clickable navigates somewhere real. Erin Woods, Penbrooke Meadows and
 * Marlborough have neither a page nor a section, so they render as plain rows
 * with no arrow. The link audit verifies each anchor target exists.
 */
const CALGARY_AREAS: { name: string; href?: string }[] = [
  { name: "Forest Lawn", href: "/locations/calgary/forest-lawn" },
  { name: "Albert Park", href: "/locations/calgary#albert-park-radisson-heights" },
  { name: "Radisson Heights", href: "/locations/calgary#albert-park-radisson-heights" },
  { name: "Dover", href: "/locations/calgary#dover" },
  { name: "Southview", href: "/locations/calgary#southview" },
  { name: "Erin Woods" },
  { name: "Penbrooke Meadows" },
  { name: "Inglewood", href: "/locations/calgary#inglewood" },
  { name: "Ogden", href: "/locations/calgary#ogden" },
  { name: "Marlborough" },
  { name: "Downtown Calgary", href: "/locations/calgary#downtown-calgary" },
];

export const revalidate = 3600;

const PATH = "/";

export const metadata: Metadata = buildMetadata({
  title: "Cell Phone & Computer Repair in Calgary",
  description:
    "Walk-in phone, tablet and computer repair at 3317 17 Ave SE, Calgary. Most repairs take about 30 minutes. Parts and labour included, 60-day warranty.",
  path: PATH,
});

/**
 * The one entry point into the repair journey.
 *
 * There used to be two sections here doing the same job: a four-card photo grid
 * asking "which device needs fixing?" and this six-card grid asking "what can we
 * fix for you?". Both linked to the same service hubs, so the page asked a
 * visitor to choose a device twice. The photographs were the better half and the
 * icon wells were the weaker, so the photographs moved into this grid and the
 * device section went.
 *
 * Every card carries a photograph. The last two were drawn until the client
 * supplied originals for them: the stand-ins had been a second crop of the
 * frame `service-tablet-repair` uses, which put two crops of one photograph in
 * this grid, and a laptop being opened with a screwdriver, which is not what a
 * password reset involves. Both slots now hold the supplied images, on their
 * hub pages too.
 *
 * The `illustration` on each card is still the fallback when public/demo/ is
 * absent, which is what keeps the demo set from being load-bearing. The frame
 * is identical either way: see components/blocks/ServiceCard.tsx.
 *
 * `service-password-reset` is the one image in the set that does not meet
 * CLAUDE.md Section 8.9, because the wordmark is the dominant element on a
 * plain background. The client was shown that position and chose the image.
 * It is recorded in IMAGE_EDITS so the decision is auditable rather than
 * silent.
 */
const SERVICE_CARDS: {
  title: string;
  description: string;
  href: string;
  image?: string;
  illustration: RepairSubject;
}[] = [
  {
    title: "Phone repair",
    description:
      "Screens, batteries, charging ports and cameras on iPhone, Samsung Galaxy and Google Pixel. Most take about 30 minutes.",
    href: "/services/phone-repair",
    image: "service-phone-repair",
    illustration: "screen",
  },
  {
    title: "iPad and tablet repair",
    description:
      "Cracked iPad glass, batteries and charging ports. On older iPads the glass alone can be replaced, which is a much smaller job than a full screen.",
    href: "/services/tablet-repair",
    image: "service-tablet-repair",
    illustration: "screen",
  },
  {
    title: "Laptop repair",
    description:
      "Screens, charging sockets and keyboards on laptops of every make. Usually ready the same day.",
    href: "/services/laptop-repair",
    image: "service-laptop-repair",
    illustration: "keyboard",
  },
  {
    title: "Computer repair",
    description:
      "Diagnostics, virus removal, and a full clean-up and tune-up including dust removal.",
    href: "/services/computer-repair",
    image: "service-computer-repair",
    illustration: "board",
  },
  {
    title: "Carrier unlocking",
    description:
      "Any Canadian carrier unlocked, usually the same day. Unlocking does not erase your data.",
    href: "/services/phone-unlocking",
    image: "service-phone-unlocking",
    illustration: "sim",
  },
  {
    title: "Password reset",
    description:
      "A locked Windows account reset, with the files on the machine left exactly where they are.",
    href: "/services/password-reset",
    image: "service-password-reset",
    illustration: "lock",
  },
];

export default async function HomePage() {
  const [settings, reviews, brands, faqs] = await Promise.all([
    getSiteSettings(),
    getReviewSummary(),
    getBrands(),
    getGlobalFaqs(8),
  ]);

  const warrantyDays = settings?.warrantyDays ?? 60;
  const waitMinutes = settings?.typicalWaitMinutes ?? 30;

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
          <PillButton href="/contact">Ask for a quote</PillButton>
          <PillButton href={TEL_HREF} variant="ghostOnDark" withArrow={false}>
            Call {SITE.phone}
          </PillButton>
        </>
      }
      heroImage={heroImage}
      answerBox={{
        answer: `TechBrotherz is a walk-in cell phone and computer repair shop at ${SITE.street} in Calgary. Every repair is quoted free at the counter before any work starts, with the part and the labour in one figure. Most repairs take about ${waitMinutes} minutes, no appointment is needed, and every repair carries a ${warrantyDays}-day warranty.`,
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
      {/* ------------------------------------------- ticker + benefit strip
          Phase 8 spec section 6: the ticker sits directly under the hero and
          the benefit strip follows it. Both are full bleed, so the page breaks
          to black twice before the first light section rather than running as
          one continuous field. The TrustStrip that used to sit here carried the
          same four facts, so it is replaced rather than stacked above them. */}
      <Ticker />
      <section aria-labelledby="why-techbrotherz">
        <h2 id="why-techbrotherz" className="sr-only">
          Why customers choose TechBrotherz
        </h2>
        <BenefitStrip />
      </section>

      {/* ------------------------------------------------------ icon cards */}
      <Section variant="tint" aria-labelledby="how-it-works-heading">
        <Heading
          level={2}
          id="how-it-works-heading"
          eyebrow="Why us"
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

      {/* -------------------------------------------------------- services
          The single entry point into the repair journey. See SERVICE_CARDS
          above for why the device grid that used to sit above the ticker is
          gone and its photographs are here. */}
      <Section aria-labelledby="services-heading">
        <Heading
          level={2}
          id="services-heading"
          eyebrow="Services"
          lead="TechBrotherz repairs phones, tablets, laptops and desktop computers, and unlocks phones for any Canadian carrier."
        >
          What can we fix for you?
        </Heading>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICE_CARDS.map((card) => (
            <ServiceCard
              key={card.title}
              title={card.title}
              description={card.description}
              image={card.image}
              illustration={card.illustration}
              sizes="(min-width: 1024px) 380px, (min-width: 768px) 45vw, 92vw"
              {...(shouldRenderLink(card.href)
                ? { link: { label: `${card.title} details`, href: card.href } }
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
            description="We test the device and give you the exact figure before any work starts. The quote is free."
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

      {/* --------------------------------------------------- brand strip */}
      <Section variant="tint" aria-labelledby="brands-heading">
        <Heading
          level={2}
          id="brands-heading"
          eyebrow="Brands"
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
          cta={{ label: "Ask for a quote", href: "/contact" }}
          {...splitImage("home-split-individuals")}
        />

        <SplitBlock
          className="mt-24"
          reverse
          eyebrow="For businesses"
          heading="Fleets of laptops and phones, kept working"
          lead="Small businesses across southeast Calgary use TechBrotherz for repairs, Windows installs and clean-ups on staff devices."
          checklist={[
            "Windows installation including Office and security",
            "Desktop clean-up and tune-up, quoted per machine",
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
          lead={`TechBrotherz is on the stretch of 17 Avenue SE known as International Avenue, in southeast Calgary a few blocks west of Forest Lawn. Street parking runs along 17 Avenue SE outside the shop.`}
        >
          Where is TechBrotherz in Calgary?
        </Heading>

        <LocalInfoCard className="mt-10" headingLevel={3} heading="TechBrotherz, Calgary" />

        {/* Neighbourhood tiles, per Phase 8 spec section 6. Every name is one
            already listed on the Calgary location record, so this adds coverage
            the site already claims rather than a new claim. Forest Lawn links to
            its page, areas with an anchored section on /locations/calgary link
            to that section, and the rest are arrowless plain rows. */}
        <h3 className="type-h3 text-tb-ink mt-12">Areas we serve in southeast Calgary</h3>
        <TileGrid className="mt-5">
          {CALGARY_AREAS.map((area) => (
            <Tile key={area.name} href={area.href}>
              {area.name}
            </Tile>
          ))}
        </TileGrid>

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
