import Link from "next/link";
import type { Metadata } from "next";

import { LocalInfoCard } from "@/components/blocks/LocalInfoCard";
import { ScopedFaqs } from "@/components/blocks/ScopedFaqs";
import { PageShell } from "@/components/blocks/PageShell";
import { TrustStrip } from "@/components/blocks/TrustStrip";
import { Card } from "@/components/primitives/Card";
import { Container } from "@/components/primitives/Container";
import { Heading } from "@/components/primitives/Heading";
import { PillButton } from "@/components/primitives/PillButton";
import { Section } from "@/components/primitives/Section";
import { getCoreFaqContext } from "@/lib/content/core-context";
import { aboutFaqs } from "@/lib/content/core-faqs";
import { composeFaqs, globalLinks } from "@/lib/faq/scoping";
import { buildMetadata } from "@/lib/seo/metadata";
import { localBusiness, organization, webPage, website } from "@/lib/seo/schema";
import { SITE, TEL_HREF } from "@/lib/site";
import {
  getAllFaqs,
  getAuthors,
  getBrands,
  getRepairTypes,
  getReviewSummary,
  getSiteSettings,
} from "@/sanity/queries";

export const revalidate = 3600;

const PATH = "/about";

export const metadata: Metadata = buildMetadata({
  title: "About TechBrotherz, Calgary",
  description:
    "TechBrotherz is a walk-in cell phone, tablet and computer repair shop at 3317 17 Ave SE in Calgary. What we repair, how we price it, and the 60-day warranty.",
  path: PATH,
});

