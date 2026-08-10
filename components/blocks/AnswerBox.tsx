import { cn } from "@/lib/utils";

export interface KeyFact {
  /** A short label, e.g. "Price", "Time", "Warranty". */
  label: string;
  /** A fact with a number in it. Never an adjective. */
  value: string;
}

export interface AnswerBoxProps {
  /**
   * A 40 to 60 word direct answer that fully answers the page's core question
   * on its own and names the entity, e.g. "TechBrotherz in Calgary charges ...".
   */
  answer: string;
  /** 3 to 5 facts: price or range, time, warranty, appointment policy, location. */
  keyFacts: KeyFact[];
  /** Bound to the Sanity `_updatedAt` of the document driving this page. */
  lastUpdated?: string | Date | null;
  className?: string;
}

const UPDATED_FORMAT = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "America/Edmonton",
});

/**
 * The single most important AEO component. Sits directly under the H1 on every
 * substantive page. CLAUDE.md Section 8.3, DESIGN.md Section 6.14.
 *
 * The answer paragraph carries data-speakable="answer" so the `speakable`
 * JSON-LD selector can point at it.
 */
export function AnswerBox({ answer, keyFacts, lastUpdated, className }: AnswerBoxProps) {
  if (process.env.NODE_ENV !== "production") {
    const words = answer.trim().split(/\s+/).length;
    if (words < 40 || words > 60) {
      console.warn(
        `[AnswerBox] Answer is ${words} words. The spec is 40 to 60 words so answer engines can quote it whole. See CLAUDE.md Section 8.3.\n"${answer.slice(0, 80)}..."`,
      );
    }
    if (keyFacts.length < 3 || keyFacts.length > 5) {
      console.warn(`[AnswerBox] ${keyFacts.length} key facts supplied. The spec is 3 to 5.`);
    }
  }

  const updatedDate = lastUpdated ? new Date(lastUpdated) : null;
  const updatedValid = updatedDate && !Number.isNaN(updatedDate.getTime()) ? updatedDate : null;

  return (
    <div
      className={cn(
        "rounded-card border-tb-green bg-tb-white border-tb-rule border-y border-r border-l-4 p-6 md:p-8",
        className,
      )}
    >
      <p data-speakable="answer" className="type-lead measure text-tb-text font-bold">
        {answer}
      </p>

      {/* A paragraph, not a heading. Every H2 on the page is a real question,
          so this label stays out of the heading outline. CLAUDE.md 8.3. */}
      <div className="mt-6">
        <p id="answerbox-key-facts" className="type-eyebrow text-tb-green-deep">
          Key facts
        </p>
        <ul aria-labelledby="answerbox-key-facts" className="mt-3 space-y-2">
          {keyFacts.map((fact) => (
            <li key={fact.label} className="type-body text-tb-text flex gap-2">
              <span
                aria-hidden="true"
                className="bg-tb-green mt-2.5 size-1.5 shrink-0 rounded-full"
              />
              <span>
                <span className="font-medium">{fact.label}:</span> {fact.value}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {updatedValid ? (
        <p className="type-caption text-tb-muted mt-6">
          Last updated{" "}
          <time dateTime={updatedValid.toISOString()}>{UPDATED_FORMAT.format(updatedValid)}</time>
        </p>
      ) : null}
    </div>
  );
}
