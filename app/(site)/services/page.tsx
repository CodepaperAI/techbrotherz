import Link from "next/link";
import type { Metadata } from "next";

import type { RepairSubject } from "@/components/blocks/RepairIllustration";
import { ScopedFaqs } from "@/components/blocks/ScopedFaqs";
import { PageShell } from "@/components/blocks/PageShell";
import { ServiceCard } from "@/components/blocks/ServiceCard";
import { Container } from "@/components/primitives/Container";
import { Heading } from "@/components/primitives/Heading";
import { PillButton } from "@/components/primitives/PillButton";
import { Section } from "@/components/primitives/Section";
import { shouldRenderLink } from "@/lib/routes";
import { getCoreFaqContext } from "@/lib/content/core-context";
import { servicesFaqs } from "@/lib/content/core-faqs";
import { composeFaqs, globalLinks } from "@/lib/faq/scoping";
import { buildMetadata } from "@/lib/seo/metadata";
import { localBusiness, organization, service, webPage, website } from "@/lib/seo/schema";
import { SITE, TEL_HREF } from "@/lib/site";
import { getAllFaqs, getReviewSummary, getSiteSettings } from "@/lib/data";

export const revalidate = 3600;

const PATH = "/services";

export const metadata: Metadata = buildMetadata({
  title: "Repair Services in Calgary",
  description:
    "Every repair TechBrotherz offers in Calgary: phones, iPads, tablets, laptops, desktops, unlocking, virus removal and password reset. Walk in, no appointment.",
  path: PATH,
});

/**
 * The seven service hubs, grouped by device.
 *
 * Photograph-led rather than icon-led, matching the home grid. Each card names
 * the same demo slot its own hub page uses as a header, so a visitor arriving
 * from here sees the picture they clicked, and there is one place to change an
 * image rather than two.
 *
 * `illustration` is the fallback for a build with public/demo/ deleted, which
 * is what keeps the demo set from being load-bearing. The media frame is
 * identical either way: see components/blocks/ServiceCard.tsx.
 *
 * The `icon` and `priceKey` fields are gone. `priceKey` indexed price lookups
 * that no longer exist, and the icons were what the photographs replaced.
 */
interface ServiceEntry {
  title: string;
  href: string;
  group: "Phones" | "iPads" | "Computers" | "Consoles" | "In Store";
  description: string;
  /** Demo slot in lib/content/images.ts. */
  image: string;
  illustration: RepairSubject;
}

const SERVICE_CARDS: ServiceEntry[] = [
  {
    title: "Cell phone repair",
    href: "/services/phone-repair",
    group: "Phones",
    description:
      "Screens, batteries, charging ports, cameras and buttons on iPhone, Samsung Galaxy and Google Pixel handsets.",
    image: "service-phone-repair",
    illustration: "screen",
  },
  {
    title: "Phone unlocking",
    href: "/services/phone-unlocking",
    group: "Phones",
    description:
      "Any Canadian carrier, usually the same day. Ask your carrier first, they are required by the CRTC to do it free on request.",
    image: "service-phone-unlocking",
    illustration: "sim",
  },
  {
    title: "iPad repair",
    href: "/services/ipad-repair",
    group: "iPads",
    description:
      "On older iPads the glass is separate from the picture panel, so a cracked front often costs far less than people expect.",
    image: "service-tablet-repair",
    illustration: "screen",
  },
  {
    title: "Laptop repair",
    href: "/services/laptop-repair",
    group: "Computers",
    description:
      "Screens, keyboards and charging sockets. Laptop work is stripped down and tested, so it is usually ready the same day.",
    image: "service-laptop-repair",
    illustration: "keyboard",
  },
  {
    title: "Computer repair",
    href: "/services/computer-repair",
    group: "Computers",
    description:
      "Desktop diagnostics, clean-ups, Windows installation and hardware fitting, at a flat price agreed before we start.",
    image: "service-computer-repair",
    illustration: "board",
  },
  {
    title: "Virus removal",
    href: "/services/virus-removal",
    group: "Computers",
    description:
      "Malware, adware and browser hijackers removed, with security software left in place so it does not come straight back.",
    image: "service-virus-removal",
    illustration: "diagnostic",
  },
  {
    title: "Computer password reset",
    href: "/services/password-reset",
    group: "Computers",
    description:
      "Locked out of Windows. We restore access and leave the files on the machine exactly where they are.",
    image: "service-password-reset",
    illustration: "lock",
  },
  {
    title: "Google unlocking and FRP removal",
    href: "/services/frp-removal",
    group: "Phones",
    description:
      "For owners locked out after a factory reset. Proof of ownership is required, without exception, and the free routes are checked first.",
    image: "service-frp-removal",
    illustration: "lock",
  },
  {
    title: "Buy, sell and trade",
    href: "/buy-sell-trade",
    group: "In Store",
    description:
      "Sell your phone, computer or laptop, buy one, or trade one in. Valued at the Store, with the figure agreed before anything changes hands.",
    image: "buy-sell-trade",
    illustration: "screen",
  },
  {
    title: "Accessories",
    href: "/accessories",
    group: "In Store",
    description:
      "Cases, tempered glass, privacy screen protectors, cables and chargers, MacBook chargers and HDMI cables, stocked in Store.",
    /* No cleared photograph yet; the slot is empty so the illustration renders. */
    image: "service-accessories",
    illustration: "screen",
  },
  {
    title: "Gaming console repair",
    href: "/services/game-console-repair",
    group: "Consoles",
    description:
      "Xbox One, Xbox Series X and S, PS4, PS5 and Nintendo Switch. Diagnosed first, with the price agreed before any work starts.",
    image: "service-game-console-repair",
    illustration: "port",
  },
];

