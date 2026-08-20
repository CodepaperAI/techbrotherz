import Link from "next/link";
import type { Metadata } from "next";
import type { PortableTextBlock } from "@portabletext/types";

import { FaqAccordion } from "@/components/blocks/FaqAccordion";
import { PageShell } from "@/components/blocks/PageShell";
import { RichText } from "@/components/blocks/RichText";
import { Container } from "@/components/primitives/Container";
import { Heading } from "@/components/primitives/Heading";
import { PillButton } from "@/components/primitives/PillButton";
import { Section } from "@/components/primitives/Section";
import { faqAnchor } from "@/lib/faq/scoping";
import { buildMetadata } from "@/lib/seo/metadata";
import { faqPage, localBusiness, organization, webPage, website } from "@/lib/seo/schema";
import { SITE, TEL_HREF } from "@/lib/site";
import { getAllFaqs, getReviewSummary, getSiteSettings } from "@/lib/data";

export const revalidate = 3600;

const PATH = "/faq";

export const metadata: Metadata = buildMetadata({
  title: "Phone Repair FAQ, Calgary",
  description:
    "Answers on repair prices, the 60-day warranty, walk-in times, parts, data safety and unlocking at TechBrotherz in Calgary. No appointment needed.",
  path: PATH,
});

/** Display order and the question each group answers. */
const CATEGORY_ORDER: { key: string; label: string; question: string }[] = [
  { key: "pricing", label: "Pricing and payment", question: "What does a repair cost?" },
  { key: "walkin", label: "Walk-in policy", question: "Do I need an appointment?" },
  { key: "turnaround", label: "Turnaround time", question: "How long will it take?" },
  { key: "warranty", label: "Warranty", question: "What does the warranty cover?" },
  { key: "parts", label: "Parts quality", question: "What parts do you use?" },
  { key: "data", label: "Data and privacy", question: "What happens to my data?" },
  { key: "unlocking", label: "Unlocking", question: "How does phone unlocking work?" },
  { key: "ipad", label: "iPad and tablets", question: "Should I repair or replace my iPad?" },
  { key: "iphone", label: "iPhone", question: "Questions about iPhone repairs" },
  { key: "samsung", label: "Samsung", question: "Questions about Samsung repairs" },
  { key: "computer", label: "Laptops and computers", question: "Questions about computer repairs" },
  {
    key: "location",
    label: "Location and parking",
    question: "Where are you and when are you open?",
  },
  { key: "business", label: "Business services", question: "Questions about business repairs" },
];

