import Image from "next/image";
import { type ReactNode } from "react";

import { AnswerBox, type KeyFact } from "@/components/blocks/AnswerBox";
import { Breadcrumbs } from "@/components/blocks/Breadcrumbs";
import { Container } from "@/components/primitives/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Heading } from "@/components/primitives/Heading";
import { Section } from "@/components/primitives/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbsFor } from "@/lib/routes";
import { breadcrumbs, buildGraph, type JsonLdNode } from "@/lib/seo/schema";

export interface PageShellProps {
  /** Registry path. Drives the breadcrumb trail and the BreadcrumbList node. */
  path: string;
  /** The page H1. Exactly one per page, and this is it. A node so a word can
   *  be highlighted (the hero sets the city in green); pass plain strings
   *  everywhere else. */
  title: ReactNode;
  eyebrow?: string;
  lead?: ReactNode;
  /** Overrides the final breadcrumb label when the H1 is too long for a trail. */
  crumbLabel?: string;
  answerBox: {
    answer: string;
    keyFacts: KeyFact[];
    lastUpdated?: string | Date | null;
  };
  /**
   * Schema nodes for this page. The BreadcrumbList is added automatically, so
   * pass the business, page and content nodes only.
   */
  schema: (JsonLdNode | null | undefined)[];
  /**
   * "hero" puts the H1 in the dark panel used on the home page, with the
   * AnswerBox directly beneath it. Everything else uses the standard two
   * column opening.
   */
  layout?: "default" | "hero";
  /** Hero layout only: the call to action buttons under the H1. */
  heroActions?: ReactNode;
  heroImage?: { src: string; alt: string; unoptimized?: boolean; blurDataURL?: string };
  /**
   * Hero layout only: content that straddles the hero's bottom edge, half in
   * the black and half in the light. The home page puts the stat cards here.
   * Static layout, so it costs nothing in CLS.
   */
  heroOverlap?: ReactNode;
  children: ReactNode;
}

/**
 * The opening of every substantive page: breadcrumbs, the single H1, the
 * AnswerBox directly beneath it, and the page's structured data.
 *
 * Composing them here is what makes it impossible to ship a page that has an
 * H1 but no AnswerBox, or a visible breadcrumb trail whose schema says
 * something different. CLAUDE.md Section 8.3.
 */
export function PageShell({
  path,
  title,
  eyebrow,
  lead,
  crumbLabel,
  answerBox,
  schema,
  layout = "default",
  heroActions,
  heroImage,
  heroOverlap,
  children,
}: PageShellProps) {
  const crumbs = breadcrumbsFor(path, crumbLabel);
  const graph = buildGraph([...schema, breadcrumbs(crumbs)]);

  const answer = (
    <AnswerBox
      answer={answerBox.answer}
      keyFacts={answerBox.keyFacts}
      lastUpdated={answerBox.lastUpdated}
    />
  );

  if (layout === "hero") {
    /*
     * Full-bleed black at --tb-black, reworked 2026-08. The previous hero was
     * a contained rounded panel at bg-tb-black/85 with a backdrop blur, which
     * rendered as mid grey over the cream page: 85% black over cream is grey
     * by arithmetic, not by accident. Solid token, edge to edge.
     */
    return (
      <>
        <JsonLd graph={graph} />

        <section data-surface="dark" className="bg-tb-black">
          <Container
            className={`pt-10 md:pt-12 ${heroOverlap ? "pb-24 md:pb-28" : "pb-12 md:pb-16"}`}
          >
            <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
              <div className="py-2 lg:col-span-7">
                {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}

                {/* Slightly under the type-h1 ceiling so the H1 holds two
                    lines in the seven-column hero. 40px -> 62px. */}
                <h1 className="type-h1 text-tb-on-black mt-5 [font-size:clamp(2.5rem,1.75rem+2.9vw,3.875rem)]">
                  {title}
                </h1>

                {lead ? <p className="type-lead measure text-tb-muted-dark mt-5">{lead}</p> : null}

                {heroActions ? (
                  <div className="mt-8 flex flex-wrap gap-3">{heroActions}</div>
                ) : null}
              </div>

              <div className="bg-tb-ink rounded-panel relative min-h-56 overflow-hidden lg:col-span-5 lg:min-h-[22rem]">
                {heroImage ? (
                  <Image
                    src={heroImage.src}
                    alt={heroImage.alt}
                    fill
                    priority
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                    {...(heroImage.blurDataURL
                      ? { placeholder: "blur" as const, blurDataURL: heroImage.blurDataURL }
                      : {})}
                    {...(heroImage.unoptimized ? { unoptimized: true } : {})}
                  />
                ) : null}
              </div>
            </div>
          </Container>
        </section>

        {/* The overlap row straddles the hero boundary: pulled up into the
            black by the negative margin, with the hero's extra bottom padding
            making room. Purely static layout, so CLS stays 0.000. */}
        {heroOverlap ? (
          <Container className="relative z-10 -mt-16 md:-mt-20">{heroOverlap}</Container>
        ) : null}

        <Section className="pt-10 md:pt-12 lg:pt-14">{answer}</Section>

        {children}
      </>
    );
  }

  return (
    <>
      <JsonLd graph={graph} />

      <Section className="pt-8 md:pt-12 lg:pt-14">
        {crumbs.length > 0 ? <Breadcrumbs items={crumbs} className="mb-8" /> : null}

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <Heading level={1} eyebrow={eyebrow} lead={lead}>
              {title}
            </Heading>
          </div>

          <div className="lg:col-span-5">{answer}</div>
        </div>
      </Section>

      {children}
    </>
  );
}
