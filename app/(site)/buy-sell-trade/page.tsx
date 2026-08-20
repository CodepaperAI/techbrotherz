import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeftRight, Banknote, Smartphone } from "lucide-react";

import { DemoImage } from "@/components/blocks/DemoImage";
import { PageShell } from "@/components/blocks/PageShell";
import { RelatedLinks } from "@/components/blocks/RelatedLinks";
import { ScopedFaqs } from "@/components/blocks/ScopedFaqs";
import { Card } from "@/components/primitives/Card";
import { Container } from "@/components/primitives/Container";
import { Heading } from "@/components/primitives/Heading";
import { PillButton } from "@/components/primitives/PillButton";
import { Section } from "@/components/primitives/Section";
import { composeFaqs, globalLinks } from "@/lib/faq/scoping";
import { buildMetadata } from "@/lib/seo/metadata";
import { localBusiness, organization, webPage, website } from "@/lib/seo/schema";
import { SITE, TEL_HREF } from "@/lib/site";
import { getAllFaqs, getReviewSummary, getSiteSettings } from "@/lib/data";

export const revalidate = 3600;

const PATH = "/buy-sell-trade";

export const metadata: Metadata = buildMetadata({
  title: "Buy, Sell and Trade Phones & Laptops in Calgary",
  description:
    "Sell your phone, computer or laptop at TechBrotherz in Calgary, buy one, or trade one in. Quoted at the Store with the device in front of us. Walk in any day.",
  path: PATH,
});

/**
 * Confirmed by the client 2026-08: "At TechBrotherz you can buy, sell and
 * trade your phone, computer and laptop." Selling has been in the brief since
 * Phase 1; buying and trading are the new confirmations. Nothing here claims
 * refurbished grading, instant quotes or a price list, because none of that
 * is confirmed; the quote at the Store is the whole mechanism.
 */