export default async function AboutPage() {
  const [settings, reviews, brands, repairTypes, authors, allFaqs] = await Promise.all([
    getSiteSettings(),
    getReviewSummary(),
    getBrands(),
    getRepairTypes(),
    getAuthors(),
    getAllFaqs(),
  ]);

  const warrantyDays = settings?.warrantyDays ?? 60;
  const waitMinutes = settings?.typicalWaitMinutes ?? 30;

  /**
   * Everything below renders conditionally and vanishes cleanly when the Sanity
   * field is empty. An About page with no founding year is fine. An About page
   * with an invented one is a liability, so no claim appears here that is not
   * backed by a populated field. CLAUDE.md Section 12.
   */
  const foundedYear = settings?.foundedYear ?? null;
  const yearsTrading = foundedYear ? new Date().getFullYear() - foundedYear : null;
  const team = authors.filter((person) => person.name);

  // FAQ scoping rule, CLAUDE.md Section 8.8. Questions this page can answer
  // with its own numbers, plus at most two pointers to the canonical
  // answers on /faq. Only the page-specific ones reach structured data.
  const coreCtx = await getCoreFaqContext();
  const faqs = composeFaqs({
    path: PATH,
    pageSpecific: aboutFaqs(coreCtx),
    globalLinks: globalLinks(allFaqs, ["walkin", "parts"], 2),
  });

  const schema = [
    organization(settings ?? {}),
    website(settings ?? {}),
    localBusiness(settings ?? {}, reviews),
    webPage({
      type: "AboutPage",
      name: "About TechBrotherz, a walk-in repair shop in Calgary",
      description:
        "TechBrotherz is a walk-in cell phone, tablet and computer repair shop at 3317 17 Ave SE in Calgary, Alberta.",
      path: PATH,
      speakableSelectors: ['[data-speakable="answer"]'],
    }),
    faqs.schema,
  ];

  return (
    <PageShell
      path={PATH}
      eyebrow="About"
      title="About TechBrotherz"
      crumbLabel="About"
      lead={
        <>
          TechBrotherz is a walk-in cell phone and computer repair shop at {SITE.street} in{" "}
          {SITE.city}, {SITE.region}, on the stretch of 17 Avenue SE known as International Avenue.
          One shop, one counter, and prices published in full.
        </>
      }
      answerBox={{
        answer: `TechBrotherz is a walk-in cell phone, tablet and computer repair shop at ${SITE.street} in Calgary, Alberta. It repairs phones, iPads, tablets, laptops and desktops, and unlocks phones for any Canadian carrier. No appointment is needed, most phone repairs take about ${waitMinutes} minutes, and every repair carries a ${warrantyDays}-day warranty.`,
        keyFacts: [
          { label: "What we are", value: "A walk-in repair shop, one location in Calgary" },
          { label: "Address", value: `${SITE.street}, ${SITE.city}, ${SITE.region}` },
          {
            label: "Devices",
            value: `${brands.length} brands and ${repairTypes.length} repair types`,
          },
          { label: "Typical wait", value: `About ${waitMinutes} minutes on most phone repairs` },
          { label: "Warranty", value: `${warrantyDays} days on every repair` },
        ],
        lastUpdated: settings?._updatedAt,
      }}
      schema={schema}
    >
      {/* --------------------------------------------------------- who we are */}
      <Section variant="tint" className="pt-0 md:pt-0 lg:pt-0" aria-labelledby="who-heading">
        <Heading level={2} id="who-heading" eyebrow="Who we are">
          What is TechBrotherz?
        </Heading>

        <div className="mt-6 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="type-body measure text-tb-muted">
              TechBrotherz is a repair shop, not a chain and not a mail-in service. There is one
              counter, at {SITE.street} in {SITE.city}, and the person who takes your device in is
              the person who repairs it. You can watch a phone screen replacement happen if you want
              to.
            </p>

            {yearsTrading && foundedYear ? (
              <p className="type-body measure text-tb-muted mt-4">
                TechBrotherz has been repairing devices in Calgary since {foundedYear}, which is{" "}
                {yearsTrading} years on the same street.
              </p>
            ) : null}

            <p className="type-body measure text-tb-muted mt-4">
              The shop works on walk-ins rather than appointments, because most of what comes
              through the door is urgent: a cracked screen on the way to work, a laptop that will
              not start the night before something is due. Most phone screen and battery repairs are
              finished in about {waitMinutes} minutes, so people wait rather than come back.
            </p>

            <p className="type-body measure text-tb-muted mt-4">
              Every price TechBrotherz charges is published on{" "}
              <Link href="/repair-prices" className="text-tb-green-deep hover:underline">
                the repair price list
              </Link>
              , including the part and the labour. That is unusual in this trade and it is
              deliberate: you should know what a repair costs before you carry a broken device
              across the city.
            </p>
          </div>

          <div className="lg:col-span-5">
            <Card>
              <h3 className="type-h3 text-tb-text">The shop in numbers</h3>
              <dl className="type-body mt-5 space-y-3">
                {[
                  ["Brands repaired", String(brands.length)],
                  ["Types of repair", String(repairTypes.length)],
                  ["Warranty", `${warrantyDays} days`],
                  ["Typical wait", `About ${waitMinutes} minutes`],
                  ["Appointments", "Never required"],
                  ...(foundedYear
                    ? [["Trading since", String(foundedYear)] as [string, string]]
                    : []),
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="border-tb-border flex justify-between gap-4 border-b pb-3 last:border-b-0"
                  >
                    <dt className="text-tb-muted">{label}</dt>
                    <dd className="text-tb-text font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          </div>
        </div>
      </Section>

      {/* -------------------------------------------------------- what we fix */}
      <Section aria-labelledby="what-we-fix-heading">
        <Heading
          level={2}
          id="what-we-fix-heading"
          eyebrow="What we fix"
          lead="TechBrotherz repairs the devices it carries parts and experience for, and says so when a repair is not worth doing."
        >
          What does TechBrotherz repair?
        </Heading>

        <p className="type-body measure text-tb-muted mt-6">
          We repair cell phones, iPads and tablets, laptops and desktop computers. That covers
          screens, batteries, charging ports, cameras, buttons and back glass on phones, and
          screens, keyboards, charging sockets, Windows installation, virus removal and clean-ups on
          computers. The shop also unlocks phones for any Canadian carrier and resets Windows
          passwords.
        </p>

        <p className="type-body measure text-tb-muted mt-4">
          Just as important is what we will tell you not to do. If a repair costs a large fraction
          of what the device is worth, or if the tablet has stopped receiving software updates, you
          will hear that at the counter rather than after paying. Liquid damage is the one repair no
          honest shop will promise, because the outcome depends on what got in and how long it sat
          there.
        </p>

        <TrustStrip className="mt-14" />
      </Section>

      {/* ---------------------------------------------------------- the team */}
      {team.length > 0 ? (
        <Section variant="tint" aria-labelledby="team-heading">
          <Heading level={2} id="team-heading" eyebrow="The team">
            Who will be repairing your device?
          </Heading>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {team.map((person) => (
              <Card key={person._id}>
                <h3 className="type-h3 text-tb-text">{person.name}</h3>
                {person.role ? (
                  <p className="type-caption text-tb-green-deep mt-1">{person.role}</p>
                ) : null}
                {person.bio ? <p className="type-body text-tb-muted mt-3">{person.bio}</p> : null}

                {typeof person.yearsExperience === "number" ? (
                  <p className="type-caption text-tb-muted mt-3">
                    {person.yearsExperience} years repairing devices
                  </p>
                ) : null}

                {person.credentials?.length ? (
                  <ul className="type-caption text-tb-muted mt-3 list-disc space-y-1 pl-4">
                    {person.credentials.map((credential) => (
                      <li key={credential}>{credential}</li>
                    ))}
                  </ul>
                ) : null}
              </Card>
            ))}
          </div>
        </Section>
      ) : null}

      {/* ------------------------------------------------------ how we price */}
      <Section variant={team.length > 0 ? "light" : "tint"} aria-labelledby="pricing-heading">
        <Heading level={2} id="pricing-heading" eyebrow="Pricing">
          How does TechBrotherz price a repair?
        </Heading>

        <p className="type-body measure text-tb-muted mt-6">
          Every price on the TechBrotherz site includes the part and the labour, so the figure you
          read is the figure you pay before tax. There is no separate bench fee on a phone repair
          and no charge to look at a phone. Computer diagnostics are $24.99, and that is quoted
          before any work starts.
        </p>

        <p className="type-body measure text-tb-muted mt-4">
          Where a model shows Call for quote, the part is ordered in rather than held in stock and
          the price moves with supply. TechBrotherz would rather show that honestly than publish a
          number it might not be able to honour when you arrive. Call {SITE.phone} with the model
          and you will get a firm figure.
        </p>

        <p className="type-body measure text-tb-muted mt-4">
          Every repair carries a {warrantyDays}-day warranty on the part and the workmanship. The
          full terms, including what is excluded, are set out on{" "}
          <Link href="/warranty" className="text-tb-green-deep hover:underline">
            the warranty page
          </Link>
          .
        </p>
      </Section>

      {/* ----------------------------------------------------- service area */}
      <Section aria-labelledby="area-heading">
        <Heading
          level={2}
          id="area-heading"
          eyebrow="Service area"
          lead={`TechBrotherz serves ${SITE.city}, Chestermere, Airdrie and the surrounding Alberta communities from one shop on International Avenue.`}
        >
          Where does TechBrotherz operate?
        </Heading>

        <LocalInfoCard className="mt-10" headingLevel={3} heading="TechBrotherz, Calgary" />

        <p className="type-body measure text-tb-muted mt-8">
          The shop sits in the Forest Lawn area of southeast Calgary, on the stretch of 17 Avenue SE
          known as International Avenue. See{" "}
          <Link href="/locations" className="text-tb-green-deep hover:underline">
            the areas TechBrotherz serves
          </Link>{" "}
          for drive times, or{" "}
          <Link href="/contact" className="text-tb-green-deep hover:underline">
            the contact page
          </Link>{" "}
          for parking and transit.
        </p>
      </Section>

      {/* ------------------------------------------------------------- faqs */}
      <ScopedFaqs
        faqs={faqs}
        id="page-faq-heading"
        heading="Questions about TechBrotherz"
        variant="tint"
      />

      <Section variant="dark" contained={false}>
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <h2 className="type-h2 text-tb-white">Come and see the shop</h2>
              <p className="type-lead measure text-tb-muted-dark mt-4">
                We are at {SITE.street} in {SITE.city}, open seven days a week. Walk in during
                opening hours, no appointment needed.
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
