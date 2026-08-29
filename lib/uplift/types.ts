/**
 * The shapes the Uplift AI public blog API returns.
 *
 * Every field is optional at the boundary, because a payload we do not control
 * is a payload that can change. lib/uplift/client.ts narrows these into the
 * `Article` shape the pages consume, and drops anything it cannot trust.
 */

export interface UpliftFreshness {
  lastUpdatedAt?: string | null;
  ageDays?: number | null;
  needsRefresh?: boolean | null;
  freshnessThresholdDays?: number | null;
}

export interface UpliftMeta {
  seoTitle?: string | null;
  seoDescription?: string | null;
  focusKeyword?: string | null;
  keywords?: string[] | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogType?: string | null;
  ogUrl?: string | null;
  ogSiteName?: string | null;
  ogLocale?: string | null;
  articleAuthor?: string | null;
  articleSection?: string | null;
  articleTags?: string[] | null;
}

export interface UpliftAnalytics {
  contentQualityScore?: number | null;
  rankingPotential?: string | null;
  conversionPotential?: string | null;
  externalLinksCount?: number | null;
}

/** One blog record, as the list and detail endpoints return it. */
export interface UpliftBlog {
  id?: string | null;
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  content?: string | null;
  status?: string | null;
  publishDate?: string | null;
  publishTime?: string | null;
  featuredImage?: string | null;
  categories?: string[] | null;
  tags?: string[] | null;
  seoScore?: number | null;
  analytics?: UpliftAnalytics | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  authorName?: string | null;
  authorUrl?: string | null;
  freshness?: UpliftFreshness | null;
  meta?: UpliftMeta | null;
  customFields?: Record<string, unknown> | null;
}

export interface UpliftPagination {
  page?: number | null;
  limit?: number | null;
  total?: number | null;
  totalPages?: number | null;
}

export interface UpliftListResponse {
  success?: boolean;
  error?: string;
  data?: { blogs?: UpliftBlog[] | null; pagination?: UpliftPagination | null } | null;
}

export interface UpliftDetailResponse {
  success?: boolean;
  error?: string;
  data?: { blog?: UpliftBlog | null } | null;
}

/* ------------------------------------------------------------------ our side */

/**
 * The normalised article the blog pages render. Every field here is present
 * and trustworthy: `articles()` drops any record that cannot fill the four
 * that are load-bearing (slug, title, published date, content).
 */
export interface Article {
  slug: string;
  title: string;
  /** Card summary and the AnswerBox answer. Falls back to the meta description. */
  excerpt: string;
  /** Sanitised HTML, ready for dangerouslySetInnerHTML. Detail fetches only. */
  html: string;
  /** ISO date, publishDate joined with publishTime where both are present. */
  datePublished: string;
  /** ISO timestamp from freshness.lastUpdatedAt or updatedAt. */
  dateModified: string;
  featuredImage: string | null;
  categories: string[];
  tags: string[];
  authorName: string | null;
  authorUrl: string | null;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  section: string | null;
  /** Estimated from the article body, or read from customFields.readingTime. */
  readingTime: string | null;
}
