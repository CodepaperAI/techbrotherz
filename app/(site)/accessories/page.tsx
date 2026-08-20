import Link from "next/link";
import type { Metadata } from "next";
import { Cable, Layers, Shield, Smartphone, Eye } from "lucide-react";

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

const PATH = "/accessories";

export const metadata: Metadata = buildMetadata({
  title: "Phone, IPad and Tablet Accessories in Calgary",
  description:
    "Cases, tempered glass, screen protectors and privacy screen protectors for phones, IPads and tablets at TechBrotherz in Calgary. Call to check stock for your model.",
  path: PATH,
});

/**
 * Added on the client's instruction 2026-08: "Apart from repairs Please add
 * phones, IPads and tablet accessories- cases, tempered glass, screen protectors
 * and privacy screen protectors". A what-we-stock page, not a shop: no prices,
 * no cart, and no claim about what is on the shelf for a specific model,
 * because stock changes and the site cannot know it. The phone number is the
 * stock check.
 */
export default async function AccessoriesPage() {
  const [settings, reviews, allFaqs] = await Promise.all([
    getSiteSettings(),
    getReviewSummary(),
    getAllFaqs(),
  ]);

  const faqs = composeFaqs({
    path: PATH,
    pageSpecific: [
      {
        question: "Does TechBrotherz sell phone cases and screen protectors in Calgary?",
        answer:
          "Yes. TechBrotherz at 3317 17 Ave SE in Calgary stocks cases, tempered glass, film screen protectors and privacy screen protectors for phones, IPads and tablets, alongside its repair Store. Stock varies by device model, so phoning (403) 273-8324 before travelling is the reliable way to check what is on the shelf for yours.",
      },
      {
        question: "Do you have a case or protector for my exact model?",
        answer:
          "TechBrotherz stocks accessories for the phone, IPad and tablet models people in Calgary actually carry, and stock changes as devices come and go. Rather than promise a model is on the shelf, the store asks you to phone (403) 273-8324 with the exact device name, and staff will check while you are on the line.",
      },
      {
        question: "Will TechBrotherz fit a screen protector bought at the Store?",
        answer:
          "Yes. A screen protector bought at the TechBrotherz Store in Calgary is fitted there, aligned and pressed down without trapped dust or bubbles, before you leave. Fitting glass cleanly is routine work for a shop that replaces screens every day.",
      },
      {
        question: "Should you use both a case and a screen protector?",
        answer:
          "Yes, because they protect against different failures. A case absorbs the corner and edge impacts that crack screens from a drop, while a screen protector takes the face-down landings, keys and grit that scratch or shatter the glass itself. The two together cover far more of the ways a phone actually breaks than either does alone.",
      },
    ],
    globalLinks: globalLinks(allFaqs, ["walkin", "location"], 2),
  });

  const schema = [
    organization(settings ?? {}),
    website(settings ?? {}),
    localBusiness(settings ?? {}, reviews),
    webPage({
      type: "WebPage",
      name: "Phone, IPad and tablet accessories in Calgary",
      description:
        "Cases, tempered glass, screen protectors and privacy screen protectors stocked at the TechBrotherz Store in Calgary.",
      path: PATH,
      speakableSelectors: ['[data-speakable="answer"]'],
      dateModified: settings?._updatedAt,
    }),
    faqs.schema,
  ];

  return (
    <PageShell
      path={PATH}
      eyebrow="Accessories"
      title="Phone, IPad and Tablet Accessories in Calgary"
      crumbLabel="Accessories"
      lead={
        <>
          TechBrotherz, a walk-in cell phone and computer repair store at {SITE.street} in{" "}
          {SITE.city}, {SITE.region}, stocks the accessories that stop devices coming back to the
          repair Store: cases, tempered glass, film screen protectors and privacy screen
          protectors for phones, IPads and tablets.
        </>
      }
      answerBox={{
        answer: `TechBrotherz at ${SITE.street} in Calgary stocks accessories for phones, IPads, tablets and laptops: cases, tempered glass, privacy screen protectors, cables and chargers, MacBook chargers and HDMI cables. Stock varies by device model, so phone ${SITE.phone} to check what is on the shelf for your device. A protector bought at the Store is fitted there before you leave.`,
        keyFacts: [
          { label: "In stock", value: "Cases, tempered glass, privacy protectors, cables, chargers" },
          { label: "For", value: "Phones, IPads and tablets" },
          { label: "Fitting", value: "Protectors bought at the Store are fitted there" },
          { label: "Stock check", value: `Phone ${SITE.phone} with your exact model` },
          { label: "Appointment", value: "Not needed, walk in during opening hours" },
        ],
        lastUpdated: settings?._updatedAt,
      }}
      schema={schema}
    >
      {/* -------------------------------------------------- what we stock */}
      <Section className="pt-0 md:pt-0 lg:pt-0" aria-labelledby="stock-heading">
        <Heading
          level={2}
          id="stock-heading"
          eyebrow="On the shelf"
          lead="Four kinds of accessory, for the three kinds of device the repair Store sees every day."
        >
          What accessories does TechBrotherz stock?
        </Heading>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <Smartphone
              aria-hidden="true"
              size={24}
              strokeWidth={1.5}
              className="text-tb-green-deep"
            />
            <h3 className="type-h3 text-tb-text mt-4">Cases</h3>
            <p className="type-body text-tb-muted mt-2">
              Cases for phones and tablets. A case absorbs the corner impacts that crack screens,
              which is the most common repair at this Store.
            </p>
          </Card>
          <Card>
            <Shield aria-hidden="true" size={24} strokeWidth={1.5} className="text-tb-green-deep" />
            <h3 className="type-h3 text-tb-text mt-4">Tempered Glass</h3>
            <p className="type-body text-tb-muted mt-2">
              A hardened glass layer that takes the impact and shatters instead of the screen
              underneath. The strongest of the three protector types.
            </p>
          </Card>
          <Card>
            <Layers aria-hidden="true" size={24} strokeWidth={1.5} className="text-tb-green-deep" />
            <h3 className="type-h3 text-tb-text mt-4">Screen Protectors</h3>
            <p className="type-body text-tb-muted mt-2">
              Thin film protectors that guard against the scratches from keys, coins and grit in a
              pocket or a bag.
            </p>
          </Card>
          <Card>
            <Eye aria-hidden="true" size={24} strokeWidth={1.5} className="text-tb-green-deep" />
            <h3 className="type-h3 text-tb-text mt-4">Privacy Protectors</h3>
            <p className="type-body text-tb-muted mt-2">
              Tempered glass with a filter that narrows the viewing angle, so the screen reads
              clearly to you and goes dark to the person beside you.
            </p>
          </Card>
          <Card>
            <Cable aria-hidden="true" size={24} strokeWidth={1.5} className="text-tb-green-deep" />
            <h3 className="type-h3 text-tb-text mt-4">Cables and Chargers</h3>
            <p className="type-body text-tb-muted mt-2">
              Charging cables and wall chargers for phones and tablets, MacBook chargers, and HDMI
              cables, all stocked at the Store.
            </p>
          </Card>
        </div>

        <p className="type-body measure text-tb-muted mt-8">
          Stock varies by device model. TechBrotherz carries accessories for the phone, IPad and
          tablet models people in Calgary actually own, and the reliable way to check what is on the
          shelf for yours is to phone {SITE.phone} with the exact model name. Staff will check while
          you are on the line, the same call that confirms a repair part is in stock.
        </p>
      </Section>

      {/* ------------------------------------------------ protector guide */}
      <Section variant="tint" aria-labelledby="protector-heading">
        <Heading
          level={2}
          id="protector-heading"
          eyebrow="Choosing"
          lead="Three protector types, three different jobs. The table compares them like for like."
        >
          Which screen protection should you choose?
        </Heading>

        <div className="border-tb-border bg-tb-white rounded-card mt-10 overflow-x-auto border">
          <table className="w-full min-w-[42rem] border-collapse text-left">
            <caption className="sr-only-caption">
              Screen protector types stocked at TechBrotherz in Calgary, compared
            </caption>
            <thead>
              <tr className="tb-thead">
                <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-3">
                  Type
                </th>
                <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-3">
                  Protects against
                </th>
                <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-3">
                  Feel and thickness
                </th>
                <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-3">
                  Best for
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-tb-border border-t">
                <th scope="row" className="text-tb-text px-6 py-4 text-left font-normal">
                  Film screen protector
                </th>
                <td className="type-body text-tb-muted px-6 py-4">
                  Scratches from keys, coins and grit
                </td>
                <td className="type-body text-tb-muted px-6 py-4">
                  Thinnest of the three, nearly invisible once fitted
                </td>
                <td className="type-body text-tb-muted px-6 py-4">
                  Keeping a screen scratch-free at the lowest cost
                </td>
              </tr>
              <tr className="border-tb-border border-t">
                <th scope="row" className="text-tb-text px-6 py-4 text-left font-normal">
                  Tempered glass
                </th>
                <td className="type-body text-tb-muted px-6 py-4">
                  Scratches plus face-down drops and sharp impacts
                </td>
                <td className="type-body text-tb-muted px-6 py-4">
                  Feels like the original screen, slightly thicker at the edge
                </td>
                <td className="type-body text-tb-muted px-6 py-4">
                  Most people. It sacrifices itself instead of the screen
                </td>
              </tr>
              <tr className="border-tb-border border-t">
                <th scope="row" className="text-tb-text px-6 py-4 text-left font-normal">
                  Privacy tempered glass
                </th>
                <td className="type-body text-tb-muted px-6 py-4">
                  The same impacts, plus shoulder reading
                </td>
                <td className="type-body text-tb-muted px-6 py-4">
                  As tempered glass, with a dimmer screen at an angle
                </td>
                <td className="type-body text-tb-muted px-6 py-4">
                  Transit commuters and anyone working in public
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="measure mt-10 space-y-5">
          <p className="type-body text-tb-muted">
            A film screen protector is a thin plastic layer that guards the glass against
            scratches. Tempered glass is a hardened glass layer that also absorbs impact: when a
            phone lands face down, the protector takes the crack and peels off, and the screen
            underneath survives. The protector costs a fraction of the screen repair it prevents.
          </p>
          <p className="type-body text-tb-muted">
            A privacy screen protector is tempered glass with a micro-louvre filter, the same idea
            as a window blind, built into the layer. Straight on, the screen reads normally.
            From the side, it goes dark. The trade-off is a slightly dimmer screen and a narrower
            viewing angle, which is precisely the point.
          </p>
        </div>
      </Section>

      {/* ------------------------------------------------ why buy here */}
      <Section aria-labelledby="why-heading">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Heading level={2} id="why-heading" eyebrow="The repair Store's view">
              Why buy a case from a repair store?
            </Heading>
            <div className="measure mt-8 space-y-5">
              <p className="type-body text-tb-muted">
                TechBrotherz replaces cracked screens all day, so the accessory shelf is stocked by
                people who see exactly how devices break. The most common repair at the Store is
                a{" "}
                <Link href="/services/phone-repair" className="text-tb-green-deep hover:underline">
                  cracked phone screen
                </Link>
                , and most of those arrive with no case and no protector on the device.
              </p>
              <p className="type-body text-tb-muted">
                The same applies to tablets. An{" "}
                <Link href="/services/ipad-repair" className="text-tb-green-deep hover:underline">
                  IPad screen repair
                </Link>{" "}
                is one of the larger jobs the store quotes, and an IPad in a decent case with glass
                on the front is a repair that mostly never happens.
              </p>
              <p className="type-body text-tb-muted">
                A protector bought at the Store is fitted at the Store: aligned, pressed down
                and free of trapped dust, before you leave. Fitting glass cleanly is routine for a
                shop that does{" "}
                <Link href="/repair/apple-iphone" className="text-tb-green-deep hover:underline">
                  Iphone screen replacements
                </Link>{" "}
                every day.
              </p>
            </div>
          </div>

          <div>
            <Heading level={2} eyebrow="Honest limits">
              What this page does not promise
            </Heading>
            <div className="mt-8 space-y-5">
              <Card>
                <h3 className="type-h3 text-tb-text">No Online Stock List</h3>
                <p className="type-body text-tb-muted mt-2">
                  Accessory stock changes faster than a website should pretend to track. The phone
                  call is the stock check, and it takes a minute.
                </p>
              </Card>
              <Card>
                <h3 className="type-h3 text-tb-text">No Online Ordering</h3>
                <p className="type-body text-tb-muted mt-2">
                  TechBrotherz is a walk-in Store, not a web store. Accessories are bought at the
                  store, where the fit on your actual device can be checked before you pay.
                </p>
              </Card>
              <Card>
                <h3 className="type-h3 text-tb-text">A Protector Is Not Invincibility</h3>
                <p className="type-body text-tb-muted mt-2">
                  Glass and cases improve the odds when a device is dropped. They do not make it
                  indestructible, and a hard enough impact can still reach the screen. When it
                  does,{" "}
                  <Link href="/contact" className="text-tb-green-deep hover:underline">
                    the repair Store
                  </Link>{" "}
                  is a few steps from the accessory shelf.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </Section>

      {/* --------------------------------------------------------- faqs */}
      <ScopedFaqs
        faqs={faqs}
        id="accessories-faq-heading"
        heading="Questions about accessories"
        variant="tint"
      />

      {/* ------------------------------------------------------ related */}
      <Section aria-labelledby="related-heading">
        <h2 id="related-heading" className="sr-only">
          Related pages
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <RelatedLinks
            title="If the damage is already done"
            links={[
              { label: "Cell phone repair", href: "/services/phone-repair" },
              { label: "IPad repair", href: "/services/ipad-repair" },
              { label: "All repair services", href: "/services" },
            ]}
          />
          <RelatedLinks
            title="Practical details"
            links={[
              { label: "Directions, parking and opening hours", href: "/contact" },
              { label: "Areas we serve around Calgary", href: "/locations" },
            ]}
          />
        </div>
      </Section>

      {/* ------------------------------------------------------ cta band */}
      <Section variant="dark" contained={false}>
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <h2 className="type-h2 text-tb-white">Check the shelf before you travel</h2>
              <p className="type-lead measure text-tb-muted-dark mt-4">
                TechBrotherz is at {SITE.street} in {SITE.city}. Phone with your exact device model
                and staff will check the accessory stock while you are on the line.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <PillButton href={TEL_HREF} withArrow={false}>
                Call {SITE.phone}
              </PillButton>
              <PillButton href="/contact" variant="ghostOnDark">
                Directions and hours
              </PillButton>
            </div>
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}
