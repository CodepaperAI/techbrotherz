"use client";

import { useId, useState, type ReactNode } from "react";
import { Plus, X } from "lucide-react";

import { cn } from "@/lib/utils";

export interface FaqItem {
  question: string;
  /** Rich answer for display. The plain-text `plainAnswer` drives JSON-LD. */
  answer: ReactNode;
  /**
   * Stable anchor for this question, so a page elsewhere can link straight to
   * it. Pages that reuse a global question link to /faq#<id> rather than
   * repeating the answer. See lib/faq/scoping.ts.
   */
  anchorId?: string;
}

export interface FaqAccordionProps {
  items: FaqItem[];
  className?: string;
}

/**
 * Disclosure list of questions. First item closed by default, so the page gives
 * no arbitrary emphasis. DESIGN.md Section 6.13.
 *
 * The answer text is always present in the rendered HTML, whether or not the
 * item is expanded, so crawlers and answer engines read every answer.
 * The matching FAQPage JSON-LD is emitted by the page, built from the Sanity
 * `plainAnswer` field. CLAUDE.md Section 8.2.
 */
export function FaqAccordion({ items, className }: FaqAccordionProps) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <dl className={cn("space-y-3", className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const buttonId = `${baseId}-q-${index}`;
        const panelId = `${baseId}-a-${index}`;
        const Icon = isOpen ? X : Plus;

        return (
          <div
            key={item.question}
            id={item.anchorId}
            className="rounded-card border-tb-border bg-tb-white on-dark:border-transparent scroll-mt-28 border"
          >
            <dt>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="rounded-card flex w-full items-start justify-between gap-6 p-6 text-left"
              >
                <span className="type-h3 text-tb-text">{item.question}</span>
                <Icon
                  aria-hidden="true"
                  size={20}
                  strokeWidth={1.5}
                  className="text-tb-green-deep mt-1 shrink-0 transition-transform duration-[180ms] ease-out"
                />
              </button>
            </dt>

            <dd
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              data-accordion-panel=""
              hidden={!isOpen}
              className="px-6 pb-6"
            >
              <div className="type-body measure text-tb-muted">{item.answer}</div>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
