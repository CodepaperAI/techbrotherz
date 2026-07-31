import { defineQuery } from "next-sanity";

import { FAQ_FRAGMENT, LIVE, MODEL_CARD_FRAGMENT } from "./fragments";

/* ---------------------------------------------------------------------- faqs */

/** Questions that suit any page. Used on the home page and /faq. */
export const GLOBAL_FAQS_QUERY = defineQuery(`
  *[_type == "faq" && ${LIVE} && featured == true] | order(order asc)[0...$limit]{
    ${FAQ_FRAGMENT}
  }
`);

/**
 * Questions filtered to one page's subject.
 *
 * Pass any combination of $service (a service slug), $model (a model id) and
 * $location (a location id). Unused filters are passed as null and drop out.
 */
export const FAQS_FOR_QUERY = defineQuery(`
  *[_type == "faq" && ${LIVE} && (
      ($service != null && $service in appliesToServices) ||
      ($model != null && $model in appliesToModels[]._ref) ||
      ($location != null && $location in appliesToLocations[]._ref)
    )] | order(order asc)[0...$limit]{
      ${FAQ_FRAGMENT}
    }
`);

export const FAQS_BY_CATEGORY_QUERY = defineQuery(`
  *[_type == "faq" && ${LIVE} && category == $category] | order(order asc){
    ${FAQ_FRAGMENT}
  }
`);

export const ALL_FAQS_QUERY = defineQuery(`
  *[_type == "faq" && ${LIVE}] | order(category asc, order asc){
    ${FAQ_FRAGMENT}
  }
`);

/* -------------------------------------------------------------------- guides */

export const GUIDES_QUERY = defineQuery(`
  *[_type == "guide" && ${LIVE}] | order(publishedAt desc){
    _id,
    _updatedAt,
    title,
    "slug": slug.current,
    excerpt,
    quickAnswer,
    heroImage,
    publishedAt,
    updatedAt,
    readingMinutes,
    "author": author->{ name, role }
  }
`);

export const GUIDE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "guide" && slug.current == $slug && ${LIVE}][0]{
    _id,
    _updatedAt,
    title,
    "slug": slug.current,
    excerpt,
    quickAnswer,
    heroImage,
    body,
    publishedAt,
    updatedAt,
    schemaType,
    howToSteps,
    readingMinutes,
    seoTitle,
    seoDescription,
    ogImage,
    noIndex,
    "author": author->{ name, role, bio, photo, credentials, yearsExperience },
    "faqs": faqs[]->{ ${FAQ_FRAGMENT} },
    "relatedServices": relatedServices[]->{ title, "slug": slug.current, serviceType },
    "relatedModels": relatedModels[]->{ ${MODEL_CARD_FRAGMENT} },
    "relatedLocations": relatedLocations[]->{ city, "slug": slug.current, kind },
    "relatedGuides": relatedGuides[]->{ title, "slug": slug.current, excerpt }
  }
`);

/* -------------------------------------------------------------- service page */

export const SERVICE_PAGE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "servicePage" && slug.current == $slug && ${LIVE}][0]{
    _id,
    _updatedAt,
    title,
    "slug": slug.current,
    serviceType,
    quickAnswer,
    heroHeadline,
    heroSubcopy,
    body,
    benefits,
    processSteps,
    localPagePath,
    seoTitle,
    seoDescription,
    ogImage,
    noIndex,
    "parentService": parentService->{ title, "slug": slug.current },
    "faqs": faqs[]->{ ${FAQ_FRAGMENT} },
    "relatedModels": relatedModels[]->{ ${MODEL_CARD_FRAGMENT} },
    "relatedGuides": relatedGuides[]->{ title, "slug": slug.current, excerpt }
  }
`);

export const SERVICE_PAGES_QUERY = defineQuery(`
  *[_type == "servicePage" && ${LIVE}] | order(title asc){
    _id,
    _updatedAt,
    title,
    "slug": slug.current,
    serviceType,
    heroSubcopy,
    "parentSlug": parentService->slug.current
  }
`);

/* -------------------------------------------------------------- testimonials */

/**
 * Only reviews the shop can point to publicly. An unverified review is never
 * returned, so it can never reach a page by accident.
 */
export const TESTIMONIALS_QUERY = defineQuery(`
  *[_type == "testimonial" && verified == true] | order(date desc)[0...$limit]{
    _id,
    name,
    rating,
    text,
    device,
    source,
    sourceUrl,
    date
  }
`);

/* ------------------------------------------------------------------- authors */

export const AUTHORS_QUERY = defineQuery(`
  *[_type == "author" && ${LIVE}] | order(name asc){
    _id,
    name,
    "slug": slug.current,
    role,
    bio,
    photo,
    credentials,
    yearsExperience
  }
`);
