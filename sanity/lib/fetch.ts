import "server-only";

import { draftMode } from "next/headers";
import type { QueryParams } from "next-sanity";

import { assertServerEnv } from "@/lib/env-assert";
import { REVALIDATE_SECONDS, readToken } from "../env";
import { client, previewClient } from "./client";

// Runs at module load, so any page that reads from Sanity fails the build with
// a clear message rather than rendering empty. See lib/env-assert.ts.
assertServerEnv();

export interface SanityFetchOptions {
  query: string;
  params?: QueryParams;
  /**
   * Cache tags. Editing one document should revalidate only the pages that
   * show it, so tag by document type AND by slug. See tags() below and
   * CLAUDE.md Section on the revalidation tag strategy.
   */
  tags: string[];
  revalidate?: number | false;
}

/**
 * The single entry point for reading Sanity data.
 *
 * Inside Next draft mode it reads drafts through the token client and skips the
 * cache entirely. Otherwise it reads published content through the CDN client
 * with ISR and tag-based on-demand revalidation.
 */
export async function sanityFetch<T>({
  query,
  params,
  tags,
  revalidate = REVALIDATE_SECONDS,
}: SanityFetchOptions): Promise<T> {
  /**
   * generateStaticParams and generateSitemaps run outside a request scope,
   * where draftMode() throws. There is no draft cookie to read in that context
   * anyway, and prerendering must always use published content, so a failure
   * here means "not draft mode" rather than an error.
   */
  let isDraft = false;
  try {
    isDraft = (await draftMode()).isEnabled;
  } catch {
    isDraft = false;
  }

  /**
   * Every query relaxes its `published == true` filter when $draft is true, so
   * an editor previewing an unpublished page sees it while the live site never
   * does. Injected here so no query can forget to pass it.
   */
  const allParams = { ...(params ?? {}), draft: isDraft };

  if (isDraft) {
    if (!readToken) {
      throw new Error(
        "Draft mode is enabled but SANITY_API_READ_TOKEN is not set, so drafts cannot be read.",
      );
    }

    return previewClient.fetch<T>(query, allParams, { cache: "no-store" });
  }

  return client.fetch<T>(query, allParams, {
    next: { revalidate, tags },
  });
}

/* --------------------------------------------------------------- cache tags */

/**
 * Tag builders. Every tag a document can be reached by is derived here, so the
 * webhook in app/api/revalidate and the queries that read the data can never
 * drift apart.
 */
export const tags = {
  /** Everything of one type, e.g. "type:deviceModel". */
  type: (documentType: string) => `type:${documentType}`,
  /** One document by slug, e.g. "deviceModel:iphone-8-plus". */
  doc: (documentType: string, slug: string) => `${documentType}:${slug}`,
  /** Every page that lists a brand's models. */
  brand: (slug: string) => `brand:${slug}`,
  /** The full price list page and the home page price teaser. */
  prices: "prices",
  /** Site-wide chrome: settings and navigation. */
  global: "global",
  /** XML and HTML sitemaps. */
  sitemap: "sitemap",
} as const;
