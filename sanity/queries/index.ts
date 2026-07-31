import "server-only";

import { sanityFetch, tags } from "../lib/fetch";
import type {
  ALL_FAQS_QUERYResult,
  ALL_PRICED_MODELS_QUERYResult,
  ALL_SLUGS_FOR_SITEMAP_QUERYResult,
  AUTHORS_QUERYResult,
  BRANDS_QUERYResult,
  BRAND_BY_SLUG_QUERYResult,
  BRAND_PARAMS_QUERYResult,
  FAQS_BY_CATEGORY_QUERYResult,
  FAQS_FOR_QUERYResult,
  FLAT_SERVICES_QUERYResult,
  GLOBAL_FAQS_QUERYResult,
  GUIDES_QUERYResult,
  GUIDE_BY_SLUG_QUERYResult,
  LOCATIONS_QUERYResult,
  LOCATION_BY_SLUG_QUERYResult,
  MODELS_BY_BRAND_QUERYResult,
  MODEL_BY_SLUG_QUERYResult,
  MODEL_SEARCH_INDEX_QUERYResult,
  MODEL_SUMMARIES_QUERYResult,
  BRAND_HUB_QUERYResult,
  MODEL_PARAMS_QUERYResult,
  NAVIGATION_QUERYResult,
  NEAREST_LOCATIONS_QUERYResult,
  POPULAR_MODELS_QUERYResult,
  REDIRECTS_QUERYResult,
  RELATED_MODELS_QUERYResult,
  REPAIR_TYPES_QUERYResult,
  REPAIR_TYPE_BY_SLUG_QUERYResult,
  REVIEW_SUMMARY_QUERYResult,
  SERVICE_PAGES_QUERYResult,
  SERVICE_PAGE_BY_SLUG_QUERYResult,
  SITE_SETTINGS_QUERYResult,
  TESTIMONIALS_QUERYResult,
  UNLOCKING_QUERYResult,
} from "../types";

import {
  ALL_PRICED_MODELS_QUERY,
  BRANDS_QUERY,
  BRAND_BY_SLUG_QUERY,
  FLAT_SERVICES_QUERY,
  MODELS_BY_BRAND_QUERY,
  MODEL_BY_SLUG_QUERY,
  MODEL_SEARCH_INDEX_QUERY,
  MODEL_SUMMARIES_QUERY,
  BRAND_HUB_QUERY,
  POPULAR_MODELS_QUERY,
  RELATED_MODELS_QUERY,
  REPAIR_TYPES_QUERY,
  REPAIR_TYPE_BY_SLUG_QUERY,
  UNLOCKING_QUERY,
} from "./catalogue";
import {
  ALL_FAQS_QUERY,
  AUTHORS_QUERY,
  FAQS_BY_CATEGORY_QUERY,
  FAQS_FOR_QUERY,
  GLOBAL_FAQS_QUERY,
  GUIDES_QUERY,
  GUIDE_BY_SLUG_QUERY,
  SERVICE_PAGES_QUERY,
  SERVICE_PAGE_BY_SLUG_QUERY,
  TESTIMONIALS_QUERY,
} from "./content";
import { LOCATIONS_QUERY, LOCATION_BY_SLUG_QUERY, NEAREST_LOCATIONS_QUERY } from "./locations";
import { ALL_SLUGS_FOR_SITEMAP_QUERY, BRAND_PARAMS_QUERY, MODEL_PARAMS_QUERY } from "./sitemap";
import {
  NAVIGATION_QUERY,
  REDIRECTS_QUERY,
  REVIEW_SUMMARY_QUERY,
  SITE_SETTINGS_QUERY,
} from "./site";

/**
 * Typed data accessors.
 *
 * Every read from Sanity goes through one of these, so the cache tags that
 * decide what the revalidation webhook invalidates live next to the query
 * rather than being invented at each call site.
 */

/* ---------------------------------------------------------------------- site */

export function getSiteSettings() {
  return sanityFetch<SITE_SETTINGS_QUERYResult>({
    query: SITE_SETTINGS_QUERY,
    tags: [tags.global, tags.type("siteSettings")],
  });
}

export function getNavigation() {
  return sanityFetch<NAVIGATION_QUERYResult>({
    query: NAVIGATION_QUERY,
    tags: [tags.global, tags.type("navigation")],
  });
}

export function getReviewSummary() {
  return sanityFetch<REVIEW_SUMMARY_QUERYResult>({
    query: REVIEW_SUMMARY_QUERY,
    tags: [tags.global, tags.type("reviewSummary")],
  });
}

