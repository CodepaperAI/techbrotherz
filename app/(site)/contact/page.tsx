import Link from "next/link";
import type { Metadata } from "next";
import { Bus, Car } from "lucide-react";

import { ContactForm } from "@/components/blocks/ContactForm";
import { LocalInfoCard } from "@/components/blocks/LocalInfoCard";
import { MapReveal } from "@/components/blocks/MapReveal";
import { ScopedFaqs } from "@/components/blocks/ScopedFaqs";
import { PageShell } from "@/components/blocks/PageShell";
import { Card } from "@/components/primitives/Card";
import { Heading } from "@/components/primitives/Heading";
import { Section } from "@/components/primitives/Section";
import { shouldRenderLink } from "@/lib/routes";
import { getCoreFaqContext } from "@/lib/content/core-context";
import { contactFaqs } from "@/lib/content/core-faqs";
import { composeFaqs, globalLinks } from "@/lib/faq/scoping";
import { buildMetadata } from "@/lib/seo/metadata";
import { localBusiness, organization, webPage, website } from "@/lib/seo/schema";
import { ADDRESS_LINE, SITE } from "@/lib/site";
import { getAllFaqs, getLocations, getReviewSummary, getSiteSettings } from "@/lib/data";

export const revalidate = 3600;

const PATH = "/contact";

/*
 * Merged with the planned /get-a-quote 2026-08 on the client's instruction:
 * one page carries both contact and quote intent, /get-a-quote 301s here, and
 * the "free quote" keyword lives in the title, description and H1 so the
 * term forfeited with /repair-prices is not lost.
 */
export const metadata: Metadata = buildMetadata({
  title: "Contact TechBrotherz | Free Repair Quote in Calgary",
  description:
    "Message TechBrotherz for a free repair quote, call (403) 273-8324, or walk in to 3317 17 Ave SE, Calgary. Hours, parking, directions and transit.",
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
        "Phone, address, opening hours, directions and a message form for a free repair quote from the TechBrotherz repair store at 3317 17 Ave SE in Calgary.",
      path: PATH,
      speakableSelectors: ['[data-speakable="answer"]'],
    }),
    faqs.schema,
  ];

  return (
    <PageShell
      path={PATH}
      layout="form"
      eyebrow="Contact"
      title="Contact TechBrotherz for a Free Repair Quote"
      crumbLabel="Contact"
      lead={
        <>
          Message the store below, call {SITE.phone}, or walk in to {SITE.street} in {SITE.city}.
          Every quote is free.
        </>
      }
      answerBox={{
        answer: `Call TechBrotherz on ${SITE.phone}, or walk in to ${SITE.street} in Calgary. The store is open Monday to Saturday from 10:00 AM to 7:00 PM and Sunday from 11:00 AM to 5:00 PM. No appointment is needed, and most phone repairs take about ${waitMinutes} minutes while you wait.`,
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
      beforeAnswer={
        /* ------------------------------------------- the form, first */
        <Section className="pt-8 md:pt-10 lg:pt-10" aria-labelledby="form-heading">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <Heading level={2} id="form-heading" eyebrow="Message us">
                Send TechBrotherz a Message
              </Heading>
              <p className="type-body text-tb-muted mt-4">
                Describe the fault and the store replies with what it is likely to be, as a free
                quote. This is a message and a quote request, not a booking: TechBrotherz is
                walk-in, with no appointment system, so just come in whenever suits you.
              </p>

              <Card className="mt-6">
                <ContactForm />
              </Card>
            </div>

            {/* Someone who would rather call should not have to scroll past
                a form to find the number: the full store card sits beside
                the form, phone first. */}
            <div className="lg:col-span-5">
              <LocalInfoCard headingLevel={3} heading="Rather Call or Walk In?" columns={1} socials />
            </div>
          </div>
        </Section>
      }
    >
      {/* --------------------------------------- parking, transit, map */}
      <Section variant="tint" aria-labelledby="getting-here-heading">
        <Heading level={2} id="getting-here-heading" eyebrow="Getting here">
          How Do You Get to TechBrotherz?
        </Heading>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Card>
            <Car aria-hidden="true" size={24} strokeWidth={1.5} className="text-tb-green-deep" />
            <h3 className="type-h3 text-tb-text mt-4">Parking</h3>
            <p className="type-body text-tb-muted mt-2">
              Parking is free in the plaza in front of the store, so you can pull in, drop the
              device off and wait.
            </p>
          </Card>

          <Card>
            <Bus aria-hidden="true" size={24} strokeWidth={1.5} className="text-tb-green-deep" />
            <h3 className="type-h3 text-tb-text mt-4">Transit</h3>
            <p className="type-body text-tb-muted mt-2">
              The MAX Purple bus rapid transit line runs the full length of 17 Avenue SE between
              downtown Calgary and East Hills, with stops along International Avenue close to the
              store.
            </p>
          </Card>

          <Card>
            <h3 className="type-h3 text-tb-text">Before You Travel</h3>
            <ul className="type-body text-tb-muted mt-2 list-disc space-y-2 pl-5">
              <li>Back the device up if you can; a backup costs nothing.</li>
              <li>Bring the charger with a laptop that will not charge.</li>
              <li>Call ahead if your model is unusual, so the part is confirmed in stock.</li>
            </ul>
          </Card>
        </div>

        <MapReveal
          className="mt-10 h-80 md:h-96"
          src={SITE.googleMapsEmbedUrl}
          title="Map showing TechBrotherz at 3317 17 Ave SE, Calgary"
          addressLine={`${SITE.street}, ${SITE.city}, ${SITE.region}`}
        />

        {neighbourhoods.length > 0 ? (
          <div className="mt-10">
            <h3 className="type-h3 text-tb-text">Coming From Nearby</h3>
            <ul className="type-body mt-3 flex flex-wrap gap-x-8 gap-y-2">
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
              <li>
                <Link href="/locations" className="text-tb-green-deep hover:underline">
                  Every area we serve
                </Link>
              </li>
            </ul>
          </div>
        ) : null}
      </Section>

      {/* ------------------------------------------------------------ faqs */}
      <ScopedFaqs
        faqs={faqs}
        id="page-faq-heading"
        heading="Questions about visiting the store"
        variant="light"
      />
    </PageShell>
  );
}
