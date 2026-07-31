import Image from "next/image";
import { type ReactNode } from "react";

import { AnswerBox, type KeyFact } from "@/components/blocks/AnswerBox";
import { Breadcrumbs } from "@/components/blocks/Breadcrumbs";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Heading } from "@/components/primitives/Heading";
import { Section } from "@/components/primitives/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbsFor } from "@/lib/routes";
import { breadcrumbs, buildGraph, type JsonLdNode } from "@/lib/seo/schema";

export interface PageShellProps {
  /** Registry path. Drives the breadcrumb trail and the BreadcrumbList node. */
  path: string;
  /** The page H1. Exactly one per page, and this is it. */
  title: string;
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
    return (
      <>
        <JsonLd graph={graph} />

        <Section className="pt-8 md:pt-12 lg:pt-14">
          <div className="grid items-stretch gap-6 lg:grid-cols-12">
            <div
              data-surface="dark"
              className="rounded-panel bg-tb-ink px-7 py-12 md:px-12 md:py-16 lg:col-span-7"
            >
              {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}

              <h1 className="type-h1 text-tb-white mt-5">{title}</h1>

              {lead ? <p className="type-lead measure text-tb-muted-dark mt-6">{lead}</p> : null}

              {heroActions ? <div className="mt-9 flex flex-wrap gap-3">{heroActions}</div> : null}
            </div>

            <div className="bg-tb-green-soft rounded-panel relative min-h-64 overflow-hidden lg:col-span-5">
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

          <div className="mt-6">{answer}</div>
        </Section>

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
