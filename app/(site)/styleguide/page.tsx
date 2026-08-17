import type { Metadata } from "next";
import { Clock, DoorOpen, ShieldCheck, Wrench } from "lucide-react";

import { AnswerBox } from "@/components/blocks/AnswerBox";
import { Breadcrumbs } from "@/components/blocks/Breadcrumbs";
import { FaqAccordion } from "@/components/blocks/FaqAccordion";
import { IconCard } from "@/components/blocks/IconCard";
import { LocalInfoCard } from "@/components/blocks/LocalInfoCard";
import { Logo, Mark } from "@/components/layout/Logo";
import { ConceptMark, LogoConcept } from "@/components/blocks/LogoConcepts";
import { cn } from "@/lib/utils";
import { ModelGrid } from "@/components/blocks/ModelGrid";
import { RelatedLinks } from "@/components/blocks/RelatedLinks";
import { SplitBlock } from "@/components/blocks/SplitBlock";
import { StepCard } from "@/components/blocks/StepCard";
import { TrustStrip } from "@/components/blocks/TrustStrip";
import { StyleguidePhase8 } from "@/components/blocks/StyleguidePhase8";
import { Reveal } from "@/components/motion/Reveal";
import { Card } from "@/components/primitives/Card";
import { Chip } from "@/components/primitives/Chip";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Heading } from "@/components/primitives/Heading";
import { PillButton } from "@/components/primitives/PillButton";
import { Section } from "@/components/primitives/Section";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE, TEL_HREF } from "@/lib/site";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Design system",
    description: "Internal reference rendering every TechBrotherz design token and component.",
    path: "/styleguide",
    noIndex: true,
  }),
};

/* ------------------------------------------------------------------ tokens */

const COLOUR_TOKENS = [
  {
    name: "--tb-green",
    hex: "#21B24B",
    swatch: "bg-tb-green",
    note: "Fills only. Never text on light.",
  },
  {
    name: "--tb-green-deep",
    hex: "#0F7A30",
    swatch: "bg-tb-green-deep",
    note: "The only green for text on light. 5.5:1.",
  },
  {
    name: "--tb-green-press",
    hex: "#17903A",
    swatch: "bg-tb-green-press",
    note: "Button hover and pressed.",
  },
  {
    name: "--tb-paper-2",
    hex: "#E9F7ED",
    swatch: "bg-tb-paper-2",
    note: "Tinted sections and chips.",
  },
  {
    name: "--tb-ink",
    hex: "#0A0D0C",
    swatch: "bg-tb-ink",
    note: "Dark sections. Label on a green fill.",
  },
  {
    name: "--tb-ink-2",
    hex: "#141917",
    swatch: "bg-tb-ink-2",
    note: "Elevated surface inside dark sections.",
  },
  { name: "--tb-paper", hex: "#FAFAF8", swatch: "bg-tb-paper", note: "Page background." },
  { name: "--tb-white", hex: "#FFFFFF", swatch: "bg-tb-white", note: "Cards." },
  {
    name: "--tb-silver",
    hex: "#C4CBD2",
    swatch: "bg-tb-silver",
    note: "Chrome accent. Hairlines and labels on dark.",
  },
  { name: "--tb-text", hex: "#10130F", swatch: "bg-tb-text", note: "Body text on light. 17:1." },
  {
    name: "--tb-muted",
    hex: "#5C6360",
    swatch: "bg-tb-muted",
    note: "Secondary text on light. 5.9:1.",
  },
  {
    name: "--tb-muted-dark",
    hex: "#A9B0AC",
    swatch: "bg-tb-muted-dark",
    note: "Secondary text on dark. 9:1.",
  },
  {
    name: "--tb-border",
    hex: "#E6E4DE",
    swatch: "bg-tb-border",
    note: "1px card and divider borders on light.",
  },
  {
    name: "--tb-border-dark",
    hex: "#232B27",
    swatch: "bg-tb-border-dark",
    note: "Borders inside dark sections.",
  },
] as const;

const TYPE_SCALE = [
  { cls: "type-h1", label: "Hero H1", spec: "72px to 40px, 700, -0.035em, 0.95" },
  { cls: "type-h2", label: "Section H2", spec: "56px to 32px, 700, -0.03em, 1.05" },
  { cls: "type-h3", label: "Card H3", spec: "24px to 20px, 700, -0.015em, 1.2" },
  { cls: "type-lead", label: "Lead paragraph", spec: "20px to 17px, 400, 1.5" },
  { cls: "type-body", label: "Body", spec: "17px to 16px, 400, 1.65" },
  { cls: "type-eyebrow", label: "Eyebrow / chip", spec: "14px, 500, 0.01em, 1" },
  { cls: "type-caption", label: "Caption / legal", spec: "13px, 400, 1.5" },
] as const;