export function getRedirects() {
  return sanityFetch<REDIRECTS_QUERYResult>({
    query: REDIRECTS_QUERY,
    tags: [tags.type("redirect")],
  });
}

/* ----------------------------------------------------------------- catalogue */

export function getBrands() {
  return sanityFetch<BRANDS_QUERYResult>({
    query: BRANDS_QUERY,
    tags: [tags.type("brand")],
  });
}

export function getBrandBySlug(slug: string) {
  return sanityFetch<BRAND_BY_SLUG_QUERYResult>({
    query: BRAND_BY_SLUG_QUERY,
    params: { slug },
    tags: [tags.type("brand"), tags.doc("brand", slug), tags.brand(slug)],
  });
}

export function getModelsByBrand(brandSlug: string) {
  return sanityFetch<MODELS_BY_BRAND_QUERYResult>({
    query: MODELS_BY_BRAND_QUERY,
    params: { brandSlug },
    tags: [tags.type("deviceModel"), tags.brand(brandSlug)],
  });
}

export function getModelBySlug(slug: string) {
  return sanityFetch<MODEL_BY_SLUG_QUERYResult>({
    query: MODEL_BY_SLUG_QUERY,
    params: { slug },
    // priceEntry edits revalidate through type:priceEntry, so a price change
    // refreshes the model page without touching every other model.
    tags: [
      tags.type("deviceModel"),
      tags.doc("deviceModel", slug),
      tags.type("priceEntry"),
      tags.type("repairType"),
    ],
  });
}

export function getPopularModels(limit = 8) {
  return sanityFetch<POPULAR_MODELS_QUERYResult>({
    query: POPULAR_MODELS_QUERY,
    params: { limit },
    tags: [tags.type("deviceModel")],
  });
}

export function getAllPricedModels() {
  return sanityFetch<ALL_PRICED_MODELS_QUERYResult>({
    query: ALL_PRICED_MODELS_QUERY,
    tags: [tags.prices, tags.type("deviceModel"), tags.type("priceEntry")],
  });
}

/** Three siblings from the same brand, closest by release year first. */
export function getRelatedModels(params: {
  modelId: string;
  brandId: string;
  releaseYear: number | null;
}) {
  return sanityFetch<RELATED_MODELS_QUERYResult>({
    query: RELATED_MODELS_QUERY,
    params: {
      modelId: params.modelId,
      brandId: params.brandId,
      releaseYear: params.releaseYear ?? 0,
    },
    tags: [tags.type("deviceModel")],
  });
}

/** One brand with its published models, the ones awaiting prices, and repairs. */
export function getBrandHub(slug: string) {
  return sanityFetch<BRAND_HUB_QUERYResult>({
    query: BRAND_HUB_QUERY,
    params: { slug },
    tags: [
      tags.type("brand"),
      tags.doc("brand", slug),
      tags.brand(slug),
      tags.type("deviceModel"),
      tags.type("priceEntry"),
    ],
  });
}

/** One summary row per model, for the refactored price list. */
export function getModelSummaries() {
  return sanityFetch<MODEL_SUMMARIES_QUERYResult>({
    query: MODEL_SUMMARIES_QUERY,
    tags: [tags.prices, tags.type("deviceModel"), tags.type("priceEntry")],
  });
}

/** Name, slug and aliases for every published model. Feeds the 404 suggester. */
export function getModelSearchIndex() {
  return sanityFetch<MODEL_SEARCH_INDEX_QUERYResult>({
    query: MODEL_SEARCH_INDEX_QUERY,
    tags: [tags.type("deviceModel")],
  });
}

export function getRepairTypes() {
  return sanityFetch<REPAIR_TYPES_QUERYResult>({
    query: REPAIR_TYPES_QUERY,
    tags: [tags.type("repairType")],
  });
}

export function getRepairTypeBySlug(slug: string) {
  return sanityFetch<REPAIR_TYPE_BY_SLUG_QUERYResult>({
    query: REPAIR_TYPE_BY_SLUG_QUERY,
    params: { slug },
    tags: [tags.type("repairType"), tags.doc("repairType", slug), tags.type("priceEntry")],
  });
}

export function getFlatServices() {
  return sanityFetch<FLAT_SERVICES_QUERYResult>({
    query: FLAT_SERVICES_QUERY,
    tags: [tags.prices, tags.type("flatService")],
  });
}

