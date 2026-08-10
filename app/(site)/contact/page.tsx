import Link from "next/link";
import type { Metadata } from "next";
import { Bus, Car, MapPin, Phone } from "lucide-react";

import { ContactForm } from "@/components/blocks/ContactForm";
import { LocalInfoCard } from "@/components/blocks/LocalInfoCard";
import { ScopedFaqs } from "@/components/blocks/ScopedFaqs";
import { PageShell } from "@/components/blocks/PageShell";
import { Card } from "@/components/primitives/Card";
import { Heading } from "@/components/primitives/Heading";
import { PillButton } from "@/components/primitives/PillButton";
import { Section } from "@/components/primitives/Section";
import { shouldRenderLink } from "@/lib/routes";
import { getCoreFaqContext } from "@/lib/content/core-context";
import { contactFaqs } from "@/lib/content/core-faqs";
import { composeFaqs, globalLinks } from "@/lib/faq/scoping";
import { buildMetadata } from "@/lib/seo/metadata";
import { localBusiness, organization, webPage, website } from "@/lib/seo/schema";
import { ADDRESS_LINE, SITE, TEL_HREF } from "@/lib/site";
import { getAllFaqs, getLocations, getReviewSummary, getSiteSettings } from "@/lib/data";

export const revalidate = 3600;

const PATH = "/contact";

export const metadata: Metadata = buildMetadata({
  title: "Contact TechBrotherz in Calgary",
  description:
    "Call (403) 273-8324 or walk in to 3317 17 Ave SE, Calgary. Opening hours, directions, parking and transit for the TechBrotherz repair shop.",
  path: PATH,
});

