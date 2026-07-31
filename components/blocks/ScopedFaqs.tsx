import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

import { FaqAccordion } from "@/components/blocks/FaqAccordion";
import { Heading } from "@/components/primitives/Heading";
import { Section } from "@/components/primitives/Section";
import type { ComposedFaqs } from "@/lib/faq/scoping";

export interface ScopedFaqsProps {
  /** The result of composeFaqs(), which has already enforced the scoping rule. */
  faqs: ComposedFaqs;
  /** H2, phrased for this page. Never the bare word "FAQ". */
  heading: string;
  id: string;
  variant?: "light" | "tint";
  /** Optional sidebar, used on the home page to carry outbound links. */
  aside?: ReactNode;
  lead?: string;
}

/**
 * The FAQ block, in the only two shapes the scoping rule allows.
 *
 * Page-specific questions render in full and are the only ones in this page's
 * FAQPage JSON-LD. Global questions render as a question, one line, and a link
 * to the canonical answer on /faq, so the full text exists on exactly one URL.
 * See lib/faq/scoping.ts for why.
 */
export function ScopedFaqs({ faqs, heading, id, variant = "tint", aside, lead }: ScopedFaqsProps) {
  if (faqs.pageSpecific.length === 0 && faqs.globalLinks.length === 0) return null;

  return (
    <Section variant={variant} aria-labelledby={id}>
      <Heading level={2} id={id} eyebrow="Questions" lead={lead}>
        {heading}
      </Heading>

      <div className={aside ? "mt-10 grid gap-6 lg:grid-cols-12" : undefined}>
        <div className={aside ? "lg:col-span-8" : undefined}>
          {faqs.pageSpecific.length > 0 && (
            <FaqAccordion
              className={aside ? undefined : "mt-10"}
              items={faqs.pageSpecific.map((faq) => ({
                question: faq.question,
                answer: <p className="type-body text-tb-muted">{faq.answer}</p>,
              }))}
            />
          )}

          {faqs.globalLinks.length > 0 && (
            <div className="mt-8">
              <h3 className="type-eyebrow text-tb-muted">Answered across the whole site</h3>
              <ul className="divide-tb-border border-tb-border mt-3 divide-y border-t">
                {faqs.globalLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group text-tb-text hover:text-tb-green-deep flex items-start justify-between gap-4 py-4"
                    >
                      <span>
                        <span className="block group-hover:underline">{link.question}</span>
                        <span className="type-small text-tb-muted mt-1 block">{link.teaser}</span>
                      </span>
                      <ArrowUpRight
                        aria-hidden="true"
                        size={16}
                        strokeWidth={1.5}
                        className="text-tb-muted group-hover:text-tb-green-deep mt-1 shrink-0 transition-colors duration-[180ms] ease-out"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {aside ? <div className="lg:col-span-4">{aside}</div> : null}
      </div>
    </Section>
  );
}
