import { existsSync } from "node:fs";
import path from "node:path";

import Link from "next/link";
import type { Metadata } from "next";
import { Star } from "lucide-react";

import { ScopedFaqs } from "@/components/blocks/ScopedFaqs";
import { Ticker } from "@/components/blocks/Ticker";
import { Tile, TileGrid } from "@/components/blocks/Tile";
import { LocalInfoCard } from "@/components/blocks/LocalInfoCard";
import { MapReveal } from "@/components/blocks/MapReveal";
import { NumberedList } from "@/components/blocks/NumberedList";
import { OpenNowBadge } from "@/components/blocks/OpenNowBadge";
import { RatingBadge } from "@/components/blocks/RatingBadge";
import { DemoImage } from "@/components/blocks/DemoImage";
import { PageShell } from "@/components/blocks/PageShell";
import { ServiceCard } from "@/components/blocks/ServiceCard";
import type { RepairSubject } from "@/components/blocks/RepairIllustration";
import { Card } from "@/components/primitives/Card";
import { Container } from "@/components/primitives/Container";
import { Heading } from "@/components/primitives/Heading";
import { PillButton } from "@/components/primitives/PillButton";
import { Section } from "@/components/primitives/Section";
import { route, shouldRenderLink } from "@/lib/routes";
import { SERVICE_AREAS } from "@/lib/content/service-areas";
import { blurFor, demoImage } from "@/lib/content/images";
import { getCoreFaqContext } from "@/lib/content/core-context";
import { homeFaqs } from "@/lib/content/core-faqs";
import { composeFaqs, globalLinks } from "@/lib/faq/scoping";
import { buildMetadata } from "@/lib/seo/metadata";
import { localBusiness, organization, webPage, website } from "@/lib/seo/schema";
import { SITE, TEL_HREF, groupedHours } from "@/lib/site";
import {
  getBrandHub,
  getGlobalFaqs,
  getReviewSummary,
  getSiteSettings,
  getTestimonials,
} from "@/lib/data";

/*
 * The service-area tiles come from the client's Google Business Profile list,
 * one shared module driving the schema, both tile grids and the footer.
 * Airdrie keeps its tile via the honest section route. Every tile navigates
 * somewhere real; the link audit verifies each anchor target exists.
 */
const CALGARY_AREAS: { name: string; href?: string }[] = [
  ...SERVICE_AREAS,
  { name: "Airdrie", href: "/locations/calgary#airdrie" },
];

/** The service pill strip directly under the hero, mirroring the reference. */
const SERVICE_PILLS: { label: string; href: string }[] = [
  { label: "Iphone Repair", href: "/repair/apple-iphone" },
  { label: "Samsung Repair", href: "/repair/samsung-galaxy" },
  { label: "IPad Repair", href: "/services/ipad-repair" },
  { label: "Laptop Repair", href: "/services/laptop-repair" },
  { label: "Computer Repair", href: "/services/computer-repair" },
  { label: "Unlocking", href: "/services/phone-unlocking" },
];

/**
 * Brands the store services, every one confirmed by the client's own device
 * list ("laptops of every make" covers the PC names; the console page covers
 * the console names). Text chips only, no manufacturer logos, per the
 * standing trademark rule. OnePlus is deliberately absent: the client has not
 * named it, so it stays under "other Android phones" until they do
 * (CLAUDE.md question 31). Each chip links to the page that covers it.
 */