export default async function BuySellTradePage() {
  const [settings, reviews, allFaqs] = await Promise.all([
    getSiteSettings(),
    getReviewSummary(),
    getAllFaqs(),
  ]);

  const faqs = composeFaqs({
    path: PATH,
    pageSpecific: [
      {
        question: "Does TechBrotherz buy used phones in Calgary?",
        answer:
          "Yes. TechBrotherz at 3317 17 Ave SE in Calgary buys phones, computers and laptops. Bring the device in and it is looked over and quoted at the Store with the device in front of us, which is the only honest way to value used electronics. No appointment is needed.",
      },
      {
        question: "Can I trade my old device in at TechBrotherz?",
        answer:
          "Yes. TechBrotherz takes phones, computers and laptops in trade. The device is valued at the Store the same way as a straight sale, and the figure goes against whatever you are there for. You see the number before you commit to anything.",
      },
      {
        question: "What should I do before selling my phone or laptop?",
        answer:
          "Three things. Back it up, because selling a device means wiping it. Sign out of your accounts, Apple Account or Find My on an Iphone and the Google account on Android, because a device still locked to an account cannot be resold and is worth far less. And bring the charger and any accessories, which help the valuation.",
      },
      {
        question: "What phones and computers does TechBrotherz have for sale?",
        answer:
          "The devices on sale at TechBrotherz in Calgary change with what comes in, so the site does not publish a stock list that would go stale. Phone (403) 273-8324 and ask what is in today, or walk in to 3317 17 Ave SE and look. Every device sold is tested at the same bench that repairs them.",
      },
    ],
    globalLinks: globalLinks(allFaqs, ["walkin", "warranty"], 2),
  });

  const schema = [
    organization(settings ?? {}),
    website(settings ?? {}),
    localBusiness(settings ?? {}, reviews),
    webPage({
      type: "WebPage",
      name: "Buy, sell and trade phones, computers and laptops in Calgary",
      description:
        "TechBrotherz in Calgary buys, sells and trades phones, computers and laptops, quoted at the Store.",
      path: PATH,
      speakableSelectors: ['[data-speakable="answer"]'],
      dateModified: settings?._updatedAt,
    }),
    faqs.schema,
  ];

  return (
    <PageShell
      path={PATH}
      eyebrow="Buy, sell and trade"
      title="Buy, Sell and Trade Devices in Calgary"
      crumbLabel="Buy, sell & trade"
      lead={
        <>
          At TechBrotherz, a walk-in cell phone and computer repair store at {SITE.street} in{" "}
          {SITE.city}, {SITE.region}, you can buy, sell and trade your phone, computer and laptop.
          Every device is valued at the Store, with the device in front of us and the figure agreed
          before anything changes hands.
        </>
      }
      answerBox={{
        answer: `TechBrotherz at ${SITE.street} in Calgary buys, sells and trades phones, computers and laptops. Bring the device in and it is quoted at the Store, with the figure agreed before anything changes hands. Sign out of your accounts and back up first. No appointment is needed, and walking in with the device is the whole process.`,
        keyFacts: [
          { label: "We buy", value: "Phones, computers and laptops" },
          { label: "We sell", value: "Devices tested at the same bench that repairs them" },
          { label: "Trade-ins", value: "Valued at the Store, figure agreed before you commit" },
          { label: "Before selling", value: "Back up, then sign out of Apple or Google accounts" },
          { label: "Appointment", value: "Not needed, walk in during opening hours" },
        ],
        lastUpdated: settings?._updatedAt,
      }}
      schema={schema}
    >
      {/* ------------------------------------------------------ three paths */}
      <Section variant="tint" className="pt-0 md:pt-0 lg:pt-0" aria-labelledby="paths-heading">
        <DemoImage slot="buy-sell-trade" sizes="(min-width: 1024px) 60vw, 100vw" className="mb-12" />
        <Heading
          level={2}
          id="paths-heading"
          eyebrow="How it works"
          lead="Three ways in, one mechanism: the device is valued at the Store, and you see the figure before you decide."
        >
          What can you do at the TechBrotherz Store?
        </Heading>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Card>
            <Banknote aria-hidden="true" size={24} strokeWidth={1.5} className="text-tb-green-deep" />
            <h3 className="type-h3 text-tb-text mt-4">Sell a Device</h3>
            <p className="type-body text-tb-muted mt-2">
              Bring your phone, computer or laptop to the Store. It is looked over with you there,
              and the offer is made on the spot. Take it or keep your device; there is no charge for
              asking.
            </p>
          </Card>
          <Card>
            <Smartphone aria-hidden="true" size={24} strokeWidth={1.5} className="text-tb-green-deep" />
            <h3 className="type-h3 text-tb-text mt-4">Buy a Device</h3>
            <p className="type-body text-tb-muted mt-2">
              The phones and computers on sale change with what comes in, so phone ahead and ask
              what is in today. Every device sold has been through the same bench that repairs
              them.
            </p>
          </Card>
          <Card>
            <ArrowLeftRight
              aria-hidden="true"
              size={24}
              strokeWidth={1.5}
              className="text-tb-green-deep"
            />
            <h3 className="type-h3 text-tb-text mt-4">Trade One In</h3>
            <p className="type-body text-tb-muted mt-2">
              Your old device is valued exactly as a sale would be, and the figure goes against
              whatever you are at the Store for. You see both numbers before committing to either.
            </p>
          </Card>
        </div>
      </Section>

      {/* -------------------------------------------------- before you come */}
      <Section aria-labelledby="prepare-heading">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Heading level={2} id="prepare-heading" eyebrow="Before you come in">
              What should you do before selling a device?
            </Heading>
            <div className="measure mt-8 space-y-5">
              <p className="type-body text-tb-muted">
                Back the device up first, because selling it means wiping it. On a phone that is a
                cloud backup or a transfer to your new handset; on a laptop it is copying what
                matters off the drive. This is the step people skip and regret.
              </p>
              <p className="type-body text-tb-muted">
                Sign out of your accounts. An Iphone still attached to an Apple Account, or an
                Android phone still signed into Google, is locked to you: it cannot honestly be
                resold, and a device that arrives locked is worth far less or nothing. Turn off
                Find My on Apple devices, and remove the Google account on Android, before the
                valuation.
              </p>
              <p className="type-body text-tb-muted">
                Bring the charger and any accessories. They help the figure, and for a laptop the
                charger lets the Store test the machine properly while you wait.
              </p>
            </div>
          </div>

          <div>
            <Heading level={2} eyebrow="Honest limits">
              What this page does not promise
            </Heading>
            <div className="mt-8 space-y-5">
              <Card>
                <h3 className="type-h3 text-tb-text">No Online Valuations</h3>
                <p className="type-body text-tb-muted mt-2">
                  A used device is worth what it is worth with the device in hand: its condition,
                  its battery, its history. A number quoted sight unseen would be a guess dressed
                  as an offer, so the quote happens at the Store.
                </p>
              </Card>
              <Card>
                <h3 className="type-h3 text-tb-text">No Published Stock List</h3>
                <p className="type-body text-tb-muted mt-2">
                  What is for sale changes weekly. The phone call is the stock check, and it takes
                  a minute: {SITE.phone}.
                </p>
              </Card>
              <Card>
                <h3 className="type-h3 text-tb-text">Locked Devices Are Not Bought</h3>
                <p className="type-body text-tb-muted mt-2">
                  A phone still signed into someone&apos;s Apple or Google account cannot honestly be
                  resold, and the Store does not buy devices that cannot be shown to be the
                  seller&apos;s to sell. If you are locked out of your own device,{" "}
                  <Link
                    href="/services/frp-removal"
                    className="text-tb-green-deep hover:underline"
                  >
                    FRP removal
                  </Link>{" "}
                  with proof of ownership is the honest route back in.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </Section>

      {/* --------------------------------------------------------- faqs */}
      <ScopedFaqs
        faqs={faqs}
        id="bst-faq-heading"
        heading="Questions about buying, selling and trading"
        variant="tint"
      />

      {/* ------------------------------------------------------ related */}
      <Section aria-labelledby="related-heading">
        <h2 id="related-heading" className="sr-only">
          Related pages
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <RelatedLinks
            title="Worth checking before you sell"
            links={[
              { label: "Cell phone repair", href: "/services/phone-repair" },
              { label: "Laptop repair", href: "/services/laptop-repair" },
              { label: "Phone, IPad and tablet accessories", href: "/accessories" },
            ]}
          />
          <RelatedLinks
            title="Practical details"
            links={[
              { label: "Directions, parking and opening hours", href: "/contact" },
              { label: "Our 60-day warranty", href: "/warranty" },
            ]}
          />
        </div>
      </Section>

      {/* ------------------------------------------------------ cta band */}
      <Section variant="dark" contained={false}>
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <h2 className="type-h2 text-tb-white">Bring it in and hear the number</h2>
              <p className="type-lead measure text-tb-muted-dark mt-4">
                {SITE.street}, {SITE.city}, open seven days a week. The valuation is free, and your
                device stays yours until you say otherwise.
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
    </PageShell>
  );
}
