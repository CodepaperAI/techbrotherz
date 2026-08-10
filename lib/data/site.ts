import { SITE_SETTINGS } from "@/content/data/site-settings";
import type { ReviewSummary } from "@/content/data/types";

/**
 * The business facts.
 *
 * CLAUDE.md Section 2 is the human-readable copy of this and lib/site.ts is the
 * typed fallback; all three must agree character for character, because NAP
 * consistency is what makes the entity resolve in Google's index and in the
 * answer engines.
 *
 * Fields the client has not supplied are absent rather than blank: no postal
 * code, no geo, no founding year, no payment methods. compact() drops absent
 * fields from the structured data, so nothing is invented to fill a shape.
 */
export async function getSiteSettings() {
  return SITE_SETTINGS;
}

/**
 * Navigation is lib/routes.ts, and always was.
 *
 * The `navigation` document type existed through six phases and never held a
 * document, because the route registry is what the header, footer, breadcrumbs
 * and link audit already read. Returning null keeps the Nav and Footer
 * fallbacks on the path they have always taken.
 */
export async function getNavigation(): Promise<null> {
  return null;
}

/**
 * Dormant until the client supplies real Google review data.
 *
 * `aggregateRating()` in lib/seo/schema.ts returns null unless this is enabled
 * and complete, so no AggregateRating is ever emitted. Do not fill this in with
 * an estimate: a fabricated rating is the single most damaging thing that could
 * be put on this site.
 */
export async function getReviewSummary(): Promise<ReviewSummary | null> {
  return null;
}

/**
 * Legacy URL redirects, pending client question 17.
 *
 * The current Wix site's URL list has not been supplied, so there is nothing to
 * map yet. When it arrives these become entries in next.config.ts.
 */
export async function getRedirects(): Promise<never[]> {
  return [];
}