const BRAND_NAMES: { label: string; href: string }[] = [
  { label: "Iphone", href: "/repair/apple-iphone" },
  { label: "IPad", href: "/repair/apple-ipad" },
  { label: "MacBook", href: "/services/laptop-repair" },
  { label: "Samsung Galaxy", href: "/repair/samsung-galaxy" },
  { label: "Google Pixel", href: "/repair/google-pixel" },
  { label: "Motorola", href: "/services/phone-repair" },
  { label: "LG", href: "/services/phone-repair" },
  { label: "HP", href: "/services/laptop-repair" },
  { label: "Dell", href: "/services/laptop-repair" },
  { label: "Lenovo", href: "/services/laptop-repair" },
  { label: "ASUS", href: "/services/laptop-repair" },
  { label: "Acer", href: "/services/laptop-repair" },
  { label: "PlayStation 4", href: "/services/game-console-repair" },
  { label: "PlayStation 5", href: "/services/game-console-repair" },
  { label: "Xbox", href: "/services/game-console-repair" },
  { label: "Xbox Series", href: "/services/game-console-repair" },
  { label: "Nintendo Switch", href: "/services/game-console-repair" },
];

export const revalidate = 3600;

const PATH = "/";

export const metadata: Metadata = buildMetadata({
  title: "Cell Phone & Computer Repair in SE Calgary",
  description:
    "Walk-in phone, IPad and computer repair at 3317 17 Ave SE, Calgary. Most repairs take about 30 minutes. Free quote before any work, 60-day warranty.",
  path: PATH,
});

/**
 * The one entry point into the repair journey. Every card carries a photograph
 * with the illustration as the fallback when public/demo/ is absent, which is
 * what keeps the demo set from being load-bearing.
 *
 * `service-password-reset` is the one image in the set that does not meet
 * CLAUDE.md Section 8.9: the supplied FRP graphic uses the Google mark as a
 * design element inside its padlock motif. The client chose the image with
 * that position on record, in IMAGE_EDITS.
 */
interface HomeServiceCard {
  title: string;
  description: string;
  href: string;
  image?: string;
  illustration: RepairSubject;
  tags: string[];
}

/*
 * Split into Repairs and In-Store groups 2026-08, when FRP removal,
 * buy-sell-trade and accessories joined and eleven cards in one grid read as
 * a wall. Chips show the four most-searched repairs per card; the service
 * pages carry the full lists.
 */
const REPAIR_CARDS: HomeServiceCard[] = [
  {
    title: "Phone repair",
    description:
      "Screens and LCDs, batteries, charging ports, cameras and lenses, speakers, back glass and full housings, on Iphone, Samsung Galaxy and Google Pixel.",
    href: "/services/phone-repair",
    image: "service-phone-repair",
    illustration: "screen",
    tags: ["Screen", "Battery", "Charging port", "Back glass"],
  },
  {
    title: "IPad repair",
    description:
      "IPad screens, digitizer glass, batteries and charging ports. On older IPads the glass alone can be replaced, a much smaller job than a full screen.",
    href: "/services/ipad-repair",
    image: "service-tablet-repair",
    illustration: "screen",
    tags: ["Screen", "Digitizer", "Battery", "Charging port"],
  },
  {
    title: "Laptop repair",
    description:
      "Screens, batteries, keyboards, charging jacks, broken hinges, water damage cleanup and data recovery, on laptops of every make.",
    href: "/services/laptop-repair",
    image: "service-laptop-repair",
    illustration: "keyboard",
    tags: ["Screen", "Battery", "Keyboard", "DC jack"],
  },
  {
    title: "Computer repair",
    description:
      "Diagnostics, virus removal, and a full clean-up and tune-up including dust removal.",
    href: "/services/computer-repair",
    image: "service-computer-repair",
    illustration: "board",
    tags: ["Diagnostics", "Tune-up", "Windows", "Data recovery"],
  },
  {
    title: "Gaming console repair",
    description:
      "Xbox One, Xbox Series X and S, PS4, PS5 and Nintendo Switch. Diagnosed first, with the price agreed before any work starts.",
    href: "/services/game-console-repair",
    image: "service-game-console-repair",
    illustration: "port",
    tags: ["Xbox", "PlayStation", "Switch"],
  },
  {
    title: "Virus removal",
    description:
      "Malware, adware and browser hijackers removed, with security software left running so it does not come straight back.",
    href: "/services/virus-removal",
    image: "service-virus-removal",
    illustration: "diagnostic",
    tags: ["Malware", "Pop-ups", "Protection"],
  },
];