export default async function ContactPage() {
  const [settings, reviews, locations, allFaqs] = await Promise.all([
    getSiteSettings(),
    getReviewSummary(),
    getLocations(),
    getAllFaqs(),
  ]);

  const warrantyDays = settings?.warrantyDays ?? 60;
  const waitMinutes = settings?.typicalWaitMinutes ?? 30;

  const neighbourhoods = locations.filter((entry) => entry.kind === "neighbourhood");
  // FAQ scoping rule, CLAUDE.md Section 8.8. Questions this page can answer
  // with its own numbers, plus at most two pointers to the canonical
  // answers on /faq. Only the page-specific ones reach structured data.
  const coreCtx = await getCoreFaqContext();
  const faqs = composeFaqs({
    path: PATH,
    pageSpecific: contactFaqs(coreCtx),
    globalLinks: globalLinks(allFaqs, ["location", "walkin"], 2),
  });

  const schema = [
    organization(settings ?? {}),
    website(settings ?? {}),
    localBusiness(settings ?? {}, reviews),
    webPage({
      type: "ContactPage",
      name: "Contact TechBrotherz in Calgary",
      description:
        "Phone, address, opening hours and directions for the TechBrotherz repair shop at 3317 17 Ave SE in Calgary.",
      path: PATH,
      speakableSelectors: ['[data-speakable="answer"]'],
    }),
    faqs.schema,
  ];

  return (
    <PageShell
      path={PATH}
      eyebrow="Contact"
      title="Contact TechBrotherz in Calgary"
      crumbLabel="Contact"
      lead={
        <>
          TechBrotherz is a walk-in cell phone and computer repair shop at {SITE.street} in{" "}
          {SITE.city}, {SITE.region}. Calling is the fastest way to check a part is in stock before
          you travel.
        </>
      }
      answerBox={{
        answer: `Call TechBrotherz on ${SITE.phone}, or walk in to ${SITE.street} in Calgary. The shop is open Monday to Saturday from 10:00 AM to 7:00 PM and Sunday from 11:00 AM to 5:00 PM. No appointment is needed, and most phone repairs take about ${waitMinutes} minutes while you wait.`,
        keyFacts: [
          { label: "Phone", value: SITE.phone },
          { label: "Address", value: ADDRESS_LINE },
          { label: "Hours", value: "Mon to Sat 10:00 AM to 7:00 PM, Sun 11:00 AM to 5:00 PM" },
          { label: "Appointment", value: "Not needed, walk in during opening hours" },
          { label: "Warranty", value: `${warrantyDays} days on every repair` },
        ],
        lastUpdated: settings?._updatedAt,
      }}
      schema={schema}
    >
      {/* --------------------------------------------------- call and visit */}
      <Section variant="tint" className="pt-0 md:pt-0 lg:pt-0" aria-labelledby="reach-us-heading">
        <Heading level={2} id="reach-us-heading" eyebrow="Reach us">
          How do I get in touch with TechBrotherz?
        </Heading>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Card>
            <Phone aria-hidden="true" size={24} strokeWidth={1.5} className="text-tb-green-deep" />
            <h3 className="type-h3 text-tb-text mt-4">Call the shop</h3>
            <p className="type-body text-tb-muted mt-2">
              The fastest way to check a part is in stock and get a firm price before you travel.
            </p>
            <a
              href={TEL_HREF}
              className="type-h3 text-tb-green-deep mt-4 inline-block hover:underline"
            >
              {SITE.phone}
            </a>
          </Card>

          <Card>
            <MapPin aria-hidden="true" size={24} strokeWidth={1.5} className="text-tb-green-deep" />
            <h3 className="type-h3 text-tb-text mt-4">Walk in</h3>
            <p className="type-body text-tb-muted mt-2">
              No appointment at any time. Most phone screen and battery repairs are finished in
              about {waitMinutes} minutes.
            </p>
            <address className="type-body text-tb-text mt-4 not-italic">{ADDRESS_LINE}</address>
          </Card>

          <Card>
            <Car aria-hidden="true" size={24} strokeWidth={1.5} className="text-tb-green-deep" />
            <h3 className="type-h3 text-tb-text mt-4">Parking</h3>
            <p className="type-body text-tb-muted mt-2">
              Street parking runs along 17 Avenue SE outside the shop, so you can pull up, drop the
              device off and wait.
            </p>
            <PillButton href={SITE.googleMapsUrl} size="sm" className="mt-4">
              Get directions
            </PillButton>
          </Card>
        </div>
      </Section>

      {/* -------------------------------------------------- hours and map */}
      <Section aria-labelledby="hours-heading">
        <Heading level={2} id="hours-heading" eyebrow="Opening hours">
          When is TechBrotherz open?
        </Heading>

        <LocalInfoCard className="mt-10" headingLevel={3} heading="TechBrotherz, Calgary" />
      </Section>

      {/* ------------------------------------------------------------ form */}
      <Section variant="tint" aria-labelledby="form-heading">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <Heading
              level={2}
              id="form-heading"
              eyebrow="Message us"
              lead="Describe the fault and we will reply with what it is likely to be and what it costs. For anything urgent, calling is faster."
            >
              Send TechBrotherz a message
            </Heading>

            <Card className="mt-8">
              <ContactForm />
            </Card>
          </div>

          <div className="lg:col-span-5">
            <Card>
              <h3 className="type-h3 text-tb-text">Getting here by transit</h3>
              <p className="type-body text-tb-muted mt-3 flex items-start gap-2">
                <Bus
                  aria-hidden="true"
                  size={18}
                  strokeWidth={1.5}
                  className="text-tb-green-deep mt-1 shrink-0"
                />
                <span>
                  The MAX Purple bus rapid transit line runs the full length of 17 Avenue SE between
                  downtown Calgary and East Hills, with stops along International Avenue close to
                  the shop.
                </span>
              </p>

              <h3 className="type-h3 text-tb-text mt-8">Before you travel</h3>
              <ul className="type-body text-tb-muted mt-3 list-disc space-y-2 pl-5">
                <li>
                  Back the device up if you can. A screen or battery repair does not touch your
                  storage, but a backup costs nothing.
                </li>
                <li>
                  Bring the charger with a laptop that will not charge. Sometimes the charger is the
                  fault, which is a much cheaper answer.
                </li>
                <li>
                  Call ahead if your model is unusual, so we can confirm the part is here rather
                  than ordered in.
                </li>
              </ul>

              {neighbourhoods.length > 0 ? (
                <>
                  <h3 className="type-h3 text-tb-text mt-8">Coming from nearby</h3>
                  <ul className="type-body mt-3 space-y-2">
                    {neighbourhoods.slice(0, 6).map((entry) => {
                      const href = `/locations/calgary/${entry.slug}`;
                      return (
                        <li key={entry._id}>
                          {shouldRenderLink(href) ? (
                            <Link href={href} className="text-tb-green-deep hover:underline">
                              Repairs for {entry.city}
                            </Link>
                          ) : (
                            <span className="text-tb-muted">{entry.city}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </>
              ) : null}
            </Card>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------------ faqs */}
      <ScopedFaqs
        faqs={faqs}
        id="page-faq-heading"
        heading="Questions about visiting the shop"
        variant="light"
      />
    </PageShell>
  );
}
