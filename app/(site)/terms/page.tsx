import Link from "next/link";
import type { Metadata } from "next";

import { PageShell } from "@/components/blocks/PageShell";
import { Card } from "@/components/primitives/Card";
import { Heading } from "@/components/primitives/Heading";
import { Section } from "@/components/primitives/Section";
import { buildMetadata } from "@/lib/seo/metadata";
import { localBusiness, organization, webPage, website } from "@/lib/seo/schema";
import { ADDRESS_LINE, SITE, TEL_HREF } from "@/lib/site";
import { getReviewSummary, getSiteSettings } from "@/lib/data";

export const revalidate = 3600;

const PATH = "/terms";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description:
    "The terms TechBrotherz in Calgary repairs devices under: quotes, the 60-day warranty, uncollected devices, liability and Alberta consumer law.",
  path: PATH,
});

export default async function TermsPage() {
  const [settings, reviews] = await Promise.all([getSiteSettings(), getReviewSummary()]);

  const warrantyDays = settings?.warrantyDays ?? 60;

  const schema = [
    organization(settings ?? {}),
    website(settings ?? {}),
    localBusiness(settings ?? {}, reviews),
    webPage({
      type: "WebPage",
      name: "TechBrotherz terms of service",
      description: "The terms TechBrotherz repairs devices under in Calgary, Alberta.",
      path: PATH,
    }),
  ];

  return (
    <PageShell
      path={PATH}
      eyebrow="Legal"
      title="Terms of service"
      crumbLabel="Terms"
      lead={
        <>
          These terms cover repairs carried out by TechBrotherz at {SITE.street} in {SITE.city},{" "}
          {SITE.region}, and the use of this website.
        </>
      }
      answerBox={{
        answer: `TechBrotherz quotes a firm price before starting any repair, and you pay that price on collection. Every repair carries a ${warrantyDays}-day warranty on the part and the workmanship. Prices on this site are in Canadian dollars and include the part and the labour. Nothing here limits your rights under Alberta consumer protection law.`,
        keyFacts: [
          { label: "Quotes", value: "Given before work starts, and honoured" },
          { label: "Payment", value: "On collection, in Canadian dollars" },
          { label: "Warranty", value: `${warrantyDays} days on the part and the workmanship` },
          { label: "Liability", value: "Limited to the value of the repair, see below" },
          { label: "Your rights", value: "Alberta consumer protection law applies regardless" },
        ],
        lastUpdated: settings?._updatedAt,
      }}
      schema={schema}
    >
      <Section variant="tint" className="pt-0 md:pt-0 lg:pt-0">
        <Card className="border-l-tb-green border-l-4">
          <h2 className="type-h3 text-tb-text">Before launch, a lawyer should read this</h2>
          <p className="type-body text-tb-muted mt-3">
            These terms have been written to describe accurately how TechBrotherz actually operates.
            They are not legal advice and they have not been reviewed by a lawyer. Have a lawyer
            read this page and{" "}
            <Link href="/privacy-policy" className="text-tb-green-deep hover:underline">
              the privacy policy
            </Link>{" "}
            before the site goes live. Several points below, in particular the uncollected device
            period and the limitation of liability, need a lawyer&rsquo;s eye and the Store
            owner&rsquo;s decision before they are relied on.
          </p>
        </Card>
      </Section>

      <Section aria-labelledby="quotes-heading">
        <Heading level={2} id="quotes-heading" eyebrow="Quotes and prices">
          How do quotes and prices work?
        </Heading>

        <div className="type-body measure text-tb-muted mt-6 space-y-4">
          <p>
            TechBrotherz gives you a firm price before starting any repair, and that is the price
            you pay. If opening the device reveals a second fault, TechBrotherz stops, tells you
            what it has found, and quotes that separately. No additional work is carried out without
            your agreement.
          </p>
          <p>
            Prices published on this website are in Canadian dollars and include both the part and
            the labour. They do not include tax. Where a repair shows Call for quote, the part is
            ordered in and the price depends on supply on the day, so the figure is confirmed when
            you call or come in.
          </p>
          <p>
            Computer diagnostics carry a fixed fee, quoted before the machine is opened, and that
            fee is deducted from the bill if you go ahead with the repair.
            If you go ahead with the repair we recommend, that diagnostic finding is what the quote
            is based on.
          </p>
        </div>
      </Section>

      <Section variant="tint" aria-labelledby="warranty-terms-heading">
        <Heading level={2} id="warranty-terms-heading" eyebrow="Warranty">
          What does the warranty commit TechBrotherz to?
        </Heading>

        <div className="type-body measure text-tb-muted mt-6 space-y-4">
          <p>
            Every repair carries a {warrantyDays}-day warranty covering the part fitted and the
            workmanship. If the part fails or the original fault returns within {warrantyDays} days,
            TechBrotherz puts it right at no charge. New accidental damage, liquid ingress after the
            repair, and faults unrelated to the work carried out are not covered.
          </p>
          <p>
            The full terms, including a table of what is and is not covered, are set out on{" "}
            <Link href="/warranty" className="text-tb-green-deep hover:underline">
              the warranty page
            </Link>
            .
          </p>
        </div>
      </Section>

      <Section aria-labelledby="your-responsibilities">
        <Heading level={2} id="your-responsibilities" eyebrow="Your part">
          What is expected of you?
        </Heading>

        <div className="type-body measure text-tb-muted mt-6 space-y-4">
          <p>
            Back up your device before bringing it in. A screen, battery or port repair does not
            touch your storage, but no repair is entirely without risk, a device that arrives with a
            hidden fault can behave unpredictably, and a backup costs you nothing.
          </p>
          <p>
            Bring a device you are entitled to have repaired. TechBrotherz does not knowingly work
            on devices reported lost or stolen, and a phone on the national blacklist cannot be
            unlocked by anyone, including TechBrotherz.
          </p>
          <p>
            Tell us about previous repairs. A device opened by someone else may have missing screws,
            damaged seals or non-original parts inside, and knowing that in advance changes what we
            can promise.
          </p>
        </div>
      </Section>

      <Section variant="tint" aria-labelledby="uncollected-heading">
        <Heading level={2} id="uncollected-heading" eyebrow="Collection">
          What happens to a device that is not collected?
        </Heading>

        <div className="type-body measure text-tb-muted mt-6 space-y-4">
          <p>
            TechBrotherz will contact you on the number or email you gave when a repair is finished.
            A device left uncollected takes up bench space and is at risk of loss, so please collect
            promptly.
          </p>
          <p>
            TechBrotherz has not yet set a written period after which an uncollected device is
            treated as abandoned, so rather than state a figure that has not been decided, this page
            says plainly that no such period is currently defined. If a device of yours is
            outstanding, call {SITE.phone} and it will be dealt with case by case. This section is
            one of the points that needs the owner&rsquo;s decision and a lawyer&rsquo;s review
            before launch.
          </p>
        </div>
      </Section>

      <Section aria-labelledby="liability-heading">
        <Heading level={2} id="liability-heading" eyebrow="Liability">
          What is TechBrotherz responsible for?
        </Heading>

        <div className="type-body measure text-tb-muted mt-6 space-y-4">
          <p>
            TechBrotherz is responsible for the repair it carries out and for the part it fits, on
            the terms of the {warrantyDays}-day warranty. TechBrotherz is not responsible for data
            loss on a device that was not backed up, for pre-existing faults it did not cause, or
            for damage that occurs after the device leaves the Store.
          </p>
          <p>
            Liquid damage is a special case, and TechBrotherz says so openly rather than in small
            print. A device that has been in liquid may fail during or after cleaning for reasons
            that have nothing to do with the work done, because corrosion continues inside the
            device. TechBrotherz will tell you what it finds and will not charge for work beyond
            what was agreed.
          </p>
          <p>
            Nothing on this page limits your rights under the Alberta Consumer Protection Act or any
            other Canadian consumer protection law. Those rights apply regardless of what a business
            writes in its terms.
          </p>
        </div>
      </Section>

      <Section variant="tint" aria-labelledby="website-terms-heading">
        <Heading level={2} id="website-terms-heading" eyebrow="This website">
          Terms for using this website
        </Heading>

        <div className="type-body measure text-tb-muted mt-6 space-y-4">
          <p>
            Prices on this website are kept current from the Store&rsquo;s own price list and are
            shown in Canadian dollars including the part and the labour. TechBrotherz aims to keep
            every figure accurate, and the price confirmed at the counter is the price that applies.
          </p>
          <p>
            The content of this website is provided so you can decide whether a repair is worth
            making. It is not a substitute for having the device looked at, because two devices with
            the same symptom can need different repairs.
          </p>
          <p>These terms are governed by the laws of the Province of Alberta.</p>
        </div>
      </Section>

      <Section aria-labelledby="terms-contact-heading">
        <Heading level={2} id="terms-contact-heading" eyebrow="Contact">
          Questions about these terms
        </Heading>

        <div className="type-body measure text-tb-muted mt-6 space-y-4">
          <p>
            Call {SITE.phone} or come in to {ADDRESS_LINE} during opening hours.
          </p>
          <p>
            Related pages:{" "}
            <Link href="/privacy-policy" className="text-tb-green-deep hover:underline">
              the privacy policy
            </Link>
            ,{" "}
            <Link href="/warranty" className="text-tb-green-deep hover:underline">
              the {warrantyDays}-day warranty
            </Link>{" "}
            and{" "}
            <Link href="/contact" className="text-tb-green-deep hover:underline">
              how a repair is quoted
            </Link>
            .
          </p>
          <p>
            <a href={TEL_HREF} className="text-tb-green-deep font-medium hover:underline">
              Call {SITE.phone}
            </a>
          </p>
        </div>
      </Section>
    </PageShell>
  );
}