const STORE_CARDS: HomeServiceCard[] = [
  {
    title: "Carrier unlocking",
    description:
      "Any Canadian carrier unlocked, usually the same day. Unlocking does not erase your data.",
    href: "/services/phone-unlocking",
    image: "service-phone-unlocking",
    illustration: "sim",
    tags: ["All carriers", "Same day", "Data kept"],
  },
  {
    title: "Google unlocking & FRP removal",
    description:
      "For owners locked out after a factory reset. Proof of ownership is required, without exception.",
    href: "/services/frp-removal",
    image: "service-frp-removal",
    illustration: "lock",
    tags: ["Google lock", "FRP", "Proof required"],
  },
  {
    title: "Password reset",
    description:
      "A locked Windows account reset, with the files on the machine left exactly where they are.",
    href: "/services/password-reset",
    image: "service-password-reset",
    illustration: "lock",
    tags: ["Windows", "Files kept", "Same day"],
  },
  {
    title: "Buy, sell and trade",
    description:
      "Sell your phone, computer or laptop, buy one, or trade one in. Valued at the Store with the figure agreed before anything changes hands.",
    href: "/buy-sell-trade",
    image: "buy-sell-trade",
    illustration: "screen",
    tags: ["Sell", "Buy", "Trade-in"],
  },
  {
    title: "Accessories",
    description:
      "Cases, tempered glass, privacy screen protectors, cables and chargers, MacBook chargers and HDMI cables, in Store.",
    href: "/accessories",
    image: "service-accessories",
    illustration: "screen",
    tags: ["Cases", "Tempered glass", "Chargers", "HDMI"],
  },
];

