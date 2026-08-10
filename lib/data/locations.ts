import { LOCATION_DOCS } from "@/content/data/locations";
import type { LocationDoc } from "@/content/data/types";

/**
 * The eleven places the site describes.
 *
 * Two details here were lost in the Phase 6.9 move and both changed rendered
 * pages, so they are called out rather than left to be rediscovered:
 *
 *   The LIVE filter. Only Calgary and Forest Lawn are published. Dropping it
 *   put five unpublished neighbourhoods onto /locations and /contact.
 *
 *   The distance ordering. `order(coalesce(distanceKm, 999) asc)` puts places
 *   with no measured distance last; taking the first three in array order does
 *   something else entirely.
 */

function isLive(doc: { published?: boolean }): boolean {
  return doc.published === true;
}

function cmp(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

const LIVE_LOCATIONS = LOCATION_DOCS.filter(isLive);

const BY_ID = new Map(LOCATION_DOCS.map((doc) => [doc._id, doc]));

/** Replaces LOCATIONS_QUERY: `order(isPrimary desc, order asc, city asc)`. */
export async function getLocations() {
  return [...LIVE_LOCATIONS]
    .sort(
      (a, b) =>
        Number(b.isPrimary ?? false) - Number(a.isPrimary ?? false) ||
        (a.order ?? 0) - (b.order ?? 0) ||
        cmp(a.city, b.city),
    )
    .map((doc) => ({
      _id: doc._id,
      _updatedAt: doc._updatedAt,
      city: doc.city,
      slug: doc.slug.current,
      kind: doc.kind,
      province: doc.province ?? null,
      isPrimary: doc.isPrimary ?? null,
      distanceKm: doc.distanceKm ?? null,
      driveTimeMinutes: doc.driveTimeMinutes ?? null,
      neighbourhoods: doc.neighbourhoods ?? null,
      routeDescription: doc.routeDescription ?? null,
      transitDescription: doc.transitDescription ?? null,
      parentSlug: doc.parent ? (BY_ID.get(doc.parent._ref)?.slug.current ?? null) : null,
    }));
}

/** Replaces LOCATION_BY_SLUG_QUERY, including the parent and child joins. */
export async function getLocationBySlug(slug: string) {
  const doc = LIVE_LOCATIONS.find((entry) => entry.slug.current === slug);
  if (!doc) return null;

  const parent = doc.parent ? BY_ID.get(doc.parent._ref) : undefined;
  const children = LIVE_LOCATIONS.filter((entry) => entry.parent?._ref === doc._id).sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

  return {
    _id: doc._id,
    _updatedAt: doc._updatedAt,
    city: doc.city,
    slug: doc.slug.current,
    kind: doc.kind,
    province: doc.province ?? null,
    isPrimary: doc.isPrimary ?? null,
    neighbourhoods: doc.neighbourhoods ?? null,
    distanceKm: doc.distanceKm ?? null,
    driveTimeMinutes: doc.driveTimeMinutes ?? null,
    landmarks: doc.landmarks ?? null,
    routeDescription: doc.routeDescription ?? null,
    transitDescription: doc.transitDescription ?? null,
    commonRepairs: doc.commonRepairs ?? null,
    intro: doc.intro ?? null,
    mapEmbedUrl: doc.mapEmbedUrl ?? null,
    seoTitle: doc.seoTitle ?? null,
    seoDescription: doc.seoDescription ?? null,
    noIndex: doc.noIndex ?? null,
    parent: parent
      ? { city: parent.city, slug: parent.slug.current, kind: parent.kind }
      : null,
    children: children.map((child) => ({
      city: child.city,
      slug: child.slug.current,
      driveTimeMinutes: child.driveTimeMinutes ?? null,
      distanceKm: child.distanceKm ?? null,
    })),
  };
}

/**
 * Replaces NEAREST_LOCATIONS_QUERY: the three nearest published neighbourhoods.
 *
 * Accepts a document id or a slug, because the query took an id and the
 * Phase 6.9 replacement took a slug, and call sites exist for both.
 */
export async function getNearestLocations(idOrSlug: string) {
  return LIVE_LOCATIONS.filter(
    (doc) =>
      doc.kind === "neighbourhood" &&
      doc._id !== idOrSlug &&
      doc.slug.current !== idOrSlug,
  )
    .sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999))
    .slice(0, 3)
    .map((doc) => ({
      city: doc.city,
      slug: doc.slug.current,
      distanceKm: doc.distanceKm ?? null,
      driveTimeMinutes: doc.driveTimeMinutes ?? null,
    }));
}

/** The raw constant, for code that needs fields the projections drop. */
export const LOCATIONS: LocationDoc[] = LOCATION_DOCS;