export function getUnlocking() {
  return sanityFetch<UNLOCKING_QUERYResult>({
    query: UNLOCKING_QUERY,
    tags: [tags.prices, tags.type("unlockingService")],
  });
}

/* ------------------------------------------------------------------- content */

export function getGlobalFaqs(limit = 10) {
  return sanityFetch<GLOBAL_FAQS_QUERYResult>({
    query: GLOBAL_FAQS_QUERY,
    params: { limit },
    tags: [tags.type("faq")],
  });
}

/**
 * Questions filtered to one page's subject. Pass only what applies, the rest
 * default to null and drop out of the filter.
 */
export function getFaqsFor(params: {
  service?: string | null;
  model?: string | null;
  location?: string | null;
  limit?: number;
}) {
  return sanityFetch<FAQS_FOR_QUERYResult>({
    query: FAQS_FOR_QUERY,
    params: {
      service: params.service ?? null,
      model: params.model ?? null,
      location: params.location ?? null,
      limit: params.limit ?? 10,
    },
    tags: [tags.type("faq")],
  });
}

export function getFaqsByCategory(category: string) {
  return sanityFetch<FAQS_BY_CATEGORY_QUERYResult>({
    query: FAQS_BY_CATEGORY_QUERY,
    params: { category },
    tags: [tags.type("faq")],
  });
}

export function getAllFaqs() {
  return sanityFetch<ALL_FAQS_QUERYResult>({
    query: ALL_FAQS_QUERY,
    tags: [tags.type("faq")],
  });
}

export function getGuides() {
  return sanityFetch<GUIDES_QUERYResult>({
    query: GUIDES_QUERY,
    tags: [tags.type("guide")],
  });
}

export function getGuideBySlug(slug: string) {
  return sanityFetch<GUIDE_BY_SLUG_QUERYResult>({
    query: GUIDE_BY_SLUG_QUERY,
    params: { slug },
    tags: [tags.type("guide"), tags.doc("guide", slug), tags.type("faq")],
  });
}

export function getServicePages() {
  return sanityFetch<SERVICE_PAGES_QUERYResult>({
    query: SERVICE_PAGES_QUERY,
    tags: [tags.type("servicePage")],
  });
}

export function getServicePageBySlug(slug: string) {
  return sanityFetch<SERVICE_PAGE_BY_SLUG_QUERYResult>({
    query: SERVICE_PAGE_BY_SLUG_QUERY,
    params: { slug },
    tags: [tags.type("servicePage"), tags.doc("servicePage", slug), tags.type("faq")],
  });
}

/** Only reviews marked verified are ever returned. */
export function getTestimonials(limit = 6) {
  return sanityFetch<TESTIMONIALS_QUERYResult>({
    query: TESTIMONIALS_QUERY,
    params: { limit },
    tags: [tags.type("testimonial")],
  });
}

export function getAuthors() {
  return sanityFetch<AUTHORS_QUERYResult>({
    query: AUTHORS_QUERY,
    tags: [tags.type("author")],
  });
}

/* ----------------------------------------------------------------- locations */

export function getLocations() {
  return sanityFetch<LOCATIONS_QUERYResult>({
    query: LOCATIONS_QUERY,
    tags: [tags.type("location")],
  });
}

export function getLocationBySlug(slug: string) {
  return sanityFetch<LOCATION_BY_SLUG_QUERYResult>({
    query: LOCATION_BY_SLUG_QUERY,
    params: { slug },
    tags: [tags.type("location"), tags.doc("location", slug)],
  });
}

export function getNearestLocations(locationId: string) {
  return sanityFetch<NEAREST_LOCATIONS_QUERYResult>({
    query: NEAREST_LOCATIONS_QUERY,
    params: { locationId },
    tags: [tags.type("location")],
  });
}

/* ------------------------------------------------------------------- sitemap */

export function getAllSlugsForSitemap() {
  return sanityFetch<ALL_SLUGS_FOR_SITEMAP_QUERYResult>({
    query: ALL_SLUGS_FOR_SITEMAP_QUERY,
    tags: [tags.sitemap],
  });
}

export function getModelParams() {
  return sanityFetch<MODEL_PARAMS_QUERYResult>({
    query: MODEL_PARAMS_QUERY,
    tags: [tags.sitemap, tags.type("deviceModel")],
  });
}

export function getBrandParams() {
  return sanityFetch<BRAND_PARAMS_QUERYResult>({
    query: BRAND_PARAMS_QUERY,
    tags: [tags.sitemap, tags.type("brand")],
  });
}
