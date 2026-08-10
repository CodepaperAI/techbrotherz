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

const PATH = "/privacy-policy";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How TechBrotherz in Calgary collects, uses and protects personal information, under PIPEDA and Alberta's Personal Information Protection Act.",
  path: PATH,
});

export default async function PrivacyPolicyPage() {
  const [settings, reviews] = await Promise.all([getSiteSettings(), getReviewSummary()]);

  const schema = [
    organization(settings ?? {}),
    website(settings ?? {}),
    localBusiness(settings ?? {}, reviews),
    webPage({
      type: "WebPage",
      name: "TechBrotherz privacy policy",
      description:
        "How TechBrotherz collects, uses and protects personal information under PIPEDA and Alberta PIPA.",
      path: PATH,
    }),
  ];

  return (
    <PageShell
      path={PATH}
      eyebrow="Legal"
      title="Privacy policy"
      crumbLabel="Privacy policy"
      lead={
        <>
          This policy explains what personal information TechBrotherz, a repair shop at{" "}
          {SITE.street} in {SITE.city}, {SITE.region}, collects, why it collects it, and what it
          does with it.
        </>
      }
      answerBox={{
        answer: `TechBrotherz collects only what a repair needs: your name, a phone number or email to reach you, and a description of the device and the fault. It does not sell personal information. Repair records are kept to honour the ${settings?.warrantyDays ?? 60}-day warranty. To ask what is held about you, call ${SITE.phone}.`,
        keyFacts: [
          { label: "What is collected", value: "Name, contact details, device and fault details" },
          { label: "Why", value: "To carry out and warrant the repair" },
          { label: "Sold or shared", value: "Never sold. Shared only where the law requires" },
          { label: "Your rights", value: "Access and correction, under PIPEDA and Alberta PIPA" },
          { label: "Contact", value: `${SITE.phone}, or in person at ${SITE.street}` },
        ],
        lastUpdated: settings?._updatedAt,
      }}
      schema={schema}
    >
      <Section variant="tint" className="pt-0 md:pt-0 lg:pt-0">
        <Card className="border-l-tb-green border-l-4">
          <h2 className="type-h3 text-tb-text">Before launch, a lawyer should read this</h2>
          <p className="type-body text-tb-muted mt-3">
            This policy has been written to describe accurately what TechBrotherz actually does, and
            it refers to the correct Canadian and Alberta legislation. It is not legal advice, and
            it has not been reviewed by a lawyer. Have a lawyer read this page and the terms of
            service before the site goes live, particularly if TechBrotherz begins taking payments
            online or holding customer data beyond repair records.
          </p>
        </Card>
      </Section>

      <Section aria-labelledby="what-we-collect">
        <Heading level={2} id="what-we-collect" eyebrow="Collection">
          What personal information does TechBrotherz collect?
        </Heading>

        <div className="type-body measure text-tb-muted mt-6 space-y-4">
          <p>
            When you bring a device to TechBrotherz for repair, the shop records your name, a phone
            number or email address to reach you on, a description of the device, and the fault it
            came in with. That is what a repair record needs in order to return the right device to
            the right person and to honour the {settings?.warrantyDays ?? 60}-day warranty
            afterwards.
          </p>
          <p>
            When you use the contact form on this website, TechBrotherz receives the name, the phone
            number or email address, the device and the message you typed. Nothing else from the
            form is stored.
          </p>
          <p>
            TechBrotherz does not ask for and does not want your device passcode unless testing the
            repair requires unlocking the device. Where testing does require it, you are welcome to
            stay in the shop and unlock the device yourself. If you would rather not share a
            passcode, say so and the shop will test what it can without one and tell you what it
            could not check.
          </p>
        </div>
      </Section>

      <Section variant="tint" aria-labelledby="how-we-use">
        <Heading level={2} id="how-we-use" eyebrow="Use">
          What does TechBrotherz do with it?
        </Heading>

        <div className="type-body measure text-tb-muted mt-6 space-y-4">
          <p>
            TechBrotherz uses your information to carry out the repair, to contact you about that
            repair, and to check warranty claims against the original work. It does not sell
            personal information, and it does not pass it to third parties for marketing.
          </p>
          <p>
            Information is disclosed to a third party only where the law requires it, for example in
            response to a lawful order. If TechBrotherz ever needs to send a device to a specialist
            for a repair it cannot do in the shop, you will be told before that happens.
          </p>
        </div>
      </Section>

      <Section aria-labelledby="data-on-devices">
        <Heading level={2} id="data-on-devices" eyebrow="Your device">
          What about the data on my device?
        </Heading>

        <div className="type-body measure text-tb-muted mt-6 space-y-4">
          <p>
            A screen, battery, charging port, button or camera repair does not touch the storage in
            your device, so your photos, messages, contacts and apps stay where they are.
            TechBrotherz does not copy, browse or retain the contents of a customer device.
          </p>
          <p>
            Some computer work, in particular a Windows installation, necessarily affects what is on
            the machine. Where that is the case, TechBrotherz tells you before starting and agrees
            with you what needs to be preserved. Back up any device before bringing it in for
            repair, because no repair is entirely without risk and a backup costs you nothing.
          </p>
        </div>
      </Section>

      <Section variant="tint" aria-labelledby="website-data">
        <Heading level={2} id="website-data" eyebrow="This website">
          What does this website collect?
        </Heading>

        <div className="type-body measure text-tb-muted mt-6 space-y-4">
          <p>
            This website uses privacy-focused analytics to count page views and understand which
            pages people find useful. That data is aggregated and is not used to identify individual
            visitors. If Google Analytics is enabled on this site, its own privacy terms apply in
            addition to this policy.
          </p>
          <p>
            The map on the contact page is a Google Maps embed, and it is deliberately not loaded
            until you click to load it. That means no request is made to Google, and no data is sent
            to Google, unless you choose to open the map.
          </p>
        </div>
      </Section>

      <Section aria-labelledby="your-rights">
        <Heading level={2} id="your-rights" eyebrow="Your rights">
          What are my rights?
        </Heading>

        <div className="type-body measure text-tb-muted mt-6 space-y-4">
          <p>
            In Canada, the Personal Information Protection and Electronic Documents Act, known as
            PIPEDA, and in Alberta the Personal Information Protection Act, known as PIPA, give you
            the right to ask an organisation what personal information it holds about you, to ask
            for it to be corrected if it is wrong, and to withdraw consent to its use subject to
            legal and contractual limits.
          </p>
          <p>
            To exercise any of those rights with TechBrotherz, call {SITE.phone} or come to{" "}
            {ADDRESS_LINE} during opening hours. TechBrotherz will respond within the time the
            legislation requires.
          </p>
          <p>
            You can find more about these rights from the Office of the Privacy Commissioner of
            Canada at{" "}
            <a
              href="https://www.priv.gc.ca"
              rel="noopener"
              target="_blank"
              className="text-tb-green-deep hover:underline"
            >
              priv.gc.ca
            </a>{" "}
            and from the Office of the Information and Privacy Commissioner of Alberta at{" "}
            <a
              href="https://oipc.ab.ca"
              rel="noopener"
              target="_blank"
              className="text-tb-green-deep hover:underline"
            >
              oipc.ab.ca
            </a>
            .
          </p>
        </div>
      </Section>

      <Section variant="tint" aria-labelledby="privacy-contact">
        <Heading level={2} id="privacy-contact" eyebrow="Contact">
          How do I contact TechBrotherz about privacy?
        </Heading>

        <div className="type-body measure text-tb-muted mt-6 space-y-4">
          <p>
            Call {SITE.phone}, or come in to {ADDRESS_LINE} during opening hours. There is no
            separate privacy department: the shop that repaired your device is the shop that holds
            the record.
          </p>
          <p>
            Related pages:{" "}
            <Link href="/terms" className="text-tb-green-deep hover:underline">
              the terms of service
            </Link>
            ,{" "}
            <Link href="/warranty" className="text-tb-green-deep hover:underline">
              the {settings?.warrantyDays ?? 60}-day warranty
            </Link>{" "}
            and{" "}
            <Link href="/contact" className="text-tb-green-deep hover:underline">
              contact and directions
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