const RADII = [
  { name: "chip / button", cls: "rounded-chip", value: "999px" },
  { name: "input", cls: "rounded-input", value: "12px" },
  { name: "card", cls: "rounded-card", value: "20px" },
  { name: "image", cls: "rounded-image", value: "24px" },
  { name: "panel", cls: "rounded-panel", value: "28px" },
] as const;

const SHADOWS = [
  { name: "shadow-card", cls: "shadow-card", value: "0 1px 2px rgba(10,13,12,.04)" },
  { name: "shadow-lift", cls: "shadow-lift", value: "0 4px 16px rgba(10,13,12,.06)" },
  { name: "shadow-nav", cls: "shadow-nav", value: "0 1px 0 rgba(10,13,12,.06)" },
] as const;

/* ------------------------------------------------------- sample block data */

const SAMPLE_MODELS = [
  { name: "iPhone 8 Plus", href: "/repair/apple-iphone/iphone-8-plus" },
  { name: "iPhone 8", href: "/repair/apple-iphone/iphone-8" },
  { name: "iPhone 7 Plus", href: "/repair/apple-iphone/iphone-7-plus" },
  { name: "iPhone 13", href: "/repair/apple-iphone/iphone-13", fromPrice: null },
];

const SAMPLE_FAQS = [
  {
    question: "Do I need an appointment for a phone repair in Calgary?",
    answer:
      "No. TechBrotherz is a walk-in store at 3317 17 Ave SE in Calgary. Come in during opening hours and most repairs are finished in about 30 minutes while you wait.",
  },
  {
    question: "How long does an iPhone screen replacement take?",
    answer:
      "Most iPhone screen replacements take about 30 minutes. Bring the phone in during opening hours and you can wait while the work is done.",
  },
  {
    question: "What warranty comes with a repair?",
    answer:
      "Every repair carries a 60-day warranty covering the part and the workmanship. Accidental damage after the repair is not covered.",
  },
];

/* ------------------------------------------------------------------- page */

