/**
 * The data layer.
 *
 * Every accessor the site had when it read from Sanity, with the same name, the
 * same signature and the same returned shape, backed by the constants in
 * content/data/. Pages did not change when this replaced the query layer, which
 * is the same principle Phase 6.9 applied to the inline price refactor: a move
 * that changes every consumer is a rewrite in disguise.
 *
 * What went away with the dataset:
 *
 *   Cache tags and revalidation. A constant compiled into the bundle cannot go
 *   stale, so there is no webhook, no tag graph and no ISR window to reason
 *   about. Content changes by editing a file and deploying.
 *
 *   Draft mode. Every query carried a $draft parameter that relaxed its
 *   `published == true` filter for a Studio preview. There is no Studio, so
 *   `published` is now simply read at build time.
 *
 *   The read token. The build no longer needs credentials, which means it no
 *   longer has the failure mode where a missing token returns zero rows and
 *   still produces a complete, empty site.
 *
 * These functions stay async. They resolve immediately, but every call site
 * awaits them, and making 17 pages synchronous to save a microtask would be a
 * change to prove rather than a change worth making.
 */

export {
  getAllPricedModels,
  getAllSlugsForSitemap,
  getBrandBySlug,
  getBrandHub,
  getBrandParams,
  getBrands,
  getModelBySlug,
  getModelParams,
  getModelSearchIndex,
  getModelsByBrand,
  getModelsOfferingRepair,
  getModelSummaries,
  getPopularModels,
  getRelatedModels,
  getRepairTypeBySlug,
  getRepairTypes,
  repairsForKind,
  type BrandHub,
  type BrandWithStats,
  type HydratedModel,
  type ModelSummary,
  type RepairAcrossModels,
} from "./catalogue";

export {
  getAllFaqs,
  getAuthors,
  getFaqsByCategory,
  getFaqsFor,
  getFlatServices,
  getGlobalFaqs,
  getGuideBySlug,
  getGuides,
  getServicePageBySlug,
  getServicePages,
  getTestimonials,
  getUnlocking,
  type Faq,
} from "./content";

export { getLocationBySlug, getLocations, getNearestLocations, LOCATIONS } from "./locations";

export { getNavigation, getRedirects, getReviewSummary, getSiteSettings } from "./site";

export type {
  AuthorDoc,
  FaqDoc,
  FlatServiceDoc,
  LocationDoc,
  ModelDoc,
  ModelRepairEntry,
  ReviewSummary,
  SiteSettingsDoc,
  TestimonialDoc,
  UnlockingDoc,
} from "@/content/data/types";