export default async function HomePage() {
  const [settings, reviews, faqs, testimonials, iphoneHub, samsungHub] = await Promise.all([
    getSiteSettings(),
    getReviewSummary(),
    getGlobalFaqs(8),
    getTestimonials(6),
    getBrandHub("apple-iphone"),
    getBrandHub("samsung-galaxy"),
  ]);

  const warrantyDays = settings?.warrantyDays ?? 60;
  const waitMinutes = settings?.typicalWaitMinutes ?? 30;
  const hours = groupedHours();

  // FAQ scoping rule, CLAUDE.md Section 8.8.
  const coreCtx = await getCoreFaqContext();
  const scopedFaqs = composeFaqs({
    path: PATH,
    pageSpecific: homeFaqs(coreCtx),
    globalLinks: globalLinks(faqs, ["walkin", "warranty"], 2),
  });

  /*
   * The service directory, the reference site's strongest SEO element: four
   * columns of deep links above the footer. Model links come from the live
   * catalogue, so only published pages are ever linked.
   */
  const directory: { heading: string; links: { label: string; href: string }[] }[] = [
    {
      heading: "Common repairs",
      links: [
        "/repairs/iphone-screen-replacement",
        "/repairs/iphone-battery-replacement",
        "/repairs/iphone-charging-port-repair",
        "/repairs/iphone-back-glass-replacement",
        "/repairs/samsung-screen-replacement",
        "/repairs/samsung-battery-replacement",
        "/repairs/samsung-charging-port-repair",
        "/repairs/ipad-screen-replacement",
      ]
        .filter((href) => shouldRenderLink(href))
        .map((href) => ({ label: route(href)?.label ?? href, href }))
        // The one published Pixel. Sibling links are same-brand, so without
        // this the page sits below the two-inbound-links floor.
        .concat([{ label: "Google Pixel 6 repair", href: "/repair/google-pixel/pixel-6" }]),
    },
    {
      heading: "Iphone models",
      links: (iphoneHub?.models ?? []).slice(0, 8).map((model) => ({
        label: `${model.name} repair`,
        href: `/repair/apple-iphone/${model.slug}`,
      })),
    },
    {
      heading: "Samsung models",
      links: (samsungHub?.models ?? []).slice(0, 8).map((model) => ({
        label: `${model.name} repair`,
        href: `/repair/samsung-galaxy/${model.slug}`,
      })),
    },
    {
      heading: "Laptops and computers",
      links: [
        "/services/laptop-repair",
        "/services/computer-repair",
        "/repairs/laptop-screen-replacement",
        "/repairs/laptop-keyboard-replacement",
        "/repairs/laptop-charging-port-repair",
        "/repairs/windows-installation",
        "/repairs/computer-tune-up",
        "/repairs/computer-diagnostics",
      ]
        .filter((href) => shouldRenderLink(href))
        .map((href) => ({ label: route(href)?.label ?? href, href })),
    },
  ];

  /*
   * The skyline hero background, used on the client's explicit instruction
   * (see the IMAGE_EDITS note on this slot). When the file is absent the hero
   * degrades to the solid black panel, so the demo set stays non-load-bearing.
   */
  const skyline = demoImage("home-hero-skyline");
  const skylineOnDisk =
    skyline && existsSync(path.join(process.cwd(), "public", skyline.file.replace(/^\//, "")));
  const heroBackground = skylineOnDisk
    ? { src: skyline.file, blurDataURL: blurFor("home-hero-skyline") }
    : undefined;

  const schema = [
    organization(settings ?? {}),
    website(settings ?? {}),
    localBusiness(settings ?? {}, reviews),
    webPage({
      type: "WebPage",
      name: "Cell phone and computer repair in SE Calgary",
      description:
        "TechBrotherz is a walk-in cell phone, IPad and computer repair store at 3317 17 Ave SE in Calgary, Alberta.",
      path: PATH,
      speakableSelectors: ['[data-speakable="answer"]'],
    }),
    scopedFaqs.schema,
  ];

  return (
    <PageShell
      path={PATH}
      layout="hero"
      eyebrow="Walk-in repair store · No appointment"
      title={
        // JSX bypasses the h1's titleCase pass, so the Title Case is written in.
        <>
          Phone and Computer Repair in <span className="text-tb-green">SE Calgary</span>
        </>
      }
      lead={
        <>
          Walk in at {SITE.street}. Most repairs take about {waitMinutes} minutes and every one
          carries a {warrantyDays}-day warranty.
        </>
      }
      heroActions={
        <>
          <PillButton href={TEL_HREF} withArrow={false}>
            Call {SITE.phone}
          </PillButton>
          <PillButton href="/contact" variant="ghostOnDark">
            Get a quote
          </PillButton>
        </>
      }
      heroBackground={heroBackground}
      answerAside={
        /* The client asked for a phone repair photograph beside the AnswerBox
           (2026-08). The home-hero slot, a phone in a repair jig under a
           precision screwdriver, has been unused since the skyline took the
           hero background, so it moves here rather than a new download. */
        <DemoImage
          slot="home-hero"
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="h-full min-h-56 lg:aspect-auto"
        />
      }
      heroOverlap={
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {[
            {
              stat: `${waitMinutes} min`,
              label: "Most repairs",
              body: "Screens and batteries finished while you wait.",
            },
            {
              stat: `${warrantyDays} days`,
              label: "Warranty",
              body: "On the part fitted and the work done, every repair.",
            },
            {
              stat: "Walk in",
              label: "No appointment",
              body: "No booking system. Come in during opening hours.",
            },
            /* The fourth slot belongs to the Google rating the moment real
               data arrives; until then the hours card holds it. */
            ...(reviews?.enabled
              ? []
              : [
                  {
                    stat: "7 days",
                    label: "Open every day",
                    body: "Mon to Sat 10 to 7, Sunday 11 to 5.",
                  },
                ]),
          ].map((card) => (
            <Card key={card.label} className="shadow-sm">
              <p className="type-numeral text-tb-green-deep">{card.stat}</p>
              <p className="type-h3 text-tb-text mt-2">{card.label}</p>
              <p className="type-caption text-tb-muted mt-1.5">{card.body}</p>
            </Card>
          ))}
          {reviews?.enabled ? (
            <Card className="shadow-sm">
              <RatingBadge reviews={reviews} />
            </Card>
          ) : null}
        </div>
      }
      answerBox={{
        answer: `TechBrotherz is a walk-in cell phone and computer repair store at ${SITE.street} in Calgary. Every repair is quoted free at the Store before any work starts, with the part and the labour in one figure. Most repairs take about ${waitMinutes} minutes, no appointment is needed, and every repair carries a ${warrantyDays}-day warranty.`,
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
      {/* ------------------------------------------------- service pill row */}
      <nav aria-label="Popular repair services" className="border-tb-border bg-tb-white border-b">
        <Container className="flex flex-wrap items-center justify-center gap-2 py-4">
          {SERVICE_PILLS.filter((pill) => shouldRenderLink(pill.href)).map((pill) => (
            <Link
              key={pill.href + pill.label}
              href={pill.href}
              className="type-caption border-tb-border text-tb-text rounded-pill hover:border-tb-green-deep hover:text-tb-green-deep border px-4 py-2 font-medium transition-colors duration-[180ms]"
            >
              {pill.label}
            </Link>
          ))}
        </Container>
      </nav>

      {/* ----------------------------------------------------------- ticker */}
      <Ticker />

      {/* -------------------------------------------------------- services */}
      <Section id="services" aria-labelledby="services-heading" className="scroll-mt-24">
        <Heading
          level={2}
          id="services-heading"
          eyebrow="Services"
          lead="TechBrotherz repairs phones, IPads, laptops, desktop computers and gaming consoles in SE Calgary, unlocks phones, and buys, sells and trades devices in Store."
        >
          What can we fix for you in <span className="text-tb-green-deep">Calgary</span>?
        </Heading>

        {[
          { label: "Repairs", cards: REPAIR_CARDS },
          { label: "More in the Store", cards: STORE_CARDS },
        ].map((group) => (
          <div key={group.label}>
            <h3 className="type-h3 text-tb-ink mt-14">{group.label}</h3>
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {group.cards.map((card) => (
                <ServiceCard
                  key={card.title}
                  title={card.title}
                  description={card.description}
                  image={card.image}
                  illustration={card.illustration}
                  tags={card.tags}
                  sizes="(min-width: 1024px) 380px, (min-width: 768px) 45vw, 92vw"
                  {...(shouldRenderLink(card.href)
                    ? { link: { label: `${card.title} details`, href: card.href } }
                    : {})}
                />
              ))}
            </div>
          </div>
        ))}

        <div className="mt-12 flex justify-center">
          <PillButton href="/services" variant="ghost">
            See all repair services
          </PillButton>
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

        {/* Names set in our own type, never manufacturer logos. CLAUDE.md 8.9. */}
        <ul className="mt-10 flex flex-wrap gap-3">
          {BRAND_NAMES.map((brand) => (
            <li key={brand.label}>
              <Link
                href={brand.href}
                className="border-tb-border bg-tb-white text-tb-text rounded-pill hover:border-tb-green-deep block border px-6 py-3 font-medium transition-colors duration-[180ms]"
              >
                {brand.label}
              </Link>
            </li>
          ))}
        </ul>

        <p className="type-body measure text-tb-muted mt-8">
          Each chip links to the page that covers it: the phone brands to their model catalogues,
          the computer makes to{" "}
          <Link href="/services/laptop-repair" className="text-tb-green-deep hover:underline">
            laptop repair
          </Link>
          , and the consoles to{" "}
          <Link href="/services/game-console-repair" className="text-tb-green-deep hover:underline">
            gaming console repair
          </Link>
          . An Android phone not named here is still taken at the same Store, quoted per model.
        </p>
      </Section>

      {/* ------------------------------------------------------ why us */}
      <Section aria-labelledby="why-us-heading">
        <Heading
          level={2}
          id="why-us-heading"
          eyebrow="Why us"
          lead="Six things that are true of TechBrotherz, and that you can hold us to."
        >
          Why <span className="text-tb-green-deep">Calgary</span> chooses TechBrotherz
        </Heading>

        <NumberedList
          className="mt-12"
          items={[
            {
              title: `${waitMinutes}-minute repairs`,
              body: `Most phone screen and battery repairs are finished in about ${waitMinutes} minutes at the Store, so you wait rather than come back.`,
            },
            {
              title: "All brands and devices",
              body: "Iphone, Samsung Galaxy, Google Pixel, IPads, laptops, desktops and gaming consoles, at one Store.",
            },
            {
              title: "Free quote before any work",
              body: "The device is diagnosed and the figure agreed before anything starts. The number you approve is the number you pay.",
            },
            {
              title: "Locally and family owned",
              body: "One family-owned Store, and the person who takes your device in is the person who repairs it.",
            },
            {
              title: `${warrantyDays}-day warranty`,
              body: `Every repair is covered for ${warrantyDays} days on both the part fitted and the work done.`,
            },
            /* Confirmed by the client 2026-08: the store buys and sells
               phones. Nothing here claims refurbished stock or instant
               trade-in quotes, because neither is confirmed. */
            {
              title: "We buy and sell phones",
              body: "Bring yours in for a quote at the Store, whether you are selling it, replacing it, or deciding between the two.",
            },
          ]}
        />
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
          {[
            {
              step: "01",
              title: "Walk in or call",
              body: `Bring the device to ${SITE.street}, or call ${SITE.phone} first to check the part for your model is in stock.`,
            },
            {
              step: "02",
              title: "Free quote",
              body: "We test the device and give you the exact figure before any work starts. Nothing begins until you agree to it.",
            },
            {
              step: "03",
              title: "Repaired while you wait",
              body: `Most repairs take about ${waitMinutes} minutes, and you leave with a ${warrantyDays}-day warranty on the part and the work.`,
            },
          ].map((item) => (
            <div key={item.step} className="border-tb-border-dark rounded-card border p-8">
              <span aria-hidden="true" className="type-numeral text-tb-green">
                {item.step}
              </span>
              <h3 className="type-h3 text-tb-white mt-4">{item.title}</h3>
              <p className="type-body text-tb-muted-dark mt-3">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* --------------------------------------------------------- reviews */}
      <Section id="reviews" aria-labelledby="reviews-heading" className="scroll-mt-24">
        <Heading
          level={2}
          id="reviews-heading"
          eyebrow="Reviews"
          lead="Reviews of TechBrotherz live on the store's Google listing, written by real customers on their own accounts."
        >
          What do customers say about TechBrotherz?
        </Heading>

        <RatingBadge reviews={reviews} className="mt-8" />

        {testimonials.length > 0 ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((entry) => (
              <Card key={entry._id}>
                {typeof entry.rating === "number" ? (
                  <div
                    className="flex gap-0.5"
                    role="img"
                    aria-label={`Rated ${entry.rating} out of 5`}
                  >
                    {Array.from({ length: entry.rating }, (_, i) => (
                      <Star
                        key={i}
                        aria-hidden="true"
                        size={16}
                        strokeWidth={1.5}
                        className="fill-tb-green-deep text-tb-green-deep"
                      />
                    ))}
                  </div>
                ) : null}
                <p className="type-body text-tb-text mt-4">{entry.text}</p>
                <p className="type-caption text-tb-muted mt-4">{entry.name}</p>
              </Card>
            ))}
          </div>
        ) : (
          <p className="type-body measure text-tb-muted mt-8">
            TechBrotherz does not write, buy or paste reviews onto this site. Read what customers
            actually say on the Google listing below, and if we have repaired something for you, an
            honest review there helps the next person decide.
          </p>
        )}

        <div className="mt-8">
          <PillButton href={SITE.googleReviewsUrl}>Read our reviews on Google</PillButton>
        </div>
      </Section>

      {/* ----------------------------------------------------------- hours */}
      <Section id="hours" variant="tint" aria-labelledby="hours-heading" className="scroll-mt-24">
        <div className="flex flex-wrap items-center gap-4">
          <Heading level={2} id="hours-heading" eyebrow="store hours">
            When is TechBrotherz open?
          </Heading>
          <OpenNowBadge />
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {hours.map((row) => (
            <Card key={row.label}>
              <h3 className="type-h3 text-tb-text">{row.label}</h3>
              <p className="type-numeral text-tb-green-deep mt-3">{row.value}</p>
            </Card>
          ))}
        </div>

        <p className="type-body measure text-tb-muted mt-8">
          Open seven days a week at {SITE.street}. No appointment at any time: walk in during the
          hours above and TechBrotherz starts on your device when you arrive.
        </p>
      </Section>

      {/* -------------------------------------------------- service areas */}
      <Section aria-labelledby="location-heading">
        <Heading
          level={2}
          id="location-heading"
          eyebrow="Service areas"
          lead={`TechBrotherz is on the stretch of 17 Avenue SE known as International Avenue, a few blocks west of Forest Lawn. Parking is free in the plaza in front of the store.`}
        >
          Serving <span className="text-tb-green-deep">SE Calgary</span> and beyond
        </Heading>

        <LocalInfoCard className="mt-10" headingLevel={3} heading="TechBrotherz, Calgary" />

        <MapReveal
          className="mt-6 h-80 md:h-96"
          src={SITE.googleMapsEmbedUrl}
          title="Map showing TechBrotherz at 3317 17 Ave SE, Calgary"
          addressLine={`${SITE.street}, ${SITE.city}, ${SITE.region}`}
        />

        {/* Every tile navigates somewhere real: a page, or an anchored section
            on /locations/calgary that the link audit verifies. */}
        <h3 className="type-h3 text-tb-ink mt-12">Areas We Serve From SE Calgary</h3>
        <TileGrid className="mt-5">
          {CALGARY_AREAS.map((area) => (
            <Tile key={area.name} href={area.href}>
              {area.name}
            </Tile>
          ))}
        </TileGrid>

        <p className="type-body measure text-tb-muted mt-8">
          We serve {SITE.city}, Chestermere, Airdrie and the surrounding Calgary communities. See{" "}
          <Link href="/locations" className="text-tb-green-deep hover:underline">
            the areas we serve
          </Link>{" "}
          for routes, or{" "}
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
        lead="The questions customers ask most before bringing a device in to the Calgary store."
        variant="light"
        aside={
          <Card>
            <h3 className="type-h3 text-tb-text">Still Not Sure?</h3>
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
                <Link href="/blog" className="text-tb-green-deep hover:underline">
                  Repair guides and answers
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
                {SITE.street}, {SITE.city}. Monday to Saturday 10:00 AM to 7:00 PM, Sunday 11:00 AM
                to 5:00 PM. Most phone repairs are done in about {waitMinutes} minutes while you
                wait.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <PillButton href={TEL_HREF} withArrow={false}>
                Call {SITE.phone}
              </PillButton>
              <PillButton href="/contact" variant="ghostOnDark">
                Get a quote
              </PillButton>
            </div>
          </div>
        </Container>
      </Section>

      {/* --------------------------------------------- service directory */}
      <Section aria-labelledby="directory-heading">
        <h2 id="directory-heading" className="type-eyebrow text-tb-green-deep">
          Find your repair
        </h2>
        <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {directory.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h3 className="type-h3 text-tb-text">{column.heading}</h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="type-body text-tb-muted hover:text-tb-green-deep transition-colors duration-[180ms]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
