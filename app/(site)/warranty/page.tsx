import Link from "next/link";
import type { Metadata } from "next";

import { ScopedFaqs } from "@/components/blocks/ScopedFaqs";
import { PageShell } from "@/components/blocks/PageShell";
import { Card } from "@/components/primitives/Card";
import { Container } from "@/components/primitives/Container";
import { Heading } from "@/components/primitives/Heading";
import { PillButton } from "@/components/primitives/PillButton";
import { Section } from "@/components/primitives/Section";
import { getCoreFaqContext } from "@/lib/content/core-context";
import { warrantyFaqs } from "@/lib/content/core-faqs";
import { composeFaqs, globalLinks } from "@/lib/faq/scoping";
import { buildMetadata } from "@/lib/seo/metadata";
import { localBusiness, organization, webPage, website } from "@/lib/seo/schema";
import { SITE, TEL_HREF } from "@/lib/site";
import { getAllFaqs, getReviewSummary, getSiteSettings } from "@/lib/data";

export const revalidate = 3600;

const PATH = "/warranty";

export const metadata: Metadata = buildMetadata({
  title: "60-Day Repair Warranty, Calgary",
  description:
    "Every TechBrotherz repair in Calgary carries a 60-day warranty on the part and the workmanship. What it covers, what it does not, and how to claim.",
  path: PATH,
});

