import { defineQuery } from "next-sanity";

import {
  LIVE,
  MODEL_CARD_FRAGMENT,
  MODEL_FROM_PRICE_FRAGMENT,
  MODEL_PRICES_FRAGMENT,
  PRICE_ROW_FRAGMENT,
} from "./fragments";

/* -------------------------------------------------------------------- brands */

/*
 * Phase 6.5b added oldestModel, newestModel and fromPrice. The brand card
 * carries a model range and a starting price because a name and a count alone
 * made nine cards look identical, and both are real catalogue data rather than
 * decoration. GROQ has no block comments, so this note lives out here.
 */
export const BRANDS_QUERY = defineQuery(`
  *[_type == "brand" && ${LIVE} && active == true] | order(order asc, name asc){
    _id,
    _updatedAt,
    name,
    "slug": slug.current,
    type,
    logo,
    intro,
    seoDescription,
    "modelCount": count(*[_type == "deviceModel" && brand._ref == ^._id && published == true]),
    "oldestModel": *[_type == "deviceModel" && brand._ref == ^._id && published == true]
      | order(releaseYear asc)[0].name,
    "newestModel": *[_type == "deviceModel" && brand._ref == ^._id && published == true]
      | order(releaseYear desc)[0].name,
    "fromPrice": math::min(
      *[_type == "priceEntry" && defined(price) &&
        model->brand._ref == ^._id && model->published == true].price
    )
  }
`);

export const BRAND_BY_SLUG_QUERY = defineQuery(`
  *[_type == "brand" && slug.current == $slug && ${LIVE}][0]{
    _id,
    _updatedAt,
    name,
    "slug": slug.current,
    type,
    logo,
    intro,
    seoTitle,
    seoDescription,
    ogImage,
    noIndex
  }
`);

/* -------------------------------------------------------------------- models */

export const MODELS_BY_BRAND_QUERY = defineQuery(`
  *[_type == "deviceModel" && brand->slug.current == $brandSlug && ${LIVE}]
    | order(releaseYear desc, name asc){
      ${MODEL_CARD_FRAGMENT}
    }
`);

/**
 * One model with every price row resolved and ordered, ready for the price
 * table and the structured data.
 *
 * Carries the per-model prose the Phase 4 thin-content guard requires: the
 * introduction, the common issues, the worth-repairing verdict and the repair
 * notes that differ from its siblings.
 */
export const MODEL_BY_SLUG_QUERY = defineQuery(`
  *[_type == "deviceModel" && slug.current == $slug && ${LIVE}][0]{
    _id,
    _updatedAt,
    name,
    "slug": slug.current,
    deviceType,
    releaseYear,
    image,
    aliases,
    commonIssues,
    intro,
    verdict,
    repairNotes,
    lastSupportedOs,
    stillReceivesUpdates,
    popular,
    discontinued,
    seoTitle,
    seoDescription,
    ogImage,
    noIndex,
    "brand": brand->{ _id, name, "slug": slug.current, type },
    "priceGroup": *[_type == "priceGroup" && references(^._id)][0]{
      name,
      note,
      "models": models[]->{ name, "slug": slug.current, "brandSlug": brand->slug.current }
    },
    ${MODEL_PRICES_FRAGMENT},
    ${MODEL_FROM_PRICE_FRAGMENT}
  }
`);

/**
 * Everything a brand hub needs in one round trip: the brand, its published
 * models newest first, and the names of the models held back for want of
 * prices so the page can name them honestly rather than pretend they do not
 * exist.
 */
export const BRAND_HUB_QUERY = defineQuery(`
  *[_type == "brand" && slug.current == $slug && ${LIVE}][0]{
    _id,
    _updatedAt,
    name,
    "slug": slug.current,
    type,
    intro,
    seoTitle,
    seoDescription,
    ogImage,
    noIndex,
    "models": *[_type == "deviceModel" && brand._ref == ^._id && ${LIVE}]
      | order(releaseYear desc, name asc){
        _id,
        name,
        "slug": slug.current,
        deviceType,
        releaseYear,
        stillReceivesUpdates,
        ${MODEL_FROM_PRICE_FRAGMENT},
        "repairCount": count(*[_type == "priceEntry" && model._ref == ^._id]),
        "pricedCount": count(*[_type == "priceEntry" && model._ref == ^._id && defined(price)])
      },
    "awaitingPrices": *[_type == "deviceModel" && brand._ref == ^._id && published != true]
      | order(releaseYear desc, name asc){
        name,
        releaseYear
      },
    "repairTypes": *[_type == "repairType" && ${LIVE}] | order(order asc){
      name,
      "slug": slug.current,
      shortDescription,
      appliesTo,
      estimatedMinutes
    }
  }
`);

