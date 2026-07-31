import { defineQuery } from "next-sanity";

/**
 * The business facts. Every page reads these, so they are tagged "global" and
 * one edit in the Studio revalidates the whole site.
 */
export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    _id,
    _updatedAt,
    brandName,
    legalName,
    tagline,
    street,
    city,
    region,
    regionCode,
    postalCode,
    country,
    geo,
    phone,
    phoneRaw,
    email,
    googleMapsUrl,
    googleBusinessUrl,
    socialLinks,
    hours,
    warrantyDays,
    appointmentPolicy,
    typicalWaitMinutes,
    priceDisclaimer,
    paymentAccepted,
    foundedYear,
    defaultOgImage,
    gaId,
    gscVerification,
    announcementBar
  }
`);

export const NAVIGATION_QUERY = defineQuery(`
  *[_type == "navigation"][0]{
    header[]{ label, href },
    footerColumns[]{ heading, links[]{ label, href } }
  }
`);

/**
 * Dormant until the client supplies real Google review data. The consumer must
 * check `enabled` before emitting any AggregateRating structured data.
 */
export const REVIEW_SUMMARY_QUERY = defineQuery(`
  *[_type == "reviewSummary"][0]{
    enabled,
    ratingValue,
    reviewCount,
    source,
    sourceUrl,
    lastVerified
  }
`);

export const REDIRECTS_QUERY = defineQuery(`
  *[_type == "redirect"]{ from, to, permanent }
`);