export default async function FaqPage() {
  const [settings, reviews, faqs] = await Promise.all([
    getSiteSettings(),
    getReviewSummary(),
    getAllFaqs(),
  ]);

  const warrantyDays = settings?.warrantyDays ?? 60;
  const waitMinutes = settings?.typicalWaitMinutes ?? 30;

  const groups = CATEGORY_ORDER.map((category) => ({
    ...category,
    faqs: faqs.filter((faq) => faq.category === category.key),
  })).filter((group) => group.faqs.length > 0);

  /**
   * One FAQPage node for the whole page, built from the same array the
   * accordions render. faqPage() drops duplicate questions, so a question that
   * appears in two categories is never emitted twice.
   */
  const schema = [
    organization(settings ?? {}),
    website(settings ?? {}),
    localBusiness(settings ?? {}, reviews),
    webPage({
      type: "WebPage",
      name: "Frequently asked questions about phone and computer repair in Calgary",
      description:
        "Answers on repair prices, the 60-day warranty, walk-in times, parts and data safety at TechBrotherz in Calgary.",
      path: PATH,
      speakableSelectors: ['[data-speakable="answer"]'],
    }),
    faqPage(faqs, PATH),
  ];

  return (
    <PageShell
      path={PATH}
      eyebrow="Answers"
      title="Frequently asked questions about repairs in Calgary"
      crumbLabel="FAQ"
      lead={
        <>
          Every question below is answered by TechBrotherz, a walk-in cell phone and computer repair store
          at {SITE.street} in {SITE.city}, {SITE.region}. If your question is not here, call{" "}
          {SITE.phone} and ask.
        </>
      }
      answerBox={{
        answer: `TechBrotherz in Calgary is a walk-in store, so no appointment is needed. Most phone screen and battery repairs take about ${waitMinutes} minutes while you wait, every price includes the part and the labour, and every repair carries a ${warrantyDays}-day warranty on both the part and the workmanship.`,
        keyFacts: [
          { label: "Appointment", value: "Not needed at any time" },
          { label: "Typical wait", value: `About ${waitMinutes} minutes on most phone repairs` },
          { label: "Warranty", value: `${warrantyDays} days on the part and the workmanship` },
          { label: "Prices", value: "Include the part and the labour, no separate bench fee" },
          { label: "Where", value: `${SITE.street}, ${SITE.city}, ${SITE.region}` },
        ],
        lastUpdated: settings?._updatedAt,
      }}
      schema={schema}
    >
      {/* -------------------------------------------------- category nav */}
      <Section variant="tint" className="pt-0 md:pt-0 lg:pt-0">
        <div className="border-tb-border bg-tb-white rounded-card border p-5">
          <h2 className="type-eyebrow text-tb-muted">Jump to a topic</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {groups.map((group) => (
              <li key={group.key}>
                <a
                  href={`#${group.key}`}
                  className="border-tb-border hover:border-tb-ink rounded-chip text-tb-text inline-flex h-9 items-center gap-2 border px-4 text-[0.9375rem] transition-colors duration-[180ms] ease-out"
                >
                  {group.label}
                  <span className="type-caption text-tb-muted">{group.faqs.length}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ----------------------------------------------------- the groups */}
      {groups.map((group, index) => (
        <Section
          key={group.key}
          id={group.key}
          variant={index % 2 === 0 ? "light" : "tint"}
          aria-labelledby={`heading-${group.key}`}
        >
          <Heading level={2} id={`heading-${group.key}`} eyebrow={group.label}>
            {group.question}
          </Heading>

          <FaqAccordion
            className="mt-8"
            items={group.faqs.map((faq) => ({
              question: faq.question ?? "",
              answer: <RichText value={faq.answer as unknown as PortableTextBlock[]} />,
              // Pages elsewhere link to /faq#<anchor> instead of repeating the
              // answer. The anchor is derived from the question text, so the
              // two ends cannot drift apart. lib/faq/scoping.ts
              anchorId: faqAnchor(faq.question ?? ""),
            }))}
          />
        </Section>
      ))}

      {/* ------------------------------------------------------ next steps */}
      <Section aria-labelledby="faq-next-heading">
        <Heading
          level={2}
          id="faq-next-heading"
          eyebrow="Next"
          lead="If you already know what your device needs, these are the pages worth reading before you come in."
        >
          Where to go next
        </Heading>

        <ul className="type-body divide-tb-border mt-8 grid gap-x-10 divide-y md:grid-cols-2 md:divide-y-0">
          {[
            { href: "/contact", label: "How quoting works and what to bring" },
            { href: "/services", label: "All repair services TechBrotherz offers" },
            {
              href: `/warranty`,
              label: `What the ${warrantyDays}-day warranty covers and excludes`,
            },
            { href: "/contact", label: "Directions, parking and opening hours" },
            { href: "/locations", label: "The Calgary areas TechBrotherz serves" },
            { href: "/about", label: "About the store and what we repair" },
          ].map((link) => (
            <li key={link.href} className="md:border-tb-border md:border-b">
              <Link
                href={link.href}
                className="text-tb-text hover:text-tb-green-deep block py-3.5 hover:underline"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section variant="dark" contained={false}>
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <h2 className="type-h2 text-tb-white">Still have a question?</h2>
              <p className="type-lead measure text-tb-muted-dark mt-4">
                Call {SITE.phone} and describe the fault. We will tell you what it is likely to be
                and what it costs before you travel to {SITE.street}.
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
