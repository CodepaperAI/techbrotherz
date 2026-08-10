import { activeBrands, brand as brandDef, type BrandDef } from "@/lib/content/brands";
import { hydrateRepairs, type HydratedPrice } from "@/lib/content/hydrate-prices";
import { modelContent } from "@/lib/content/model-content";
import { priceGroupFor, repairsFor, REPAIR_TYPES, type DeviceKind } from "@/lib/content/repair-types";
import { FLAT_SERVICE_DOCS } from "@/content/data/flat-services";
import { MODEL_DOCS } from "@/content/data/models";
import type { ModelDoc } from "@/content/data/types";

/**
 * The catalogue, read from a constant.
 *
 * Every function here replaces a GROQ query, and each one names the query it
 * replaces so the two can be compared. The orderings are ported rather than
 * reinvented: `order(releaseYear desc, name asc)` became `byYearThenName`, and
 * the string half compares by code point because that is what GROQ does and a
 * locale-aware compare quietly disagrees on punctuation.
 *
 * Getting this wrong is not hypothetical. The Phase 6.9 pass dropped a
 * tie-break here and a `published` filter in the locations accessor, and both
 * showed up as changed pages in the 143-page diff rather than as failing types.
 */

/** GROQ compares strings by code point. localeCompare does not. */
function cmp(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** `order(releaseYear desc, name asc)`, with undefined years sorting last. */
function byYearThenName(a: ModelDoc, b: ModelDoc): number {
  const yearA = a.releaseYear ?? Number.NEGATIVE_INFINITY;
  const yearB = b.releaseYear ?? Number.NEGATIVE_INFINITY;
  if (yearA !== yearB) return yearB - yearA;
  return cmp(a.name, b.name);
}

/** The `LIVE` fragment. Draft mode is gone with the dataset, so this is all of it. */
function isLive(doc: { published?: boolean }): boolean {
  return doc.published === true;
}

const LIVE_MODELS = MODEL_DOCS.filter(isLive);

/** Display names by slug, for price-group sibling links. */
const NAME_BY_SLUG = new Map(MODEL_DOCS.map((doc) => [doc.slug.current, doc.name]));

/*
 * Phase 8 removed prices. What differentiates a card or a hub is now the model
 * count and the model range, which the cards already carry.
 */
function repairCount(doc: ModelDoc): number {
  return (doc.repairs ?? []).length;
}

/* ----------------------------------------------------------------- brands */

export interface BrandWithStats extends BrandDef {
  _id: string;
  modelCount: number;
  oldestModel: string | null;
  newestModel: string | null;
}

/**
 * The nine brands with catalogue statistics.
 *
 * Replaces BRAND_STATS_QUERY. The brand itself is a code constant; only the
 * counts need the model data.
 *
 * The range ends read from models that carry a release year, because a range
 * label is a statement about years. Ties break on name ascending, which is what
 * `order(releaseYear desc, name asc)[0]` did and what the Phase 6.9 version
 * dropped, turning "to Moto G (3rd gen)" into "to Moto X Play".
 */
export async function getBrands(): Promise<BrandWithStats[]> {
  return activeBrands().map((brand) => {
    const mine = LIVE_MODELS.filter((doc) => doc.brandSlug === brand.slug);
    const dated = mine
      .filter((doc) => typeof doc.releaseYear === "number")
      .sort(byYearThenName);

    return {
      ...brand,
      _id: `brand.${brand.slug}`,
      modelCount: mine.length,
      /* dated is newest first, so the oldest is the last entry. */
      oldestModel: dated.at(-1)?.name ?? null,
      newestModel: dated[0]?.name ?? null,
    };
  });
}

export async function getBrandBySlug(slug: string): Promise<BrandWithStats | null> {
  return (await getBrands()).find((entry) => entry.slug === slug) ?? null;
}

export function getBrandParams() {
  return Promise.resolve(activeBrands().map((entry) => ({ slug: entry.slug })));
}

/* ------------------------------------------------------------ repair types */

export function getRepairTypes() {
  return Promise.resolve(
    [...REPAIR_TYPES].sort((a, b) => a.order - b.order || cmp(a.name, b.name)),
  );
}

export function getRepairTypeBySlug(slug: string) {
  return Promise.resolve(REPAIR_TYPES.find((entry) => entry.slug === slug) ?? null);
}

export function repairsForKind(kind: DeviceKind) {
  return repairsFor(kind);
}

/* ------------------------------------------------------------------ models */

export interface HydratedModel {
  _id: string;
  _updatedAt: string;
  name: string;
  slug: string;
  deviceType: string | null;
  releaseYear: number | null;
  aliases: string[] | null;
  brandSlug: string | null;
  popular: boolean | null;
  discontinued: boolean | null;
  seoTitle: string | null;
  seoDescription: string | null;
  noIndex: boolean | null;
  brand: { _id: string; name: string; slug: string; type: string } | null;
  prices: HydratedPrice[];
  priceGroup: {
    name: string;
    note: string | null;
    models: { name: string; slug: string; brandSlug: string }[];
  } | null;
  intro: unknown;
  commonIssues: string[];
  verdict: unknown;
  repairNotes: unknown;
  lastSupportedOs: string | null;
  stillReceivesUpdates: boolean | null;
}

/**
 * Assembles the shape every page already consumed.
 *
 * Three sources: the model constant for the facts and prices, the brand and
 * price-group constants for the relationships, and content/models/ for the
 * prose. The sibling links in a price group read their display name from
 * NAME_BY_SLUG; the Phase 6.9 version accepted an optional lookup that no
 * caller ever passed, so every one of them rendered "ipad-3" instead of
 * "iPad 3".
 */
function hydrate(doc: ModelDoc): HydratedModel {
  const def = brandDef(doc.brandSlug);
  const content = modelContent(doc.slug.current);
  const group = priceGroupFor(doc.slug.current);

  return {
    _id: doc._id,
    _updatedAt: doc._updatedAt,
    name: doc.name,
    slug: doc.slug.current,
    deviceType: doc.deviceType ?? null,
    releaseYear: doc.releaseYear ?? null,
    aliases: doc.aliases ?? null,
    brandSlug: doc.brandSlug ?? null,
    popular: doc.popular ?? null,
    discontinued: doc.discontinued ?? null,
    seoTitle: doc.seoTitle ?? null,
    seoDescription: doc.seoDescription ?? null,
    noIndex: doc.noIndex ?? null,
    brand: def ? { _id: `brand.${def.slug}`, name: def.name, slug: def.slug, type: def.type } : null,
    prices: hydrateRepairs(doc.repairs, doc.slug.current),
    priceGroup: group
      ? {
          name: group.name,
          note: group.note ?? null,
          models: group.models.map((slug) => ({
            name: NAME_BY_SLUG.get(slug) ?? slug,
            slug,
            brandSlug: doc.brandSlug ?? "",
          })),
        }
      : null,
    intro: content?.intro ?? null,
    commonIssues: content?.commonIssues ?? [],
    verdict: content?.verdict ?? null,
    repairNotes: content?.repairNotes ?? null,
    lastSupportedOs: content?.lastSupportedOs ?? doc.lastSupportedOs ?? null,
    stillReceivesUpdates: content?.stillReceivesUpdates ?? doc.stillReceivesUpdates ?? null,
  };
}

/** Replaces MODEL_BY_SLUG_QUERY. */
export async function getModelBySlug(slug: string): Promise<HydratedModel | null> {
  const doc = LIVE_MODELS.find((entry) => entry.slug.current === slug);
  return doc ? hydrate(doc) : null;
}

/** Brand display order is a constant, so grouping is a lookup not a join. */
function sortByBrand<T extends { brandSlug: string | null }>(rows: T[]): T[] {
  const order = new Map(activeBrands().map((entry, index) => [entry.slug, index]));
  return [...rows].sort(
    (a, b) =>
      (order.get(a.brandSlug ?? "") ?? Number.MAX_SAFE_INTEGER) -
      (order.get(b.brandSlug ?? "") ?? Number.MAX_SAFE_INTEGER),
  );
}

/** Replaces ALL_PRICED_MODELS_QUERY. */
export async function getAllPricedModels(): Promise<HydratedModel[]> {
  return sortByBrand(
    LIVE_MODELS.filter((doc) => (doc.repairs ?? []).length > 0)
      .sort(byYearThenName)
      .map(hydrate),
  );
}

export interface ModelSummary {
  _id: string;
  name: string;
  slug: string;
  deviceType: string | null;
  releaseYear: number | null;
  brandSlug: string | null;
  brandName: string | null;
  repairCount: number;
  pricedCount: number;
}

/** Replaces MODEL_SUMMARIES_QUERY. */
export async function getModelSummaries(): Promise<ModelSummary[]> {
  return sortByBrand(
    LIVE_MODELS.filter((doc) => (doc.repairs ?? []).length > 0)
      .sort(byYearThenName)
      .map((doc) => {
          return {
          _id: doc._id,
          name: doc.name,
          slug: doc.slug.current,
          deviceType: doc.deviceType ?? null,
          releaseYear: doc.releaseYear ?? null,
          brandSlug: doc.brandSlug ?? null,
          brandName: brandDef(doc.brandSlug)?.name ?? null,
          repairCount: (doc.repairs ?? []).length,
          pricedCount: repairCount(doc),
        };
      }),
  );
}

/** The card shape, replacing MODEL_CARD_INLINE_FRAGMENT. */
function card(doc: ModelDoc) {
  return {
    _id: doc._id,
    name: doc.name,
    slug: doc.slug.current,
    deviceType: doc.deviceType ?? null,
    releaseYear: doc.releaseYear ?? null,
    popular: doc.popular ?? null,
    brandSlug: doc.brandSlug ?? null,
    brandName: brandDef(doc.brandSlug)?.name ?? null,
  };
}

/** Replaces MODELS_BY_BRAND_QUERY. */
export async function getModelsByBrand(brandSlug: string) {
  return LIVE_MODELS.filter((doc) => doc.brandSlug === brandSlug)
    .sort(byYearThenName)
    .map(card);
}

/** Replaces POPULAR_MODELS_QUERY. */
export async function getPopularModels(limit = 8) {
  return LIVE_MODELS.filter((doc) => doc.popular === true)
    .sort(byYearThenName)
    .slice(0, limit)
    .map(card);
}

/**
 * Replaces RELATED_MODELS_QUERY: three siblings, closest by release year.
 *
 * GROQ had no absolute value, so the query used select() to compute the
 * distance in both directions. Here it is Math.abs.
 */
export async function getRelatedModels(params: {
  modelId: string;
  brandSlug: string;
  releaseYear: number | null;
}) {
  const target = params.releaseYear ?? 0;
  return LIVE_MODELS.filter(
    (doc) => doc._id !== params.modelId && doc.brandSlug === params.brandSlug,
  )
    .sort((a, b) => {
      const distance =
        Math.abs((a.releaseYear ?? 0) - target) - Math.abs((b.releaseYear ?? 0) - target);
      return distance !== 0 ? distance : cmp(a.name, b.name);
    })
    .slice(0, 3)
    .map(card);
}

/** Replaces MODEL_SEARCH_INDEX_QUERY. Feeds the 404 suggester. */
export async function getModelSearchIndex() {
  return [...LIVE_MODELS].sort((a, b) => cmp(a.name, b.name)).map((doc) => ({
    name: doc.name,
    slug: doc.slug.current,
    brandSlug: doc.brandSlug ?? null,
    aliases: doc.aliases ?? null,
  }));
}

/* -------------------------------------------------------------- brand hub */

export interface BrandHub {
  _id: string;
  _updatedAt: string | null;
  name: string;
  slug: string;
  type: string;
  intro: unknown;
  seoTitle: string | null;
  seoDescription: string | null;
  noIndex: boolean;
  models: {
    _id: string;
    name: string;
    slug: string;
    deviceType: string | null;
    releaseYear: number | null;
    stillReceivesUpdates: boolean | null;
    repairCount: number;
    pricedCount: number;
  }[];
  awaitingPrices: { name: string; releaseYear: number | null }[];
  repairTypes: {
    name: string;
    slug: string;
    shortDescription: string | null;
    appliesTo: string[];
    estimatedMinutes: number | null;
  }[];
}

/**
 * Replaces BRAND_MODELS_QUERY and BRAND_AWAITING_QUERY.
 *
 * `_updatedAt` is the newest of the brand's models. The brand document that
 * used to carry one is a code constant now, and a constant compiled into the
 * bundle has no modification date; but the page's prices and model list do, and
 * they are what the "Last updated" line is about. Without this the line
 * disappeared from all nine hubs.
 */
export async function getBrandHub(slug: string): Promise<BrandHub | null> {
  const def = brandDef(slug);
  if (!def) return null;

  const mine = MODEL_DOCS.filter((doc) => doc.brandSlug === slug);
  const models = mine.filter(isLive).sort(byYearThenName);
  const awaiting = mine
    .filter((doc) => doc.published !== true)
    .sort(byYearThenName)
    .map((doc) => ({ name: doc.name, releaseYear: doc.releaseYear ?? null }));

  const kinds = new Set<DeviceKind>(
    models.map((doc) => (doc.deviceType ?? "phone") as DeviceKind),
  );

  /*
   * Laptops and desktops carry no deviceModel documents at all: that hub's
   * pricing is the flat services, not a model catalogue. So the date falls back
   * to the newest flat service, which is what the page actually shows. Without
   * the fallback the "Last updated" line disappears from that one hub.
   */
  const updated =
    models
      .map((doc) => doc._updatedAt)
      .filter(Boolean)
      .sort()
      .at(-1) ??
    FLAT_SERVICE_DOCS.map((doc) => doc._updatedAt)
      .filter(Boolean)
      .sort()
      .at(-1);

  return {
    _id: `brand.${def.slug}`,
    _updatedAt: updated ?? null,
    name: def.name,
    slug: def.slug,
    type: def.type,
    intro: def.intro ?? null,
    seoTitle: def.seoTitle ?? null,
    seoDescription: def.seoDescription ?? null,
    noIndex: false,
    models: models.map((doc) => {
      return {
        _id: doc._id,
        name: doc.name,
        slug: doc.slug.current,
        deviceType: doc.deviceType ?? null,
        releaseYear: doc.releaseYear ?? null,
        stillReceivesUpdates:
          modelContent(doc.slug.current)?.stillReceivesUpdates ?? doc.stillReceivesUpdates ?? null,
        repairCount: (doc.repairs ?? []).length,
        pricedCount: repairCount(doc),
      };
    }),
    awaitingPrices: awaiting,
    repairTypes: REPAIR_TYPES.filter((entry) =>
      entry.appliesTo.some((kind) => kinds.has(kind)),
    )
      .sort((a, b) => a.order - b.order)
      .map((entry) => ({
        name: entry.name,
        slug: entry.slug as string,
        shortDescription: entry.shortDescription ?? null,
        appliesTo: entry.appliesTo as string[],
        estimatedMinutes: entry.estimatedMinutes ?? null,
      })),
  };
}

/* -------------------------------------------------- cross-model, Tier 3 */

export interface RepairAcrossModels {
  _id: string;
  name: string;
  slug: string;
  deviceType: string | null;
  releaseYear: number | null;
  brandSlug: string | null;
  note: string | null;
  needsVerification: boolean | null;
}

/**
 * Replaces MODELS_OFFERING_REPAIR_QUERY: every model that offers one repair.
 *
 * This was the query the inline refactor made awkward, and the awkwardness is
 * now just an array find. The note in the old file said not to push the
 * filtering back into GROQ because that meant giving the repair type a document
 * again. There is no GROQ left to push it into.
 */
export async function getModelsOfferingRepair(
  repairSlug: string,
): Promise<RepairAcrossModels[]> {
  return sortByBrand(
    LIVE_MODELS.filter((doc) => (doc.repairs ?? []).some((entry) => entry.repair === repairSlug))
      .sort(byYearThenName)
      .map((doc) => {
        const entry = (doc.repairs ?? []).find((item) => item.repair === repairSlug);
        return {
          _id: doc._id,
          name: doc.name,
          slug: doc.slug.current,
          deviceType: doc.deviceType ?? null,
          releaseYear: doc.releaseYear ?? null,
          brandSlug: doc.brandSlug ?? null,
          note: entry?.note ?? null,
          needsVerification: entry?.needsVerification ?? null,
        };
      }),
  );
}

/* ------------------------------------------------------------- sitemap */

/** Replaces ALL_SLUGS_FOR_SITEMAP_QUERY. */
export async function getAllSlugsForSitemap() {
  return {
    models: LIVE_MODELS.filter((doc) => doc.noIndex !== true).map((doc) => ({
      slug: doc.slug.current,
      brandSlug: doc.brandSlug ?? null,
      _updatedAt: doc._updatedAt,
    })),
  };
}

/** Replaces MODEL_PARAMS_QUERY. Feeds generateStaticParams. */
export async function getModelParams() {
  return LIVE_MODELS.map((doc) => ({
    slug: doc.slug.current,
    brandSlug: doc.brandSlug ?? null,
    pricedCount: repairCount(doc),
  }));
}
