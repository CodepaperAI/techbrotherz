import { cn } from "@/lib/utils";

export interface ArticleBodyProps {
  /** Sanitised HTML from lib/uplift/render.ts. Never a raw API string. */
  html: string;
  className?: string;
}

/**
 * The body of a blog article.
 *
 * The HTML comes from the Uplift CMS, so it carries no component classes and
 * is styled from the outside by `.article-prose` in globals.css. It has already
 * been through the allowlist in lib/uplift/render.ts, which is the only reason
 * this render call is safe to write: no script, no style, no iframe, no
 * javascript: URL, and every external link carries rel="noopener nofollow".
 *
 * Wide tables are already wrapped in their own scroll container by
 * wrapTables() in the same module, so a comparison table never scrolls the
 * page body sideways.
 */
export function ArticleBody({ html, className }: ArticleBodyProps) {
  if (!html) return null;

  return (
    <div
      className={cn("article-prose", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
