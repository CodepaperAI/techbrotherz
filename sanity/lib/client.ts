import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, readToken } from "../env";

/**
 * Published-content client, served from the CDN.
 *
 * It carries the read token. This Sanity project rejects anonymous reads even
 * though the dataset ACL says public, so an unauthenticated client returns
 * empty results for every query rather than an error, which is a silent and
 * very confusing failure mode.
 *
 * The token is safe here because every read goes through sanity/lib/fetch.ts,
 * which is marked "server-only", so this module is never bundled for the
 * browser. The perspective is pinned to "published", so even with a token this
 * client cannot return draft content.
 *
 * SANITY_API_READ_TOKEN must therefore be set in the hosting environment, not
 * just locally. See README and CLAUDE.md Section 11.
 *
 * useCdn is false on purpose. Next already caches the rendered page for an hour
 * and revalidates it on demand from the Sanity webhook, so Sanity's own CDN
 * adds no meaningful caching here, it only delays freshness: its cache holds
 * for up to a minute, which means a price edit can take that long to appear
 * even after the webhook has fired. Measured, not assumed.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
  ...(readToken ? { token: readToken } : {}),
});

/**
 * Preview client. Reads drafts, so it is token-authenticated, bypasses the CDN
 * and must only ever be used inside Next draft mode.
 */
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "previewDrafts",
  token: readToken,
  ignoreBrowserTokenWarning: true,
});

/** Write client for the seed script. Never imported by application code. */
export function createWriteClient(token: string) {
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    perspective: "raw",
    token,
  });
}
