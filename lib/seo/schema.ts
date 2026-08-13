/**
 * Typed JSON-LD builders.
 *
 * Two hard rules, both carried over from the Phase 2 proof route:
 *
 * 1. A builder never emits null, undefined, an empty string, an empty array or
 *    an empty object. `compact` strips them recursively before output. This is
 *    what keeps "never invent a value" true all the way to the structured data:
 *    a field the client has not supplied is absent, not blank.
 *
 * 2. The business is defined once, under the stable @id `${SITE_URL}/#business`.
 *    Every other node references that @id rather than repeating the entity, so
 *    Google resolves one business rather than several near-duplicates.
 *
 * Pages emit a single <script type="application/ld+json"> containing a @graph
 * array. See buildGraph and components/seo/JsonLd.tsx.
 */

import { AREA_SERVED as AREA_SERVED_NAMES } from "@/lib/content/service-areas";
import { SITE_URL } from "@/lib/site";

/* ------------------------------------------------------------------ compact */

export function compact<T>(value: T): T {
  return compactValue(value) as T;
}

function compactValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    const items = value.map(compactValue).filter(isPresent);
    return items.length > 0 ? items : undefined;
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .map(([key, item]) => [key, compactValue(item)] as const)
      .filter(([, item]) => isPresent(item));

    return entries.length > 0 ? Object.fromEntries(entries) : undefined;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  return value ?? undefined;
}

function isPresent(value: unknown): boolean {
  return value !== undefined && value !== null;
}

/* ---------------------------------------------------------------------- ids */

export const BUSINESS_ID = `${SITE_URL}/#business`;
export const ORGANISATION_ID = `${SITE_URL}/#organisation`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

const SCHEMA_DAY: Record<string, string> = {
  Monday: "https://schema.org/Monday",
  Tuesday: "https://schema.org/Tuesday",
  Wednesday: "https://schema.org/Wednesday",
  Thursday: "https://schema.org/Thursday",
  Friday: "https://schema.org/Friday",
  Saturday: "https://schema.org/Saturday",
  Sunday: "https://schema.org/Sunday",
};

/*
 * The client's Google Business Profile service-area list, authoritative since
 * 2026-08, plus Airdrie which the site prose has claimed since Phase 6.
 * lib/content/service-areas.ts is the single source. Neighbourhoods are
 * Places rather than Cities; the four actual municipalities keep City.
 */
const CITIES = new Set(["Calgary", "Chestermere", "Airdrie", "Strathmore"]);
const AREA_SERVED = AREA_SERVED_NAMES.map((name) => ({
  "@type": CITIES.has(name) ? "City" : "Place",
  name,
}));

export type JsonLdNode = Record<string, unknown>;

/* ------------------------------------------------------------------- inputs */

export interface BusinessSettings {
  brandName?: string | null;
  legalName?: string | null;
  street?: string | null;
  city?: string | null;
  region?: string | null;
  postalCode?: string | null;
  country?: string | null;
  phoneRaw?: string | null;
  email?: string | null;
  googleMapsUrl?: string | null;
  googleBusinessUrl?: string | null;
  geo?: { lat?: number | null; lng?: number | null } | null;
  hours?:
    | {
        day?: string | null;
        open?: string | null;
        close?: string | null;
        closed?: boolean | null;
      }[]
    | null;
  paymentAccepted?: string[] | null;
  socialLinks?: { url?: string | null }[] | null;
  foundedYear?: number | null;
}

export interface ReviewSummaryInput {
  enabled?: boolean | null;
  ratingValue?: number | null;
  reviewCount?: number | null;
  sourceUrl?: string | null;
}

/* -------------------------------------------------------------- aggregate */

/**
 * Returns null unless the client has supplied real review data AND switched it
 * on in the Studio. Never emit an invented rating. CLAUDE.md Section 3, rule 3.
 */
export function aggregateRating(reviews?: ReviewSummaryInput | null): JsonLdNode | null {
  if (!reviews?.enabled) return null;
  if (typeof reviews.ratingValue !== "number") return null;
  if (typeof reviews.reviewCount !== "number" || reviews.reviewCount < 1) return null;
  if (!reviews.sourceUrl) return null;

  return {
    "@type": "AggregateRating",
    ratingValue: reviews.ratingValue,
    reviewCount: reviews.reviewCount,
    bestRating: 5,
    worstRating: 1,
  };
}

/* ----------------------------------------------------------------- entities */

export function organization(settings: BusinessSettings): JsonLdNode {
  return compact({
    "@type": "Organization",
    "@id": ORGANISATION_ID,
    name: settings.brandName,
    legalName: settings.legalName,
    url: SITE_URL,
    telephone: settings.phoneRaw,
    email: settings.email,
    foundingDate: settings.foundedYear ? String(settings.foundedYear) : undefined,
    sameAs: [settings.googleBusinessUrl, ...(settings.socialLinks ?? []).map((link) => link?.url)],
  });
}