export default function StyleguidePage() {
  return (
    <>
      <StyleguidePhase8 />

      <Section className="pt-10 md:pt-14">
        <Breadcrumbs items={[{ label: "Design system" }]} className="mb-8" />

        <Heading
          level={1}
          eyebrow="Internal"
          lead="Every design token and component in the TechBrotherz system, rendered on one page. The written spec is DESIGN.md. This route is noindex."
        >
          Design system
        </Heading>
      </Section>

      {/* ---------------------------------------------------------- logo */}
      <Section className="pt-0 md:pt-0 lg:pt-0" aria-labelledby="logo">
        <Heading
          level={2}
          id="logo"
          eyebrow="Brand"
          lead="The client's original logo, restored at their request 2026-08 and re-exported from the higher-resolution originals at 3x display size. Light and dark variants, transparent backgrounds. components/layout/Logo.tsx."
        >
          Logo
        </Heading>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="border-tb-border bg-tb-white rounded-card space-y-8 border p-8">
            <p className="type-eyebrow text-tb-muted">On light</p>
            <Logo variant="full" />
            <Logo variant="compact" />
            <Logo variant="icon" />
          </div>
          <div data-surface="dark" className="bg-tb-ink rounded-card space-y-8 p-8">
            <p className="type-eyebrow text-tb-silver">On dark</p>
            <Logo variant="full" onDark />
            <Logo variant="compact" onDark />
            <Logo variant="icon" onDark />
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------ logo directions */}
      <Section variant="tint" aria-labelledby="logo-directions">
        <Heading
          level={2}
          id="logo-directions"
          eyebrow="Brand"
          lead="Three candidate directions beside the current mark, at every size that matters, in both colourways. Nothing is wired into the header until one is chosen. components/blocks/LogoConcepts.tsx."
        >
          Logo directions, compared
        </Heading>

        {(["light", "dark"] as const).map((surface) => {
          const onDark = surface === "dark";
          return (
            <div
              key={surface}
              {...(onDark ? { "data-surface": "dark" } : {})}
              className={
                onDark
                  ? "bg-tb-ink rounded-card mt-8 p-8"
                  : "border-tb-border bg-tb-white rounded-card mt-8 border p-8"
              }
            >
              <p className={onDark ? "type-eyebrow text-tb-silver" : "type-eyebrow text-tb-muted"}>
                On {surface}
              </p>
              <div className="mt-6 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
                {[
                  { key: "current", label: "Current mark" },
                  { key: "a", label: "A · Wordmark and TB monogram" },
                  { key: "b", label: "B · Phone and screwdriver" },
                  { key: "c", label: "C · The Z mark" },
                ].map((column) => (
                  <div key={column.key}>
                    <h3
                      className={cn(
                        "type-h3",
                        onDark ? "text-tb-white" : "text-tb-text",
                      )}
                    >
                      {column.label}
                    </h3>
                    <div className="mt-4 flex items-end gap-4">
                      {[32, 40, 64, 128].map((px) =>
                        column.key === "current" ? (
                          <Mark key={px} size={px} />
                        ) : (
                          <ConceptMark
                            key={px}
                            direction={column.key as "a" | "b" | "c"}
                            size={px}
                            onDark={onDark}
                          />
                        ),
                      )}
                    </div>
                    <div className="mt-6 space-y-4">
                      {column.key === "current" ? (
                        <>
                          <Logo variant="compact" onDark={onDark} />
                          <Logo variant="full" onDark={onDark} />
                        </>
                      ) : (
                        <>
                          <LogoConcept
                            direction={column.key as "a" | "b" | "c"}
                            variant="compact"
                            onDark={onDark}
                          />
                          <LogoConcept
                            direction={column.key as "a" | "b" | "c"}
                            variant="full"
                            onDark={onDark}
                          />
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </Section>

      {/* -------------------------------------------------------- colour */}
      <Section className="pt-0 md:pt-0 lg:pt-0" aria-labelledby="colour">
        <Heading level={2} id="colour" eyebrow="Tokens">
          Colour
        </Heading>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COLOUR_TOKENS.map((token) => (
            <Card key={token.name} padding="tight" className="flex gap-4">
              <span
                aria-hidden="true"
                className={`rounded-input border-tb-border size-14 shrink-0 border ${token.swatch}`}
              />
              <span className="min-w-0">
                <span className="text-tb-text block font-mono text-[0.8125rem]">{token.name}</span>
                <span className="type-caption text-tb-muted block">{token.hex}</span>
                <span className="type-caption text-tb-muted mt-1 block">{token.note}</span>
              </span>
            </Card>
          ))}
        </div>

        <Card className="border-l-tb-green mt-6 border-l-4">
          <h3 className="type-h3">The two rules broken most often</h3>
          <ul className="type-body text-tb-muted mt-4 space-y-2">
            <li>
              Green text on a light background is{" "}
              <strong className="text-tb-green-deep">--tb-green-deep</strong>, never --tb-green.
              #21B24B on cream is about 2.6:1 and fails AA.
            </li>
            <li>
              The label on a green fill is <strong className="text-tb-text">--tb-ink</strong>, never
              white.
            </li>
          </ul>
        </Card>
      </Section>

      {/* ------------------------------------------------------ typography */}
      <Section variant="tint" aria-labelledby="typography">
        <Heading level={2} id="typography" eyebrow="Tokens">
          Typography
        </Heading>

        <div className="mt-10 space-y-8">
          {TYPE_SCALE.map((item) => (
            <div key={item.cls} className="border-tb-border border-b pb-8 last:border-b-0">
              <p className="type-caption text-tb-muted">
                .{item.cls} <span className="ml-2">{item.spec}</span>
              </p>
              <p className={`${item.cls} text-tb-text mt-3`}>
                Phone and computer repairs in Calgary
              </p>
            </div>
          ))}

          <div>
            <p className="type-caption text-tb-muted">.tabular, used in every price column</p>
            <p className="tabular mt-2 text-2xl font-medium">
              Free quote Â· Free quote Â· Free quote Â· Free quote
            </p>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------- radius, shadow, motion */}
      <Section aria-labelledby="surfaces">
        <Heading level={2} id="surfaces" eyebrow="Tokens">
          Radius, shadow and motion
        </Heading>

        <div className="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {RADII.map((radius) => (
            <div key={radius.name}>
              <div className={`border-tb-border bg-tb-white h-24 border ${radius.cls}`} />
              <p className="type-caption text-tb-text mt-2">{radius.name}</p>
              <p className="type-caption text-tb-muted">{radius.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {SHADOWS.map((shadow) => (
            <div key={shadow.name}>
              <div className={`rounded-card bg-tb-white h-24 ${shadow.cls}`} />
              <p className="type-caption text-tb-text mt-2">{shadow.name}</p>
              <p className="type-caption text-tb-muted">{shadow.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <Reveal key={index} index={index}>
              <Card>
                <h3 className="type-h3">Reveal, stagger {index * 60}ms</h3>
                <p className="type-body text-tb-muted mt-2">
                  Fade in and rise 16px over 500ms. Scroll away and back to replay. Disabled under
                  prefers-reduced-motion.
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------- buttons */}
      <Section variant="tint" aria-labelledby="buttons">
        <Heading level={2} id="buttons" eyebrow="Primitives">
          Buttons and chips
        </Heading>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <PillButton href="/contact">Primary</PillButton>
          <PillButton href="/services" variant="ghost">
            Ghost
          </PillButton>
          <PillButton href="/contact" variant="dark">
            Dark
          </PillButton>
          <PillButton href="/faq" size="sm">
            Small
          </PillButton>
          <PillButton href={TEL_HREF} variant="ghost" withArrow={false}>
            Call {SITE.phone}
          </PillButton>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Chip>Step 1</Chip>
          <Chip variant="solid">Open now</Chip>
          <Chip variant="dark">On dark</Chip>
        </div>

        <div data-surface="dark" className="rounded-panel bg-tb-ink mt-10 p-8">
          <Eyebrow className="mb-5">On dark</Eyebrow>
          <div className="flex flex-wrap items-center gap-3">
            <PillButton href="/contact">Primary</PillButton>
            <PillButton href="/services" variant="ghostOnDark">
              Ghost on dark
            </PillButton>
          </div>
        </div>
      </Section>

      {/* -------------------------------------------------------- answerbox */}
      <Section aria-labelledby="answerbox">
        <Heading
          level={2}
          id="answerbox"
          eyebrow="Blocks"
          lead="Sits directly under the H1 on every substantive page. A 40 to 60 word answer that stands alone and names the entity, then three to five numbered facts, then the last-updated date."
        >
          AnswerBox
        </Heading>

        <AnswerBox
          className="mt-10"
          answer="TechBrotherz in Calgary charges Free quote to replace an iPhone 8 Plus screen, and that price includes the part and the labour. Most screen replacements take about 30 minutes while you wait, no appointment is needed, and every repair is covered by a 60-day warranty."
          keyFacts={[
            { label: "Price", value: "Free quote CAD, part and labour included" },
            { label: "Time", value: "About 30 minutes, while you wait" },
            { label: "Warranty", value: "60 days on the part and the workmanship" },
            { label: "Appointment", value: "Not needed, walk in any day we are open" },
            { label: "Location", value: `${SITE.street}, ${SITE.city}, ${SITE.region}` },
          ]}
          lastUpdated="2026-07-30"
        />
      </Section>

      {/* ------------------------------------------------------ trust strip */}
      <Section variant="tint" aria-labelledby="trust">
        <Heading
          level={2}
          id="trust"
          eyebrow="Blocks"
          lead="The honest replacement for the reference template's fake rating badge and logo cloud. Only facts the store can stand behind."
        >
          TrustStrip
        </Heading>
        <TrustStrip className="mt-10" />
      </Section>

      {/* ------------------------------------------------------------ cards */}
      <Section aria-labelledby="cards">
        <Heading level={2} id="cards" eyebrow="Blocks">
          Cards
        </Heading>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <IconCard
            icon={DoorOpen}
            title="Walk in"
            description="No appointment and no booking system. Come in during opening hours and we start straight away."
            link={{ label: "Walk-in repairs in Calgary", href: "/walk-in-phone-repair-calgary" }}
          />
          <IconCard
            icon={Clock}
            title="Fast turnaround"
            description="Most phone screen and battery repairs are finished in about 30 minutes while you wait."
          />
          <IconCard
            icon={Wrench}
            title="Transparent pricing"
            description="Every price on this site includes the part and the labour. No diagnostic fee on phone repairs."
          />
          <IconCard
            icon={ShieldCheck}
            title="60-day warranty"
            description="Every repair is covered for 60 days on both the part we fit and the work we do."
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <StepCard
            step={1}
            title="Walk in or call"
            description="Bring the device to 3317 17 Ave SE, or call ahead on (403) 273-8324 to check the part is in stock."
          />
          <StepCard
            step={2}
            title="We diagnose and quote"
            description="We test the device and give you the exact price before any work starts. Diagnostics on computers are Free quote."
          />
          <StepCard
            step={3}
            title="Repair and 60-day warranty"
            description="Most repairs are done in about 30 minutes. You leave with a 60-day warranty on the part and the work."
          />
        </div>
      </Section>

      {/* ------------------------------------------------------ split block */}
      <Section variant="tint" aria-labelledby="split">
        <Heading level={2} id="split" eyebrow="Blocks">
          SplitBlock
        </Heading>

        <SplitBlock
          className="mt-12"
          eyebrow="For individuals"
          heading="One device, fixed while you wait"
          lead="Bring a cracked phone, a slow laptop or a tablet that will not charge to our Calgary store and leave with it working."
          checklist={[
            "Most phone repairs finished in about 30 minutes",
            "Every price includes the part and the labour",
            "60-day warranty on the part and the workmanship",
          ]}
          cta={{ label: "Ask for a quote", href: "/contact" }}
        />

        <SplitBlock
          className="mt-20"
          reverse
          eyebrow="For businesses"
          heading="Fleets of laptops and phones, kept working"
          lead="Small businesses across southeast Calgary use TechBrotherz for repairs, Windows installs and clean-ups on staff devices."
          checklist={[
            "Windows installation at Free quote including Office and security",
            "Desktop clean-up and tune-up at Free quote per machine",
            "Walk in with several devices, no appointment needed",
          ]}
          cta={{ label: "Talk to us about business repairs", href: "/contact" }}
        />
      </Section>

      {/* ------------------------------------------------------ price table */}
      <Section aria-labelledby="tables">
        <Heading
          level={2}
          id="tables"
          eyebrow="Blocks"
          lead="Real table markup with a caption and scoped headers. Never a grid of divs. Answer engines extract tables well and a div grid is invisible to them."
        >
          PriceTable
        </Heading>


        <h3 className="type-h3 mt-16">ModelGrid</h3>
        <ModelGrid className="mt-6" items={SAMPLE_MODELS} />
      </Section>

      {/* -------------------------------------------------------------- faq */}
      <Section variant="tint" aria-labelledby="faq">
        <Heading
          level={2}
          id="faq"
          eyebrow="Blocks"
          lead="First item closed by default so the page gives no arbitrary emphasis. Every answer stays in the rendered HTML whether or not the item is expanded."
        >
          FaqAccordion
        </Heading>

        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          <FaqAccordion className="lg:col-span-8" items={SAMPLE_FAQS} />

          <RelatedLinks
            className="lg:col-span-4"
            title="Other iPhone models we repair"
            links={[
              { label: "iPhone 8 screen replacement", href: "/repair/apple-iphone/iphone-8" },
              {
                label: "iPhone 7 Plus screen replacement",
                href: "/repair/apple-iphone/iphone-7-plus",
              },
              { label: "iPhone 6S screen replacement", href: "/repair/apple-iphone/iphone-6s" },
              { label: "All iPhone repair", href: "/repair/apple-iphone" },
            ]}
          />
        </div>
      </Section>

      {/* ------------------------------------------------------------ local */}
      <Section aria-labelledby="local">
        <Heading level={2} id="local" eyebrow="Blocks">
          LocalInfoCard
        </Heading>
        <LocalInfoCard className="mt-10" />
      </Section>

      {/* ------------------------------------------------------------- dark */}
      <Section variant="dark" aria-labelledby="dark">
        <Heading
          level={2}
          id="dark"
          eyebrow="Surfaces"
          align="centre"
          lead="Dark sections set data-surface=dark, so components restyle through the on-dark: variant instead of prop drilling and stay server components."
        >
          On a dark chapter break
        </Heading>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <Card>
            <h3 className="type-h3">Cards drop their border</h3>
            <p className="type-body text-tb-muted mt-3">
              On dark, cards use a pure white fill with no border and no shadow. The contrast does
              the work.
            </p>
          </Card>
          <Card>
            <h3 className="type-h3">Focus rings brighten</h3>
            <p className="type-body text-tb-muted mt-3">
              The focus ring switches from --tb-green-deep to --tb-green so it stays visible against
              near-black.
            </p>
          </Card>
          <Card>
            <h3 className="type-h3">Padding grows 16px</h3>
            <p className="type-body text-tb-muted mt-3">
              Dark sections carry extra vertical padding at every breakpoint so a chapter break
              reads heavier than the section above it.
            </p>
          </Card>
        </div>

        <TrustStrip className="mt-14" />

        <div className="mt-14 flex flex-wrap justify-center gap-3">
          <PillButton href="/contact">Ask for a quote</PillButton>
          <PillButton href={TEL_HREF} variant="ghostOnDark" withArrow={false}>
            Call {SITE.phone}
          </PillButton>
        </div>
      </Section>
    </>
  );
}
