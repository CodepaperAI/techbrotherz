/**
 * The canonical origin of the site.
 *
 * This used to be `NEXT_PUBLIC_SITE_URL` with no default, guarded by
 * `lib/env-assert.ts`, which threw on a production build without it. The guard
 * existed because the fallback was `http://localhost:3000`, and a build that
 * quietly used it emitted localhost as the canonical of every page and as the
 * `@id` of every JSON-LD node: a site that renders perfectly and is
 * uncrawlable. That shipped once, on the first Vercel deploy in Phase 5, and
 * was caught by reading the deployed HTML rather than by anything failing.
 *
 * The variable is gone because the site has exactly one canonical origin and
 * always did. Configuring a constant through the hosting provider bought no
 * flexibility, and cost a build failure on every new project that had not been
 * told the value. **The protection it provided is kept, and strengthened: the
 * fallback is now the real domain rather than localhost, so the failure the
 * guard was written to catch cannot occur at all.**
 *
 * `NEXT_PUBLIC_SITE_URL` still overrides when it is set, which is how the local
 * audits point the whole site at `http://localhost:3100`. It is optional
 * everywhere, and nothing needs it in production.
 *
 * **It is the www host, because that is the host Vercel serves.** The apex
 * 308s to www at the edge. Until 2026-10 this constant named the apex, so the
 * live host was not the canonical one, and middleware.ts treated production as
 * staging: noindex on every page and a disallow-all robots.txt, found by an
 * outside SEO audit rather than by anything here. If the primary domain is
 * ever flipped to the apex in Vercel, change this line to match; middleware
 * keeps both hosts indexable either way, so the flip cannot noindex the site.
 */
export const CANONICAL_ORIGIN = "https://www.techbrotherz.com";

/** The canonical origin, no trailing slash. Override with NEXT_PUBLIC_SITE_URL. */
export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || CANONICAL_ORIGIN;
  return raw.replace(/\/$/, "");
}