export function website(settings: BusinessSettings): JsonLdNode {
  return compact({
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: settings.brandName,
    url: SITE_URL,
    inLanguage: "en-CA",
    publisher: { "@id": ORGANISATION_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/repair-prices?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  });
}

export function localBusiness(
  settings: BusinessSettings,
  reviews?: ReviewSummaryInput | null,
): JsonLdNode {
  const openingHours = (settings.hours ?? [])
    .filter((entry) => entry?.day && !entry.closed && entry.open && entry.close)
    .map((entry) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: SCHEMA_DAY[entry.day as string],
      opens: entry.open,
      closes: entry.close,
    }));

  return compact({
    "@type": "LocalBusiness",
    "@id": BUSINESS_ID,
    additionalType: ["MobilePhoneStore", "ComputerStore"],
    name: settings.brandName,
    legalName: settings.legalName,
    url: SITE_URL,
    telephone: settings.phoneRaw,
    email: settings.email,
    priceRange: "$$",
    currenciesAccepted: "CAD",
    paymentAccepted: settings.paymentAccepted,
    hasMap: settings.googleMapsUrl,
    parentOrganization: { "@id": ORGANISATION_ID },
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.street,
      addressLocality: settings.city,
      addressRegion: settings.region,
      postalCode: settings.postalCode,
      addressCountry: settings.country,
    },
    geo:
      typeof settings.geo?.lat === "number" && typeof settings.geo?.lng === "number"
        ? {
            "@type": "GeoCoordinates",
            latitude: settings.geo.lat,
            longitude: settings.geo.lng,
          }
        : undefined,
    areaServed: AREA_SERVED,
    openingHoursSpecification: openingHours,
    aggregateRating: aggregateRating(reviews) ?? undefined,
  });
}

/* -------------------------------------------------------------- breadcrumbs */

export interface BreadcrumbInput {
  label: string;
  href?: string;
}

export function breadcrumbs(items: BreadcrumbInput[]): JsonLdNode {
  const all: BreadcrumbInput[] = [{ label: "Home", href: "/" }, ...items];

  return compact({
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}/#breadcrumbs`,
    itemListElement: all.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      ...(crumb.href ? { item: crumb.href === "/" ? SITE_URL : `${SITE_URL}${crumb.href}` } : {}),
    })),
  });
}

/* ------------------------------------------------------------------ service */

export interface ServiceInput {
  name: string;
  description?: string | null;
  path: string;
  serviceType?: string | null;
  offers?: JsonLdNode[];
}

export function service(input: ServiceInput): JsonLdNode {
  return compact({
    "@type": "Service",
    "@id": `${SITE_URL}${input.path}#service`,
    name: input.name,
    description: input.description,
    serviceType: input.serviceType ?? input.name,
    url: `${SITE_URL}${input.path}`,
    provider: { "@id": BUSINESS_ID },
    areaServed: AREA_SERVED,
    hasOfferCatalog: input.offers?.length
      ? {
          "@type": "OfferCatalog",
          name: `${input.name} prices`,
          itemListElement: input.offers,
        }
      : undefined,
  });
}

/* ------------------------------------------------------------------- offers */

export interface PriceEntryLike {
  repairName: string;
  modelName?: string | null;
  price?: number | null;
  quoteOnly?: boolean | null;
  warrantyDays?: number | null;
  url?: string | null;
}

/**
 * Builds an Offer, or returns null when there is no price to state.
 *
 * Revised in Phase 4. The original plan emitted a price-less Offer for
 * quote-only repairs, on the reasoning that the repair is genuinely available.
 * An Offer without a price is invalid and Google reports it as an error, and
 * inventing a price to satisfy the shape would be worse. So a quote-only
 * repair produces no Offer at all: the page describes it with a Service node
 * carrying a ContactAction instead. See serviceWithContactAction below.
 *
 * Never emit an Offer without a price. Never invent a price to fill one.
 */
export function offerFromPriceEntry(
  entry: PriceEntryLike,
  options: { phoneRaw?: string | null; defaultWarrantyDays: number },
): JsonLdNode | null {
  if (entry.quoteOnly || typeof entry.price !== "number") return null;
  const name = entry.modelName
    ? `${entry.modelName} ${entry.repairName.toLowerCase()}`
    : entry.repairName;

  return compact({
    "@type": "Offer",
    name,
    priceCurrency: "CAD",
    price: entry.quoteOnly ? undefined : entry.price,
    availability: "https://schema.org/InStock",
    url: entry.url ? `${SITE_URL}${entry.url}` : undefined,
    seller: { "@id": BUSINESS_ID },
    areaServed: AREA_SERVED,
    warranty: {
      "@type": "WarrantyPromise",
      durationOfWarranty: {
        "@type": "QuantitativeValue",
        value: entry.warrantyDays ?? options.defaultWarrantyDays,
        unitCode: "DAY",
      },
    },
  });
}

/**
 * The node that covers quote-only repairs.
 *
 * These repairs are genuinely offered, they simply have no published price, so
 * they are described as a Service with a ContactAction pointing at the phone
 * number rather than as an Offer with a hole where the price should be.
 */
