import { defineQuery } from "next-sanity";

import { LIVE } from "./fragments";

export const LOCATIONS_QUERY = defineQuery(`
  *[_type == "location" && ${LIVE}] | order(isPrimary desc, order asc, city asc){
    _id,
    _updatedAt,
    city,
    "slug": slug.current,
    kind,
    province,
    isPrimary,
    distanceKm,
    driveTimeMinutes,
    neighbourhoods,
    routeDescription,
    transitDescription,
    "parentSlug": parent->slug.current
  }
`);

export const LOCATION_BY_SLUG_QUERY = defineQuery(`
  *[_type == "location" && slug.current == $slug && ${LIVE}][0]{
    _id,
    _updatedAt,
    city,
    "slug": slug.current,
    kind,
    province,
    isPrimary,
    neighbourhoods,
    distanceKm,
    driveTimeMinutes,
    landmarks,
    routeDescription,
    transitDescription,
    commonRepairs,
    intro,
    mapEmbedUrl,
    seoTitle,
    seoDescription,
    ogImage,
    noIndex,
    "parent": parent->{ city, "slug": slug.current, kind },
    "children": *[_type == "location" && parent._ref == ^._id && ${LIVE}] | order(order asc){
      city, "slug": slug.current, driveTimeMinutes, distanceKm
    }
  }
`);

/** The three nearest published neighbourhoods, for cross-linking local pages. */
export const NEAREST_LOCATIONS_QUERY = defineQuery(`
  *[_type == "location" && ${LIVE} && _id != $locationId && kind == "neighbourhood"]
    | order(coalesce(distanceKm, 999) asc)[0...3]{
      city,
      "slug": slug.current,
      distanceKm,
      driveTimeMinutes
    }
`);
