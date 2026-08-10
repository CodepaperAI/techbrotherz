import { FAQ_DOCS } from "@/content/data/faqs";
import { FLAT_SERVICE_DOCS } from "@/content/data/flat-services";
import { TESTIMONIAL_DOCS } from "@/content/data/testimonials";
import { UNLOCKING_DOCS } from "@/content/data/unlocking";
import type { AuthorDoc, FaqDoc } from "@/content/data/types";

/**
 * Questions, fixed-price services, unlocking and reviews.
 *
 * Each function names the GROQ query it replaces. The projections are kept
 * exactly, including which fields are returned, because a page that receives
 * one extra key can render one extra thing.
 */

function isLive(doc: { published?: boolean }): boolean {
  return doc.published === true;
}

function cmp(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/* -------------------------------------------------------------------- faqs */

/** FAQ_FRAGMENT: the fields an FAQ block and its FAQPage schema need. */
function project(doc: FaqDoc) {
  return {
    _id: doc._id,
    question: doc.question,
    plainAnswer: doc.plainAnswer,
    answer: doc.answer ?? null,
    category: doc.category,
    featured: doc.featured ?? null,
    order: doc.order,
  };
}

export type Faq = ReturnType<typeof project>;

const LIVE_FAQS = FAQ_DOCS.filter(isLive);

/** Replaces GLOBAL_FAQS_QUERY. Questions that suit any page. */
export async function getGlobalFaqs(limit = 10) {
  return LIVE_FAQS.filter((doc) => doc.featured === true)
    .sort((a, b) => a.order - b.order)
    .slice(0, limit)
    .map(project);
}

/**
 * Replaces FAQS_FOR_QUERY.
 *
 * The bank carries no appliesToServices, appliesToModels or appliesToLocations
 * values, so this has returned nothing for some time and the page-specific
 * questions come from lib/faq/generated.ts and lib/content/core-faqs.ts
 * instead. The filter is kept rather than stubbed, so that adding those fields
 * to a question in content/data/faqs.ts starts working immediately.
 */
export async function getFaqsFor(params: {
  service?: string | null;
  model?: string | null;
  location?: string | null;
  limit?: number;
}) {
  const { service = null, model = null, location = null, limit = 10 } = params;

  return LIVE_FAQS.filter((doc) => {
    const scoped = doc as FaqDoc & {
      appliesToServices?: string[];
      appliesToModels?: { _ref: string }[];
      appliesToLocations?: { _ref: string }[];
    };
    return (
      (service !== null && (scoped.appliesToServices ?? []).includes(service)) ||
      (model !== null && (scoped.appliesToModels ?? []).some((ref) => ref._ref === model)) ||
      (location !== null && (scoped.appliesToLocations ?? []).some((ref) => ref._ref === location))
    );
  })
    .sort((a, b) => a.order - b.order)
    .slice(0, limit)
    .map(project);
}

/** Replaces FAQS_BY_CATEGORY_QUERY. */
export async function getFaqsByCategory(category: string) {
  return LIVE_FAQS.filter((doc) => doc.category === category)
    .sort((a, b) => a.order - b.order)
    .map(project);
}

/** Replaces ALL_FAQS_QUERY: `order(category asc, order asc)`. */
export async function getAllFaqs() {
  return [...LIVE_FAQS]
    .sort((a, b) => cmp(a.category, b.category) || a.order - b.order)
    .map(project);
}

/* ---------------------------------------------------------------- services */

/** Replaces FLAT_SERVICES_QUERY: `order(order asc, name asc)`. */
export async function getFlatServices() {
  return FLAT_SERVICE_DOCS.filter(isLive)
    .sort((a, b) => a.order - b.order || cmp(a.name, b.name))
    .map((doc) => ({
      _id: doc._id,
      _updatedAt: doc._updatedAt,
      name: doc.name,
      slug: doc.slug.current,
      category: doc.category,
      description: doc.description,
      includes: doc.includes ?? null,
      turnaroundMinutes: doc.turnaroundMinutes ?? null,
      needsVerification: doc.needsVerification ?? null,
    }));
}

/** Replaces UNLOCKING_QUERY: `order(order asc, carrier asc)`. */
export async function getUnlocking() {
  return UNLOCKING_DOCS.filter(isLive)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || cmp(a.carrier, b.carrier))
    .map((doc) => ({
      _id: doc._id,
      _updatedAt: doc._updatedAt,
      carrier: doc.carrier,
      deviceType: doc.deviceType,
      turnaround: doc.turnaround ?? null,
      notes: doc.notes ?? null,
    }));
}

/* ------------------------------------------------------------ testimonials */

/**
 * Replaces TESTIMONIALS_QUERY.
 *
 * Only verified reviews are ever returned, and the array behind this is empty
 * until the client supplies real ones. An unverified or invented entry can
 * never reach a page, which is the first ground rule in CLAUDE.md.
 */
export async function getTestimonials(limit = 6) {
  return TESTIMONIAL_DOCS.filter((doc) => doc.verified === true)
    .sort((a, b) => cmp(b.date ?? "", a.date ?? ""))
    .slice(0, limit);
}

/* ------------------------------------------------------------------ unused */

/*
 * These four types never held a document. Their pages are files: the guides
 * ship as code in Phase 7, and the service pages already do, in
 * lib/content/services.ts. The accessors stay so the call sites keep compiling
 * and so nothing has to be rewritten when the guides land.
 */

export async function getGuides(): Promise<never[]> {
  return [];
}

export async function getGuideBySlug(_slug: string): Promise<null> {
  return null;
}

export async function getServicePages(): Promise<never[]> {
  return [];
}

export async function getServicePageBySlug(_slug: string): Promise<null> {
  return null;
}

export async function getAuthors(): Promise<AuthorDoc[]> {
  return [];
}