export function serviceWithContactAction(input: {
  name: string;
  description?: string | null;
  path: string;
  phoneRaw?: string | null;
  repairNames: string[];
}): JsonLdNode | null {
  if (input.repairNames.length === 0) return null;

  return compact({
    "@type": "Service",
    "@id": `${SITE_URL}${input.path}#quoted-service`,
    name: input.name,
    description: input.description,
    serviceType: input.repairNames.join(", "),
    url: `${SITE_URL}${input.path}`,
    provider: { "@id": BUSINESS_ID },
    areaServed: AREA_SERVED,
    potentialAction: {
      "@type": "ContactAction",
      name: "Call for a quote",
      target: input.phoneRaw ? `tel:${input.phoneRaw}` : `${SITE_URL}/contact`,
    },
  });
}

/**
 * An ItemList of Offers, or null when the model has no priced repair at all.
 * Null nodes are filtered out by buildGraph, so a quote-only model simply
 * emits no ItemList.
 */
export function itemListOfOffers(input: {
  name: string;
  path: string;
  offers: (JsonLdNode | null)[];
}): JsonLdNode | null {
  const offers = input.offers.filter((offer): offer is JsonLdNode => offer !== null);
  if (offers.length === 0) return null;

  return compactOffers({ ...input, offers });
}

function compactOffers(input: { name: string; path: string; offers: JsonLdNode[] }): JsonLdNode {
  return compact({
    "@type": "ItemList",
    "@id": `${SITE_URL}${input.path}#offers`,
    name: input.name,
    url: `${SITE_URL}${input.path}`,
    numberOfItems: input.offers.length,
    itemListElement: input.offers.map((offer, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: offer,
    })),
  });
}

/* ----------------------------------------------------------------- faq page */

export interface FaqInput {
  question?: string | null;
  plainAnswer?: string | null;
}

/**
 * Duplicate questions are dropped rather than emitted twice, because a FAQPage
 * with the same question listed more than once is a Rich Results warning.
 */
export function faqPage(faqs: FaqInput[], path: string): JsonLdNode | null {
  const seen = new Set<string>();
  const entities = [];

  for (const faq of faqs) {
    const question = faq.question?.trim();
    const answer = faq.plainAnswer?.trim();
    if (!question || !answer) continue;

    const key = question.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    entities.push({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    });
  }

  if (entities.length === 0) return null;

  return compact({
    "@type": "FAQPage",
    "@id": `${SITE_URL}${path}#faq`,
    mainEntity: entities,
  });
}

/* ----------------------------------------------------------- pages, article */

export function webPage(input: {
  type: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
  name: string;
  description?: string | null;
  path: string;
  /** CSS selectors an assistant can read aloud. */
  speakableSelectors?: string[];
  dateModified?: string | null;
}): JsonLdNode {
  return compact({
    "@type": input.type,
    "@id": `${SITE_URL}${input.path}#page`,
    name: input.name,
    description: input.description,
    url: `${SITE_URL}${input.path}`,
    inLanguage: "en-CA",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": BUSINESS_ID },
    dateModified: input.dateModified,
    speakable: input.speakableSelectors?.length
      ? {
          "@type": "SpeakableSpecification",
          cssSelector: input.speakableSelectors,
        }
      : undefined,
  });
}

export interface ArticleInput {
  headline: string;
  description?: string | null;
  path: string;
  datePublished?: string | null;
  dateModified?: string | null;
  authorName?: string | null;
  authorRole?: string | null;
  imageUrl?: string | null;
  about?: string[];
}

export function article(input: ArticleInput): JsonLdNode {
  return compact({
    "@type": "Article",
    "@id": `${SITE_URL}${input.path}#article`,
    headline: input.headline,
    description: input.description,
    url: `${SITE_URL}${input.path}`,
    inLanguage: "en-CA",
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    image: input.imageUrl,
    author: input.authorName
      ? { "@type": "Person", name: input.authorName, jobTitle: input.authorRole }
      : { "@id": ORGANISATION_ID },
    publisher: { "@id": ORGANISATION_ID },
    about: input.about?.map((name) => ({ "@type": "Thing", name })),
  });
}

export interface HowToStepInput {
  name: string;
  text: string;
}

export function howTo(input: {
  name: string;
  description?: string | null;
  path: string;
  steps: HowToStepInput[];
  totalMinutes?: number | null;
}): JsonLdNode | null {
  if (input.steps.length === 0) return null;

  return compact({
    "@type": "HowTo",
    "@id": `${SITE_URL}${input.path}#howto`,
    name: input.name,
    description: input.description,
    totalTime: input.totalMinutes ? `PT${input.totalMinutes}M` : undefined,
    step: input.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  });
}

/* -------------------------------------------------------------------- graph */

/**
 * Assembles one @graph. Null and undefined nodes drop out, so a page can pass
 * `aggregateRating(...)` or `faqPage(...)` straight in without a guard.
 */
export function buildGraph(nodes: (JsonLdNode | null | undefined)[]): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter((node): node is JsonLdNode => Boolean(node)),
  };
}