export default async function WarrantyPage() {
  const [settings, reviews, allFaqs] = await Promise.all([
    getSiteSettings(),
    getReviewSummary(),
    getAllFaqs(),
  ]);

  const warrantyDays = settings?.warrantyDays ?? 60;
  // FAQ scoping rule, CLAUDE.md Section 8.8. Questions this page can answer
  // with its own numbers, plus at most two pointers to the canonical
  // answers on /faq. Only the page-specific ones reach structured data.
  const coreCtx = await getCoreFaqContext();
  const faqs = composeFaqs({
    path: PATH,
    pageSpecific: warrantyFaqs(coreCtx),
    globalLinks: globalLinks(allFaqs, ["warranty", "parts"], 2),
  });

  const schema = [
    organization(settings ?? {}),
    website(settings ?? {}),
    localBusiness(settings ?? {}, reviews),
    webPage({
      type: "WebPage",
      name: `The TechBrotherz ${warrantyDays}-day repair warranty`,
      description: `Every repair at TechBrotherz in Calgary carries a ${warrantyDays}-day warranty on the part fitted and the workmanship.`,
      path: PATH,
      speakableSelectors: ['[data-speakable="answer"]'],
    }),
    faqs.schema,
  ];

  return (
    <PageShell
      path={PATH}
      eyebrow="Warranty"
      title={`The TechBrotherz ${warrantyDays}-day repair warranty`}
      crumbLabel="Warranty"
      lead={
        <>
          Every repair TechBrotherz carries out at {SITE.street} in {SITE.city}, {SITE.region} is
          covered for {warrantyDays} days. This page sets out exactly what that covers, what it does
          not, and what to do if something goes wrong.
        </>
      }
      answerBox={{
        answer: `Every repair at TechBrotherz in Calgary carries a ${warrantyDays}-day warranty covering both the part fitted and the workmanship. If the part fails or the original fault returns within ${warrantyDays} days, bring the device back to ${SITE.street} and we put it right at no charge. New accidental damage is not covered.`,
        keyFacts: [
          { label: "Length", value: `${warrantyDays} days from the day of the repair` },
          { label: "Covers", value: "The part fitted and the workmanship" },
          { label: "Does not cover", value: "New accidental damage, liquid, or a different fault" },
          { label: "Cost to claim", value: "Nothing, if the fault is covered" },
          {
            label: "How to claim",
            value: `Bring the device to ${SITE.street} during opening hours`,
          },
        ],
        lastUpdated: settings?._updatedAt,
      }}
      schema={schema}
    >
      {/* ----------------------------------------------------- what it is */}
      <Section variant="tint" className="pt-0 md:pt-0 lg:pt-0" aria-labelledby="what-covers">
        <Heading level={2} id="what-covers" eyebrow="Cover">
          What does the {warrantyDays}-day warranty cover?
        </Heading>

        <p className="type-body measure text-tb-muted mt-6">
          The TechBrotherz warranty covers two things: the component fitted during the repair, and
          the work done to fit it. If a replacement screen develops dead touch areas, if a new
          battery will not hold a charge, or if the fault the device came in with returns, that is a
          warranty claim and there is nothing to pay.
        </p>

        <p className="type-body measure text-tb-muted mt-4">
          The warranty runs for {warrantyDays} days from the day of the repair, and it applies to
          every repair TechBrotherz does, on every device, at every price. There is no separate
          extended cover to buy and no registration to complete.
        </p>

        <div className="border-tb-border bg-tb-white rounded-card mt-10 overflow-x-auto border">
          <table className="w-full min-w-[34rem] border-collapse text-left">
            <caption className="type-body text-tb-text border-tb-border border-b px-6 py-4 text-left font-medium">
              What the {warrantyDays}-day TechBrotherz warranty covers and excludes
            </caption>
            <thead>
              <tr className="tb-thead">
                <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-3">
                  Situation
                </th>
                <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-3">
                  Covered
                </th>
                <th scope="col" className="type-eyebrow text-tb-green-deep px-6 py-3">
                  Why
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "The replacement screen develops dead spots or lines",
                  "Yes",
                  "The part we fitted has failed.",
                ],
                [
                  "The new battery drains far faster than it should",
                  "Yes",
                  "The part we fitted has failed.",
                ],
                [
                  "The original fault comes back",
                  "Yes",
                  "Either the part or the work did not resolve it.",
                ],
                [
                  "The screen lifts at a corner after the repair",
                  "Yes",
                  "That is a workmanship issue, not damage.",
                ],
                [
                  "You drop the device and crack the new screen",
                  "No",
                  "That is new accidental damage, not a failure of our work.",
                ],
                [
                  "Liquid gets into the device after the repair",
                  "No",
                  "That is new damage from outside the repair.",
                ],
                [
                  "A different part fails, unrelated to the repair",
                  "No",
                  "The warranty covers what we replaced, not the whole device.",
                ],
                [
                  "The device is opened by someone else after our repair",
                  "No",
                  "We cannot warrant work once another repair has disturbed it.",
                ],
              ].map(([situation, covered, why]) => (
                <tr key={situation} className="border-tb-border border-t">
                  <th
                    scope="row"
                    className="text-tb-text px-6 py-4 text-left align-top font-normal"
                  >
                    {situation}
                  </th>
                  <td
                    className={`px-6 py-4 align-top font-medium ${
                      covered === "Yes" ? "text-tb-green-deep" : "text-tb-text"
                    }`}
                  >
                    {covered}
                  </td>
                  <td className="type-body text-tb-muted px-6 py-4 align-top">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* -------------------------------------------------------- claiming */}
      <Section aria-labelledby="how-to-claim">
        <Heading level={2} id="how-to-claim" eyebrow="Claiming">
          How do I claim on the warranty?
        </Heading>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {[
            {
              step: "1",
              title: "Bring the device in",
              body: `Come to ${SITE.street} in ${SITE.city} during opening hours. No appointment is needed for a warranty claim, the same as for any other repair.`,
            },
            {
              step: "2",
              title: "Bring your receipt if you have it",
              body: "A receipt makes it quicker, but it is not essential. TechBrotherz keeps a record of the repair, so we can look it up from the device.",
            },
            {
              step: "3",
              title: "We inspect and put it right",
              body: "We check what has failed. If it is the part or the work, we repair it again at no charge. If it is new damage, we will show you why and quote it before doing anything.",
            },
          ].map((item) => (
            <Card key={item.step}>
              <span className="type-eyebrow text-tb-green-deep">Step {item.step}</span>
              <h3 className="type-h3 text-tb-text mt-3">{item.title}</h3>
              <p className="type-body text-tb-muted mt-3">{item.body}</p>
            </Card>
          ))}
        </div>

        <p className="type-body measure text-tb-muted mt-10">
          If you cannot get to the shop quickly, call {SITE.phone} and tell us what has happened.
          Getting the fault recorded inside the {warrantyDays} days is what matters, and we can
          arrange when you bring the device in from there.
        </p>
      </Section>

      {/* ---------------------------------------------------- honest gaps */}
      <Section variant="tint" aria-labelledby="what-we-do-not-know">
        <Heading level={2} id="what-we-do-not-know" eyebrow="Being straight">
          What is not settled yet?
        </Heading>

        <Card className="border-l-tb-green mt-8 border-l-4">
          <p className="type-body measure text-tb-text">
            Two points are worth stating plainly rather than papering over. TechBrotherz has not yet
            defined a written policy on whether a warranty repair restarts the {warrantyDays}-day
            clock or continues the original period, and it has not published a formal position on
            devices with pre-existing damage that is unrelated to the repair. Rather than invent
            terms on this page, we say what is known: the {warrantyDays} days, the cover on the part
            and the workmanship, and the exclusions in the table above. Ask at the counter if either
            of those two points affects you, and you will get a straight answer for your specific
            case.
          </p>
        </Card>

        <p className="type-body measure text-tb-muted mt-8">
          Nothing on this page affects your rights under Alberta consumer protection law, which
          apply regardless of any warranty a business offers.
        </p>
      </Section>

      {/* -------------------------------------------------- why it matters */}
      <Section aria-labelledby="why-warranty-matters">
        <Heading
          level={2}
          id="why-warranty-matters"
          eyebrow="Why it matters"
          lead="A warranty stated as a number of days is something you can hold a shop to. A warranty described as generous is not."
        >
          Why does a written warranty matter?
        </Heading>

        <p className="type-body measure text-tb-muted mt-6">
          Aftermarket phone parts vary in quality, and a small proportion of any batch fails early
          whoever fits them. The question worth asking a repair shop is not whether that ever
          happens, but what the shop does when it does. TechBrotherz answers that with a number:{" "}
          {warrantyDays} days, on the part and the work, at no charge.
        </p>

        <p className="type-body measure text-tb-muted mt-4">
          Every quote given at the counter, as described on{" "}
          <Link href="/contact" className="text-tb-green-deep hover:underline">
            how TechBrotherz quotes a repair
          </Link>
          , already includes that cover, so there is nothing extra to add at the counter. The same
          applies to every service on{" "}
          <Link href="/services" className="text-tb-green-deep hover:underline">
            the repair services page
          </Link>
          .
        </p>
      </Section>

      {/* ------------------------------------------------------------ faqs */}
      <ScopedFaqs
        faqs={faqs}
        id="page-faq-heading"
        heading="Questions about the warranty"
        variant="tint"
      />

      <Section variant="dark" contained={false}>
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <h2 className="type-h2 text-tb-white">Something not right after a repair?</h2>
              <p className="type-lead measure text-tb-muted-dark mt-4">
                Bring it back to {SITE.street}. If it is the part or the work, we put it right at no
                charge inside {warrantyDays} days.
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
