import { defineQuery } from "next-sanity";

import { LIVE } from "./fragments";

/**
 * Every published URL with its last-modified date, for app/sitemap.ts and the
 * HTML sitemap at /sitemap. Documents flagged noIndex are excluded, so the two
 * signals can never contradict each other.
 *
 * Phase 8 consumes this. It lives here now so the sitemap can never drift from
 * what the Studio has actually published.
 */
export const ALL_SLUGS_FOR_SITEMAP_QUERY = defineQuery(`{
  "brands": *[_type == "brand" && ${LIVE} && active == true && noIndex != true]{
    "slug": slug.current, _updatedAt
  },
  "models": *[_type == "deviceModel" && ${LIVE} && noIndex != true]{
    "slug": slug.current,
    "brandSlug": brand->slug.current,
    _updatedAt
  },
  "servicePages": *[_type == "servicePage" && ${LIVE} && noIndex != true]{
    "slug": slug.current,
    "parentSlug": parentService->slug.current,
    _updatedAt
  },
  "guides": *[_type == "guide" && ${LIVE} && noIndex != true]{
    "slug": slug.current, _updatedAt
  },
  "locations": *[_type == "location" && ${LIVE} && noIndex != true]{
    "slug": slug.current,
    kind,
    "parentSlug": parent->slug.current,
    _updatedAt
  }
}`);

/** Used by generateStaticParams on the programmatic routes in Phase 4. */
export const MODEL_PARAMS_QUERY = defineQuery(`
  *[_type == "deviceModel" && ${LIVE}]{
    "slug": slug.current,
    "brandSlug": brand->slug.current
  }
`);

export const BRAND_PARAMS_QUERY = defineQuery(`
  *[_type == "brand" && ${LIVE} && active == true]{ "slug": slug.current }
`);