/** Every published model as a summary row, for the refactored price list. */
export const MODEL_SUMMARIES_QUERY = defineQuery(`
  *[_type == "deviceModel" && ${LIVE} && count(*[_type == "priceEntry" && model._ref == ^._id]) > 0]
    | order(brand->order asc, releaseYear desc, name asc){
      _id,
      name,
      "slug": slug.current,
      deviceType,
      releaseYear,
      "brandName": brand->name,
      "brandSlug": brand->slug.current,
      "repairCount": count(*[_type == "priceEntry" && model._ref == ^._id]),
      "pricedCount": count(*[_type == "priceEntry" && model._ref == ^._id && defined(price)]),
      "fromPrice": math::min(*[_type == "priceEntry" && model._ref == ^._id && defined(price)].price),
      "toPrice": math::max(*[_type == "priceEntry" && model._ref == ^._id && defined(price)].price)
    }
`);

export const POPULAR_MODELS_QUERY = defineQuery(`
  *[_type == "deviceModel" && popular == true && ${LIVE}]
    | order(releaseYear desc, name asc)[0...$limit]{
      ${MODEL_CARD_FRAGMENT}
    }
`);

/**
 * Everything with at least one price row, grouped for the full price list page.
 */
export const ALL_PRICED_MODELS_QUERY = defineQuery(`
  *[_type == "deviceModel" && ${LIVE} && count(*[_type == "priceEntry" && model._ref == ^._id]) > 0]
    | order(brand->order asc, releaseYear desc, name asc){
      _id,
      name,
      "slug": slug.current,
      deviceType,
      releaseYear,
      "brandName": brand->name,
      "brandSlug": brand->slug.current,
      ${MODEL_PRICES_FRAGMENT}
    }
`);

/**
 * Three siblings from the same brand, closest by release year first.
 *
 * GROQ has no absolute-value function, so select() computes the distance in
 * both directions and the smaller branch wins.
 */
export const RELATED_MODELS_QUERY = defineQuery(`
  *[_type == "deviceModel" && ${LIVE} && _id != $modelId && brand._ref == $brandId]
    | order(
        select(
          coalesce(releaseYear, 0) >= $releaseYear => coalesce(releaseYear, 0) - $releaseYear,
          $releaseYear - coalesce(releaseYear, 0)
        ) asc,
        name asc
      )[0...3]{
      ${MODEL_CARD_FRAGMENT}
    }
`);

/**
 * A small index of every published model, its brand and its aliases.
 *
 * Used by the not-found page to suggest the closest models to whatever the
 * visitor typed. Deliberately narrow: names and slugs only, so the payload
 * stays a few kilobytes even across the whole catalogue.
 */
export const MODEL_SEARCH_INDEX_QUERY = defineQuery(`
  *[_type == "deviceModel" && ${LIVE}] | order(name asc){
    name,
    "slug": slug.current,
    "brandSlug": brand->slug.current,
    aliases
  }
`);

/* -------------------------------------------------------------- repair types */

export const REPAIR_TYPES_QUERY = defineQuery(`
  *[_type == "repairType" && ${LIVE}] | order(order asc, name asc){
    _id,
    _updatedAt,
    name,
    "slug": slug.current,
    shortDescription,
    estimatedMinutes,
    appliesTo,
    symptoms,
    icon,
    order
  }
`);

export const REPAIR_TYPE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "repairType" && slug.current == $slug && ${LIVE}][0]{
    _id,
    _updatedAt,
    name,
    "slug": slug.current,
    shortDescription,
    longDescription,
    estimatedMinutes,
    appliesTo,
    symptoms,
    seoTitle,
    seoDescription,
    ogImage,
    noIndex,
    "examplePrices": *[_type == "priceEntry" && repairType._ref == ^._id && defined(price)]
      | order(price asc)[0...12]{
        ${PRICE_ROW_FRAGMENT},
        "modelName": model->name,
        "modelSlug": model->slug.current,
        "brandSlug": model->brand->slug.current
      }
  }
`);

/* ---------------------------------------------------------- flat + unlocking */

export const FLAT_SERVICES_QUERY = defineQuery(`
  *[_type == "flatService" && ${LIVE}] | order(order asc, name asc){
    _id,
    _updatedAt,
    name,
    "slug": slug.current,
    price,
    priceFrom,
    priceTo,
    quoteOnly,
    category,
    description,
    includes,
    turnaroundMinutes,
    needsVerification
  }
`);

export const UNLOCKING_QUERY = defineQuery(`
  *[_type == "unlockingService" && ${LIVE}] | order(order asc, carrier asc){
    _id,
    _updatedAt,
    carrier,
    deviceType,
    price,
    turnaround,
    notes
  }
`);
