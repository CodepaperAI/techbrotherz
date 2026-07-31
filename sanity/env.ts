/**
 * Validated Sanity environment access.
 *
 * Throwing here rather than letting `undefined` reach the client gives a clear
 * failure at boot instead of an opaque 401 from the API later.
 */

function required(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Copy .env.example to .env.local and fill it in. See CLAUDE.md Section 11.`,
    );
  }
  return value;
}

export const projectId = required(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
);

export const dataset = required(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "NEXT_PUBLIC_SANITY_DATASET",
);

export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-10-01";

/**
 * Server-only. Used by the preview client and never bundled for the browser.
 * Absent in a plain production render, which is correct: published content
 * needs no token.
 */
export const readToken = process.env.SANITY_API_READ_TOKEN ?? "";

/** How long a content page stays cached before ISR refetches. */
export const REVALIDATE_SECONDS = 3600;
