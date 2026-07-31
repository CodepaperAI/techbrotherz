import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

import { cn } from "@/lib/utils";

/**
 * Renders portable text from Sanity.
 *
 * Headings are H2 and H3 only, matching the editor's restricted style list, so
 * the "every H2 is a real question" rule cannot be broken by an editor picking
 * an H1. Links to other pages on the site render as Next links, and external
 * links get rel="noopener" as required for the cited-source rule.
 * CLAUDE.md Sections 8.3 and 8.4.
 */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="type-body measure text-tb-muted">{children}</p>,
    h2: ({ children }) => <h2 className="type-h2 text-tb-text mt-12">{children}</h2>,
    h3: ({ children }) => <h3 className="type-h3 text-tb-text mt-8">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="type-lead measure border-tb-green text-tb-text border-l-4 pl-5">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="type-body measure text-tb-muted list-disc space-y-2 pl-5">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="type-body measure text-tb-muted list-decimal space-y-2 pl-5">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="text-tb-text font-medium">{children}</strong>,
    link: ({ children, value }) => {
      const href = String(value?.href ?? "");
      const isInternal = href.startsWith("/") && !href.startsWith("//");

      if (isInternal) {
        return (
          <Link href={href} className="text-tb-green-deep underline-offset-2 hover:underline">
            {children}
          </Link>
        );
      }

      return (
        <a
          href={href}
          rel="noopener"
          target="_blank"
          className="text-tb-green-deep underline-offset-2 hover:underline"
        >
          {children}
        </a>
      );
    },
  },
};

export interface RichTextProps {
  value: PortableTextBlock[] | null | undefined;
  className?: string;
}

export function RichText({ value, className }: RichTextProps) {
  if (!value?.length) return null;

  return (
    <div className={cn("space-y-4", className)}>
      <PortableText value={value} components={components} />
    </div>
  );
}
