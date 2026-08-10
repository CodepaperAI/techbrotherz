/**
 * The shape of the site's content.
 *
 * These were Sanity document types. They are now the types of the constants in
 * this directory, written by hand rather than generated, because there is no
 * schema to generate them from and no typegen step to keep in sync. That is the
 * point: one place to read, one place to edit.
 *
 * Two conventions survive the move, both deliberately:
 *
 *   `slug` stays an object with a `current` string. It is how every consumer
 *   already reads it, and flattening it would have been a rewrite of 17 pages
 *   to save one property access.
 *
 *   An absent field means the fact is not known. It never means blank. The
 *   client has not supplied a postal code, geo coordinates or a founding year,
 *   so those keys are missing from the constant, `compact()` drops them from
 *   the structured data, and no page invents them.
 */

import type { PortableTextBlock } from "@portabletext/types";

export interface Slug {
  current: string;
}

/* --------------------------------------------------------------- site */

export interface OpeningHours {
  _key?: string;
  day: string;
  open?: string;
  close?: string;
  closed?: boolean;
}

export interface SiteSettingsDoc {
  _id: string;
  _updatedAt: string;
  brandName: string;
  legalName?: string;
  tagline?: string;
  street: string;
  city: string;
  region: string;
  regionCode?: string;
  /** Unanswered client question 10. Absent until supplied, never guessed. */
  postalCode?: string;
  country: string;
  /**
   * Read from the client's own Google Maps listing URL, supplied 2026-08,
   * which is the source open question 12 anticipated. Feeds the
   * `GeoCoordinates` node on `LocalBusiness`.
   */
  geo?: { lat: number; lng: number };
  phone: string;
  phoneRaw: string;
  email?: string;
  googleMapsUrl?: string;
  /** The Google Maps listing with the reviews tab open. Supplied 2026-08. */
  googleReviewsUrl?: string;
  googleBusinessUrl?: string;
  socialLinks?: { platform: string; url: string }[];
  hours: OpeningHours[];
  warrantyDays: number;
  appointmentPolicy: string;
  typicalWaitMinutes: number;
  priceDisclaimer: string;
  /** Unanswered client question 14. */
  paymentAccepted?: string[];
  /** Unanswered client question 6. */
  foundedYear?: number;
  gaId?: string;
  gscVerification?: string;
  announcementBar?: { active: boolean; text: string; href?: string };
}

/* ---------------------------------------------------------- catalogue */

/**
 * One repair the shop offers on one model.
 *
 * `price` is optional and absent means quoted at the counter. That is the whole
 * of Rule 2: 531 documents existed only to record that a price did not exist,
 * and an optional field says the same thing without any of them.
 */
export interface ModelRepairEntry {
  _key?: string;
  repair: string;
  note?: string;
  needsVerification?: boolean;
  partGrade?: string;
  turnaroundMinutes?: number;
  warrantyDays?: number;
  inStock?: boolean;
}

export interface ModelDoc {
  _id: string;
  _updatedAt: string;
  name: string;
  slug: Slug;
  brandSlug: string;
  deviceType: string;
  releaseYear?: number;
  aliases?: string[];
  popular?: boolean;
  discontinued?: boolean;
  stillReceivesUpdates?: boolean;
  lastSupportedOs?: string;
  repairs?: ModelRepairEntry[];
  published?: boolean;
  noIndex?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface FlatServiceDoc {
  _id: string;
  _updatedAt: string;
  name: string;
  slug: Slug;
  category: string;
  description: string;
  includes?: string[];
  turnaroundMinutes?: number;
  needsVerification?: boolean;
  order: number;
  published?: boolean;
  noIndex?: boolean;
}

export interface UnlockingDoc {
  _id: string;
  _updatedAt: string;
  carrier: string;
  deviceType: string;
  turnaround?: string;
  notes?: string;
  order?: number;
  published?: boolean;
}

/* ------------------------------------------------------------ content */

export interface FaqDoc {
  _id: string;
  _updatedAt: string;
  question: string;
  /** Plain text, capped at 320 characters. FAQPage structured data reads this. */
  plainAnswer: string;
  answer?: PortableTextBlock[];
  category: string;
  featured?: boolean;
  order: number;
  published?: boolean;
}

/**
 * A real review, or nothing.
 *
 * `verified` cannot be true without a `sourceUrl`, and only verified entries are
 * ever returned. This array is empty and stays empty until the client supplies
 * real reviews. Never write a placeholder here.
 */
export interface TestimonialDoc {
  _id: string;
  name: string;
  rating: number;
  text: string;
  device?: string;
  source?: string;
  sourceUrl?: string;
  date?: string;
  verified?: boolean;
}

/**
 * A named technician or writer, for guide bylines and the about page.
 *
 * The array is empty. Client questions 6 and 7, the founding year and the
 * technician credentials, are unanswered, so /about makes no experience claim
 * and no Article schema names an author. The type exists so the pages that
 * would render one keep compiling, and so filling it in is data entry rather
 * than a code change. Only state what is true.
 */
export interface AuthorDoc {
  _id: string;
  name: string;
  slug?: Slug;
  role?: string;
  bio?: string;
  credentials?: string[];
  yearsExperience?: number;
}

/**
 * Real Google review data, supplied by the client and verified.
 *
 * Null until every field is present, because `aggregateRating()` emits nothing
 * unless `enabled` is true and the rating, count and source URL are all set.
 * A fabricated rating is the worst thing that could go on this site.
 */
export interface ReviewSummary {
  enabled: boolean;
  ratingValue?: number;
  reviewCount?: number;
  source?: string;
  sourceUrl?: string;
  lastVerified?: string;
}

/* ---------------------------------------------------------- locations */

export interface LocationDoc {
  _id: string;
  _updatedAt: string;
  city: string;
  slug: Slug;
  kind: string;
  province?: string;
  isPrimary?: boolean;
  order?: number;
  distanceKm?: number;
  driveTimeMinutes?: number;
  neighbourhoods?: string[];
  landmarks?: string[];
  routeDescription?: string;
  transitDescription?: string;
  commonRepairs?: string[];
  intro?: PortableTextBlock[];
  mapEmbedUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  noIndex?: boolean;
  published?: boolean;
  parent?: { _ref: string };
}