const GROUP_ORDER: ServiceEntry["group"][] = ["Phones", "iPads", "Computers", "Consoles", "In Store"];

const GROUP_QUESTION: Record<ServiceEntry["group"], string> = {
  Phones: "What phone repairs does TechBrotherz do?",
  iPads: "What iPad repairs does TechBrotherz do?",
  Computers: "What laptop and computer work does TechBrotherz do?",
  Consoles: "What gaming console repairs does TechBrotherz do?",
  "In Store": "What else can you do in the Store?",
};

export default async function ServicesPage() {
  const [settings, reviews, allFaqs] = await Promise.all([
    getSiteSettings(),
    getReviewSummary(),
    getAllFaqs(),
  ]);

  const warrantyDays = settings?.warrantyDays ?? 60;
  const waitMinutes = settings?.typicalWaitMinutes ?? 30;

  // FAQ scoping rule, CLAUDE.md Section 8.8. Questions this page can answer
  // with its own numbers, plus at most two pointers to the canonical
  // answers on /faq. Only the page-specific ones reach structured data.
  const coreCtx = await getCoreFaqContext();
  const faqs = composeFaqs({
    path: PATH,
    pageSpecific: servicesFaqs(coreCtx),
    globalLinks: globalLinks(allFaqs, ["walkin", "pricing"], 2),
  });

  const schema = [
    organization(settings ?? {}),
    website(settings ?? {}),
    localBusiness(settings ?? {}, reviews),
    webPage({
      type: "CollectionPage",
      name: "Repair services at TechBrotherz in Calgary",
      description:
        "Every repair TechBrotherz offers in Calgary, from phone screens to Windows installation.",
      path: PATH,
      speakableSelectors: ['[data-speakable="answer"]'],
    }),
    ...SERVICE_CARDS.map((card) =>
      service({
        name: card.title,
        description: card.description,
        path: card.href,
        serviceType: card.title,
      }),
    ),
    faqs.schema,
  ];

  return (
    <PageShell
      path={PATH}
      eyebrow="Services"
      title="Phone, tablet and computer repair services in Calgary"
      crumbLabel="Services"
      lead={
        <>
          TechBrotherz, a walk-in cell phone and computer repair store at {SITE.street} in{" "}
          {SITE.city}, {SITE.region}, repairs iPhones, Samsung, Google Pixel, Motorola, LG and
          other Android phones, iPads, laptops including MacBooks and gaming laptops, desktop
          computers including gaming towers, and gaming consoles, and unlocks phones for any Canadian
          carrier.
        </>
      }
      answerBox={{
        answer: `TechBrotherz in Calgary repairs iPhones, Samsung, Google Pixel, Motorola, LG and other Android phones, iPads, laptops and MacBooks, desktop computers and gaming machines, and gaming consoles, and unlocks phones for any Canadian carrier. Every job is quoted free at the Store before any work starts, no appointment is needed, and every repair carries a ${warrantyDays}-day warranty.`,
        keyFacts: [
          {
            label: "Devices",
            value: "Phones of every brand, iPads, laptops, desktops, gaming consoles",
          },
          {
            label: "Computer diagnostics",
            value: "A fixed fee, deducted from the repair if you go ahead",
          },
          { label: "Carrier unlocking", value: "Any Canadian carrier, usually the same day" },
          { label: "Typical wait", value: `About ${waitMinutes} minutes on a phone repair` },
          { label: "Warranty", value: `${warrantyDays} days on every repair` },
        ],
        lastUpdated: settings?._updatedAt,
      }}
      schema={schema}
    >
      {GROUP_ORDER.map((group, index) => {
        const cards = SERVICE_CARDS.filter((card) => card.group === group);
        if (cards.length === 0) return null;

        return (
          <Section
            key={group}
            variant={index % 2 === 0 ? "tint" : "light"}
            className={index === 0 ? "pt-0 md:pt-0 lg:pt-0" : undefined}
            aria-labelledby={`group-${group}`}
          >
            <Heading level={2} id={`group-${group}`} eyebrow={group}>
              {GROUP_QUESTION[group]}
            </Heading>

            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {cards.map((card) => (
                <ServiceCard
                  key={card.title}
                  title={card.title}
                  description={`${card.description} Quoted free at the Store, with the part and the labour included.`}
                  image={card.image}
                  illustration={card.illustration}
                  sizes="(min-width: 1024px) 380px, (min-width: 768px) 45vw, 92vw"
                  {...(shouldRenderLink(card.href)
                    ? { link: { label: `${card.title} details`, href: card.href } }
                    : {})}
                />
              ))}
            </div>
          </Section>
        );
      })}

      {/* ------------------------------------------------- what's included */}
      <Section aria-labelledby="included-heading">
        <Heading
          level={2}
          id="included-heading"
          eyebrow="Included"
          lead="The same four things apply to every repair on this page, whatever the device."
        >
          What is included in the price?
        </Heading>

        <div className="border-tb-border bg-tb-white rounded-card mt-10 overflow-x-auto border">
          <table className="w-full min-w-[32rem] border-collapse text-left">
            <caption className="sr-only-caption">
              What is included in every TechBrotherz repair price
            </caption>
            <thead>
              <tr className="tb-thead">
                <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-3">
                  Included
                </th>
                <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-3">
                  What that means
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["The part", "The replacement component itself, whatever the device needs."],
                [
                  "The labour",
                  "The time to fit it. There is no separate bench fee on a phone repair.",
                ],
                [
                  "Testing",
                  "We test the repair before handing the device back: touch across the whole screen, cameras, speakers and charging.",
                ],
                [
                  `${warrantyDays}-day warranty`,
                  "Cover on both the part fitted and the workmanship. New accidental damage is not covered.",
                ],
              ].map(([label, detail]) => (
                <tr key={label} className="border-tb-border border-t">
                  <th
                    scope="row"
                    className="text-tb-text px-6 py-4 text-left align-top font-normal"
                  >
                    {label}
                  </th>
                  <td className="type-body text-tb-muted px-6 py-4">{detail}</td>
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
          . The terms of the {warrantyDays}-day cover are set out on{" "}
          <Link href="/warranty" className="text-tb-green-deep hover:underline">
            the warranty page
          </Link>
          , and{" "}
          <Link href="/contact" className="text-tb-green-deep hover:underline">
            directions to the Calgary store
          </Link>{" "}
          include parking and transit.
        </p>
      </Section>

      {/* ------------------------------------------------------------ faqs */}
      <ScopedFaqs
        faqs={faqs}
        id="page-faq-heading"
        heading="Questions about our repair services"
        variant="tint"
      />

      {/* --------------------------------------------------------- cta band */}
      <Section variant="dark" contained={false}>
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <h2 className="type-h2 text-tb-white">Not sure which repair you need?</h2>
              <p className="type-lead measure text-tb-muted-dark mt-4">
                Bring the device to {SITE.street} in {SITE.city}. We will diagnose it at the Store
                and tell you the price before any work starts.
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
