import { cn } from "@/lib/utils";

/**
 * The "why us" pattern: a large green numeral, a bold heading, two lines of body.
 *
 * Vertical, with a hairline between items. The numeral is the whole design: at
 * 64px in --tb-green it gives the section a strong left column and turns four
 * claims into a sequence rather than a grid of equal boxes. A grid says "here
 * are four features"; a numbered list says "here is the case, in order".
 */
export interface NumberedItem {
  title: string;
  body: string;
}

export function NumberedList({
  items,
  className,
}: {
  items: readonly NumberedItem[];
  className?: string;
}) {
  return (
    <ol className={cn("border-tb-rule on-dark:border-tb-rule-dark border-t", className)}>
      {items.map((item, index) => (
        <li
          key={item.title}
          className="border-tb-rule on-dark:border-tb-rule-dark flex gap-6 border-b py-7 md:gap-10 md:py-8"
        >
          <span aria-hidden="true" className="type-numeral text-tb-green w-16 shrink-0 md:w-24">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0">
            <h3 className="type-h3 text-tb-ink on-dark:text-tb-on-black">{item.title}</h3>
            <p className="type-body text-tb-ink-2 on-dark:text-tb-on-black-2 measure mt-2">
              {item.body}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
