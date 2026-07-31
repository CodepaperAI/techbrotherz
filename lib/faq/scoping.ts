/**
 * The FAQ scoping rule, as enforced code rather than a convention.
 *
 * Phase 4 found that eight shared FAQ answers made up roughly half the body
 * text of every model page, and that cutting to four moved the median
 * similarity between model pages from 52.9% to 12.8%. The lesson generalises:
 * any block repeated across many pages is a duplication engine, and the same
 * question and answer pair sitting in FAQPage structured data on 90 URLs is
 * worse than useless, because it asks Google to pick a canonical answer from
 * 90 identical candidates.
 *
 * The rule, applied site-wide:
 *
 *   1. A page's FAQ block is at most 6 questions.
 *   2. At least half must be unique to that page.
 *   3. Global questions live on /faq. A page may reuse at most 2, and shows
 *      the question with a one-line answer and a link, not the full text.
 *   4. FAQPage JSON-LD covers the page-specific questions only. The same
 *      question and answer pair never appears in structured data twice.
 *
 * Violations throw at render time, which fails the build. A rule that only
 * lives in a document is a rule that gets broken by the next page.
 */

import { faqPage, type JsonLdNode } from "@/lib/seo/schema";
import { slugify } from "@/lib/utils";

export const MAX_FAQS_PER_PAGE = 6;
export const MAX_GLOBAL_REUSE = 2;

/** A question written for one URL and answered with that page's own facts. */
export interface PageFaq {
  question: string;
  /**
   * Plain text. This is what goes in the FAQPage JSON-LD, so it has to stand
   * alone: name the entity, carry the number, no "as mentioned above".
   */
  answer: string;
}

/** The shape the site-wide FAQ documents arrive in from Sanity. */
export interface GlobalFaqSource {
  question?: string | null;
  plainAnswer?: string | null;
  category?: string | null;
}

/** A global question shown as a pointer, never as a second full copy. */
export interface GlobalFaqLink {
  question: string;
  /** One line. The full answer stays on /faq. */
  teaser: string;
  href: string;
}

export interface ComposedFaqs {
  /** Page-specific entries, rendered in full. */
  pageSpecific: PageFaq[];
  /** Global entries, rendered as a question, one line, and a link to /faq. */
  globalLinks: GlobalFaqLink[];
  /** FAQPage covering the page-specific questions only. Null when there are none. */
  schema: JsonLdNode | null;
}

/**
 * The stable anchor a global question has on /faq. Derived from the question
 * text so the two ends cannot drift apart without the link test catching it.
 */
export function faqAnchor(question: string): string {
  return slugify(question).slice(0, 60);
}

/**
 * First sentence of the canonical answer, used as the one-line teaser.
 *
 * Deriving this rather than authoring it is deliberate: a hand-written teaser
 * is a second copy of the answer that can drift from the canonical one on
 * /faq, which is the exact problem this module exists to prevent.
 */
function firstSentence(text: string): string {
  const trimmed = text.trim();
  const match = /^(.+?[.!?])(\s|$)/.exec(trimmed);
  const sentence = match?.[1] ?? trimmed;
  return sentence.length > 180 ? `${sentence.slice(0, 177).trimEnd()}...` : sentence;
}

/**
 * Turns Sanity FAQ documents into pointer-shaped links.
 *
 * Pass the categories this page can legitimately borrow from and the number to
 * take. Anything beyond MAX_GLOBAL_REUSE is refused rather than silently
 * truncated, so the caller has to make the choice explicitly.
 */
export function globalLinks(
  faqs: GlobalFaqSource[],
  categories: string[],
  take: number = MAX_GLOBAL_REUSE,
): GlobalFaqLink[] {
  if (take > MAX_GLOBAL_REUSE) {
    throw new Error(
      `FAQ scoping: asked for ${take} global questions, the limit is ${MAX_GLOBAL_REUSE}. ` +
        `Write page-specific questions instead of borrowing more.`,
    );
  }

  return faqs
    .filter((faq) => categories.includes(faq.category ?? "") && faq.question && faq.plainAnswer)
    .slice(0, take)
    .map((faq) => ({
      question: faq.question as string,
      teaser: firstSentence(faq.plainAnswer as string),
      href: `/faq#${faqAnchor(faq.question as string)}`,
    }));
}

/**
 * Applies the rule and builds the structured data.
 *
 * `path` is only used for the FAQPage @id, but requiring it means a page
 * cannot accidentally emit another page's FAQ graph.
 */
export function composeFaqs(input: {
  path: string;
  pageSpecific: PageFaq[];
  globalLinks?: GlobalFaqLink[];
}): ComposedFaqs {
  const pageSpecific = input.pageSpecific;
  const links = input.globalLinks ?? [];
  const total = pageSpecific.length + links.length;

  if (total > MAX_FAQS_PER_PAGE) {
    throw new Error(
      `FAQ scoping violated on ${input.path}: ${total} questions, the limit is ${MAX_FAQS_PER_PAGE}. ` +
        `Phase 4 showed that a long shared FAQ block is what makes templated pages read as duplicates.`,
    );
  }

  if (links.length > MAX_GLOBAL_REUSE) {
    throw new Error(
      `FAQ scoping violated on ${input.path}: ${links.length} global questions reused, ` +
        `the limit is ${MAX_GLOBAL_REUSE}.`,
    );
  }

  if (total > 0 && pageSpecific.length * 2 < total) {
    throw new Error(
      `FAQ scoping violated on ${input.path}: ${pageSpecific.length} of ${total} questions are ` +
        `page-specific, at least half must be. Write questions this page can answer with its own ` +
        `numbers rather than borrowing from /faq.`,
    );
  }

  const seen = new Set<string>();
  for (const faq of pageSpecific) {
    const key = faq.question.trim().toLowerCase();
    if (seen.has(key)) {
      throw new Error(`FAQ scoping violated on ${input.path}: "${faq.question}" appears twice.`);
    }
    seen.add(key);
  }

  return {
    pageSpecific,
    globalLinks: links,
    // Only the page-specific questions reach structured data. The global ones
    // are already in the FAQPage graph on /faq, and emitting them again here
    // is the duplication this module exists to stop.
    schema: faqPage(
      pageSpecific.map((faq) => ({ question: faq.question, plainAnswer: faq.answer })),
      input.path,
    ),
  };
}
