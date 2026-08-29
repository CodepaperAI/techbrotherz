/**
 * Date formatting for the blog, in one place so the index card and the article
 * header cannot disagree.
 *
 * Rendered on the server, in en-CA, with the time component pinned to midday
 * UTC when the payload carries a bare date. A bare "2026-07-15" parsed as UTC
 * midnight renders as the 14th anywhere west of Greenwich, which is every
 * visitor this site has. The same trick the rest of the site uses.
 */
export function formatArticleDate(iso: string): string {
  const value = /^\d{4}-\d{2}-\d{2}$/.test(iso) ? `${iso}T12:00:00Z` : iso;
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Edmonton",
  });
}
