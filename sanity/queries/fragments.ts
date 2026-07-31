/**
 * Shared GROQ fragments.
 *
 * Two rules apply to every query on the site:
 *   1. Only published documents are returned, unless the request is running in
 *      draft mode. $draft is injected by sanityFetch, so no query can forget it.
 *   2. Draft documents are excluded by id, so a published document is never
 *      shadowed by its own unsaved draft on the live site.
 *
 * PHASE 6.9 IS MID-FLIGHT. Both shapes live here on purpose.
 *
 * The document shape below is what production still holds and what the
 * deployment still reads. The inline shape at the bottom is what the migrated
 * staging dataset holds. Keeping both means the tree compiles and the live
 * site is untouched while the consumers are moved over one at a time, which is
 * the same principle as keeping the old schemas until the diff is clean.
 *
 * Delete the document-shape fragments once every consumer reads the inline
 * ones and the 143-page diff is clean.
 */
export const LIVE = `(published == true || $draft) && !(_id in path("drafts.**"))`;

/* ========================================================================
 * Document shape. Production. Still in use.
 * ===================================================================== */

/** The columns every price table needs, resolved through the repair type. */
export const PRICE_ROW_FRAGMENT = `
  _id,
  price,
  quoteOnly,
  partGrade,
  turnaroundMinutes,
  warrantyDays,
  inStock,
  note,
  needsVerification,
  "repair": repairType->{
    _id,
    name,
    "slug": slug.current,
    shortDescription,
    estimatedMinutes,
    order
  },
  "sharedWith": priceGroup->{ name, note }
`;

/**
 * Prices for one model, ordered so the repair customers ask about most comes
 * first. The ordering lives in repairType.order, seeded screen 10, battery 20,
 * then the rest.
 */
export const MODEL_PRICES_FRAGMENT = `
  "prices": *[_type == "priceEntry" && model._ref == ^._id] | order(repairType->order asc, repairType->name asc){
    ${PRICE_ROW_FRAGMENT}
  }
`;

/** Lowest real price across a model's repairs, for "from $X" labels. */
export const MODEL_FROM_PRICE_FRAGMENT = `
  "fromPrice": math::min(*[_type == "priceEntry" && model._ref == ^._id && defined(price)].price)
`;

/** The shape a model needs to appear in a grid or a related-links block. */
export const MODEL_CARD_FRAGMENT = `
  _id,
  name,
  "slug": slug.current,
  deviceType,
  releaseYear,
  popular,
  "brandName": brand->name,
  "brandSlug": brand->slug.current,
  ${MODEL_FROM_PRICE_FRAGMENT}
`;

/* ========================================================================
 * Inline shape. Staging. The target.
 *
 * These are smaller and dumber than the ones above, deliberately: they return
 * the raw array and the repair's name, description, minutes and sort order are
 * joined in TypeScript by lib/content/hydrate-prices.ts from the code
 * constant. Reassembling the old shape inside GROQ would mean ordering by a
 * field that no longer lives on any document.
 * ===================================================================== */

/**
 * A model's inline repairs, raw.
 *
 * Every repair the shop offers on the model is an entry. `price` is present or
 * absent, and absent means quoted. scripts/verify-derivation.ts proved the
 * offered set cannot be derived from the device kind: it matched for zero of
 * 156 models, because each carries a curated three-to-five rather than the
 * thirteen that apply to a phone.
 */
export const MODEL_REPAIRS_FRAGMENT = `
  "repairs": repairs[]{
    repair,
    price,
    partGrade,
    turnaroundMinutes,
    warrantyDays,
    inStock,
    note,
    needsVerification
  }
`;

/** Lowest real price, read from the array rather than counted across documents. */
export const MODEL_FROM_PRICE_INLINE_FRAGMENT = `
  "fromPrice": math::min(repairs[defined(price)].price)
`;

/** How many priced repairs a model carries. Drives the lean-page decision. */
export const MODEL_PRICED_COUNT_FRAGMENT = `
  "pricedCount": count(repairs[defined(price)])
`;

/** Card shape on the inline model, with the brand as a plain slug. */
export const MODEL_CARD_INLINE_FRAGMENT = `
  _id,
  name,
  "slug": slug.current,
  deviceType,
  releaseYear,
  popular,
  brandSlug,
  ${MODEL_FROM_PRICE_INLINE_FRAGMENT}
`;

/** Everything an FAQ block and its FAQPage structured data need. */
export const FAQ_FRAGMENT = `
  _id,
  question,
  plainAnswer,
  answer,
  category,
  featured,
  order
`;
