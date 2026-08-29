/**
 * The Uplift AI blog API, as the only source of blog content on this site.
 *
 * The rest of the site is TypeScript constants compiled into the build, for the
 * reasons in CLAUDE.md Section 6. The blog is the one exception, because the
 * client writes and publishes articles in Uplift rather than in a pull request,
 * and a CMS the owner actually uses is worth more than a file they never open.
 *
 * Three things this module is responsible for:
 *
 * 1. **A build must never need this API.** The token is optional and an
 *    unreachable API is not a build failure: /blog renders an honest empty
 *    state and the rest of the site is untouched. That is the same rule the
 *    contact form follows. It is loud in the build log rather than silent,
 *    because an empty blog that nobody noticed is the failure mode.
 *
 * 2. **Normalising the payload.** Every field Uplift returns is optional at the
 *    boundary. An article that cannot supply a slug, a title, a date and a body
 *    is dropped rather than rendered half-built.
 *
 * 3. **The FAQ scoping rule, CLAUDE.md Section 8.8.** Uplift embeds FAQPage
 *    JSON-LD inside the article body. Those questions are already visible in
 *    the article's own FAQ section, so the schema is lifted out and emitted in
 *    the page's single @graph, capped at six and deduplicated across articles,
 *    rather than left as a second script tag the schema audit would fail on.
 *
 * The list endpoint returns the full `content` field, so the whole blog is one
 * request. The detail endpoint is the fallback for a slug published after the
 * last build, which `dynamicParams` renders on first request.
 */

import { htmlToText, toHtml } from "@/lib/uplift/render";
import type {
  Article,
  UpliftBlog,
  UpliftDetailResponse,
  UpliftListResponse,
} from "@/lib/uplift/types";

const API_BASE = (process.env.UPLIFT_API_URL ?? "https://api.upliftai.co/api/public/v1").replace(
  /\/+$/,
  "",
);

/**
 * Kept in step with the page-level `revalidate`. Uplift has no webhook, so an
 * article published there appears on the site within the hour without a
 * redeploy, which is what makes the CMS worth having.
 */
const REVALIDATE_SECONDS = 3600;

/** Uplift's own cap. */
const PAGE_LIMIT = 100;

/** CLAUDE.md Section 8.8: a page's FAQ block is at most six questions. */
const MAX_FAQS = 6;

let warned = false;

/**
 * Warns once per build rather than once per page. Twenty-seven identical lines
 * is how a real warning gets scrolled past.
 */
function warnOnce(message: string): void {
  if (warned) return;
  warned = true;
  console.warn(`[uplift] ${message}`);
}

function token(): string | null {
  const value = process.env.UPLIFT_API_TOKEN?.trim();
  return value ? value : null;
}

/**
 * One authenticated GET.
 *
 * The token goes in the Authorization header and never in the URL, which is
 * Uplift's own instruction: a token in a path leaks through browser history,
 * analytics, reverse proxies and access logs.
 */
async function request<T>(path: string): Promise<T | null> {
  const bearer = token();

  if (!bearer) {
    warnOnce(
      "UPLIFT_API_TOKEN is not set. The blog will render empty. Set it in .env.local and on the hosting project.",
    );
    return null;
  }

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: { Authorization: `Bearer ${bearer}`, Accept: "application/json" },
      next: { revalidate: REVALIDATE_SECONDS, tags: ["uplift-blog"] },
    });

    if (!response.ok) {
      warnOnce(`GET ${path} returned ${response.status}. The blog will render empty.`);
      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    warnOnce(`GET ${path} failed: ${(error as Error).message}. The blog will render empty.`);
    return null;
  }
}

/* ---------------------------------------------------------------- extraction */

/** The article's own JSON-LD, lifted out before the body is sanitised. */
function embeddedJsonLd(html: string): Record<string, unknown>[] {
  const nodes: Record<string, unknown>[] = [];

  for (const match of html.matchAll(
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    try {
      const parsed: unknown = JSON.parse(match[1] ?? "");
      for (const node of Array.isArray(parsed) ? parsed : [parsed]) {
        if (node && typeof node === "object") nodes.push(node as Record<string, unknown>);
      }
    } catch {
      // A malformed block is dropped. The article still renders.
    }
  }

  return nodes;
}

export interface ArticleFaq {
  question: string;
  answer: string;
}

/** The FAQPage questions Uplift embedded, as plain text pairs. */
function faqsFromJsonLd(nodes: Record<string, unknown>[]): ArticleFaq[] {
  const out: ArticleFaq[] = [];

  for (const node of nodes) {
    if (node["@type"] !== "FAQPage") continue;
    const entities = node.mainEntity;
    if (!Array.isArray(entities)) continue;

    for (const entity of entities) {
      if (!entity || typeof entity !== "object") continue;
      const record = entity as Record<string, unknown>;
      const question = typeof record.name === "string" ? record.name.trim() : "";
      const accepted = record.acceptedAnswer as Record<string, unknown> | undefined;
      const answerHtml = typeof accepted?.text === "string" ? accepted.text : "";
      const answer = htmlToText(answerHtml);

      if (question && answer) out.push({ question, answer });
    }
  }

  return out;
}

/**
 * Removes the parts of the body that the page chrome already renders: the
 * article's own hero image (the featured image is rendered by the template),
 * and its H1 (PageShell owns the single H1, CLAUDE.md Section 8.1).
 */
function stripDuplicatedChrome(html: string): string {
  return html
    .replace(/^\s*<figure[^>]*>[\s\S]*?<\/figure>/i, "")
    .replace(/<figure[^>]*(?:blog-hero|data-publishable-media=["']hero["'])[^>]*>[\s\S]*?<\/figure>/i, "")
    .replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/i, "");
}

/**
 * The article's own summary block, which several Uplift templates open with as
 * "Short answer" or "Quick answer". It is exactly what the AnswerBox wants, so
 * it is pulled up under the H1 and removed from the body rather than shown
 * twice. CLAUDE.md Section 8.3.
 */
function extractAnswer(html: string): { answer: string; body: string } {
  const pattern =
    /<(p|div)\b[^>]*>\s*(?:<strong>\s*)?(?:short|quick)\s+answer[.:]?\s*(?:<\/strong>\s*)?[\s\S]*?<\/\1>/i;
  const match = pattern.exec(html);

  if (match) {
    const answer = htmlToText(match[0]).replace(/^(short|quick)\s+answer[.:]?\s*/i, "");
    if (answer.length > 40) return { answer, body: html.replace(match[0], "") };
  }

  // No summary block: the article's own opening paragraph is the answer, and
  // it comes out of the body so the AnswerBox is not a second copy of it.
  const first = /<p\b[^>]*>([\s\S]*?)<\/p>/i.exec(html);
  if (first) {
    const answer = htmlToText(first[1] ?? "");
    if (answer.length > 40) return { answer, body: html.replace(first[0], "") };
  }

  return { answer: "", body: html };
}

/** ISO 8601 from the publishDate and publishTime Uplift returns separately. */
function publishedAt(blog: UpliftBlog): string | null {
  const date = blog.publishDate?.trim();
  if (!date || !/^\d{4}-\d{2}-\d{2}/.test(date)) {
    return blog.createdAt?.trim() ?? null;
  }

  const time = blog.publishTime?.trim();
  if (!time) return date;

  const padded = /^\d{2}:\d{2}$/.test(time) ? `${time}:00` : time;
  return `${date.slice(0, 10)}T${padded}`;
}

function readingTime(custom: Record<string, unknown> | null | undefined, text: string): string | null {
  const supplied = custom?.readingTime;
  if (typeof supplied === "string" && supplied.trim()) return supplied.trim();

  const words = text.split(/\s+/).filter(Boolean).length;
  if (words < 100) return null;
  return `${Math.max(1, Math.round(words / 220))} min read`;
}

function strings(value: string[] | null | undefined): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((entry) => entry?.trim()).filter((entry): entry is string => Boolean(entry)))];
}

/** Uplift's own ogUrl points at its site. The canonical here is our path. */
function normalise(blog: UpliftBlog): LoadedArticle | null {
  const slug = blog.slug?.trim().toLowerCase();
  const title = blog.title?.trim();
  const datePublished = publishedAt(blog);
  const rawContent = blog.content ?? "";

  if (!slug || !title || !datePublished || !rawContent.trim()) return null;
  // Slugs are URLs. Anything that is not lowercase, hyphenated and path-safe
  // would not round-trip through the route, so it is refused rather than fixed.
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;

  const jsonLd = embeddedJsonLd(rawContent);
  const { answer, body } = extractAnswer(stripDuplicatedChrome(rawContent));
  const html = toHtml(body);
  const text = htmlToText(html);

  const meta = blog.meta ?? {};
  const excerpt = blog.excerpt?.trim() || meta.seoDescription?.trim() || "";

  return {
    slug,
    title,
    excerpt: excerpt || answer,
    html,
    datePublished,
    dateModified:
      blog.freshness?.lastUpdatedAt?.trim() || blog.updatedAt?.trim() || datePublished,
    featuredImage: blog.featuredImage?.trim() || null,
    categories: strings(blog.categories),
    tags: strings(blog.tags),
    authorName: blog.authorName?.trim() || meta.articleAuthor?.trim() || null,
    authorUrl: blog.authorUrl?.trim() || null,
    seoTitle: meta.seoTitle?.trim() || title,
    seoDescription: meta.seoDescription?.trim() || excerpt,
    keywords: strings(meta.keywords),
    section: meta.articleSection?.trim() || blog.categories?.[0]?.trim() || null,
    readingTime: readingTime(blog.customFields, text),
    faqs: faqsFromJsonLd(jsonLd),
    answer: answer || excerpt,
  };
}

/* -------------------------------------------------------------------- public */

export interface LoadedArticle extends Article {
  /** The AnswerBox text: the article's summary block, or its opening. */
  answer: string;
  /**
   * The article's own FAQ questions, capped at six and unique across the blog.
   * Already visible in the article body, so these are emitted as structured
   * data only. CLAUDE.md Section 8.8.
   */
  faqs: ArticleFaq[];
}

/**
 * Every published article, newest first.
 *
 * Returns an empty array rather than throwing when the API is unreachable or
 * the token is unset, because a build must not depend on a third party being
 * up. The warning in the log is the signal.
 */
export async function listArticles(): Promise<LoadedArticle[]> {
  const collected: UpliftBlog[] = [];

  for (let page = 1; page <= 20; page += 1) {
    const response = await request<UpliftListResponse>(
      `/blogs?status=PUBLISH&page=${page}&limit=${PAGE_LIMIT}`,
    );

    if (!response?.success || !response.data?.blogs) break;

    collected.push(...response.data.blogs);

    const totalPages = response.data.pagination?.totalPages ?? 1;
    if (page >= totalPages) break;
  }

  const articles = collected
    // The status filter is a query parameter, so it is also asserted here:
    // a draft reaching the live site is the failure this guards against.
    .filter((blog) => (blog.status ?? "PUBLISH").toUpperCase() === "PUBLISH")
    .map(normalise)
    .filter((entry): entry is LoadedArticle => entry !== null)
    .sort((a, b) => b.datePublished.localeCompare(a.datePublished));

  /*
   * The cross-URL half of the FAQ scoping rule. The same question and answer
   * pair must never appear in structured data on two URLs, so a question is
   * kept by the first article that carries it, newest first, and dropped from
   * every later one. Deterministic, because the sort above is.
   */
  const claimed = new Set<string>();

  return articles.map((entry) => ({
    ...entry,
    faqs: entry.faqs
      .filter((faq) => {
        const key = faq.question.trim().toLowerCase();
        if (claimed.has(key)) return false;
        claimed.add(key);
        return true;
      })
      .slice(0, MAX_FAQS),
  }));
}

/**
 * One article by slug.
 *
 * Served from the list, which already carries the full body, so a blog of any
 * realistic size is one request per build. The detail endpoint is the fallback
 * for a slug published since the last build: `dynamicParams` renders it on
 * first request, and the FAQ dedupe cannot see the rest of the blog in that
 * case, so its structured FAQ is left off rather than risking a duplicate.
 */
export async function getArticle(slug: string): Promise<LoadedArticle | null> {
  const listed = (await listArticles()).find((entry) => entry.slug === slug);
  if (listed) return listed;

  const response = await request<UpliftDetailResponse>(`/blog/${encodeURIComponent(slug)}`);
  const blog = response?.success ? response.data?.blog : null;
  if (!blog || (blog.status ?? "PUBLISH").toUpperCase() !== "PUBLISH") return null;

  const article = normalise(blog);
  return article ? { ...article, faqs: [] } : null;
}

/** The three most recent articles other than this one, for the related block. */
export async function relatedArticles(slug: string, count = 3): Promise<LoadedArticle[]> {
  const all = await listArticles();
  const current = all.find((entry) => entry.slug === slug);

  // Same category first, which is the only relatedness signal the payload has.
  const scored = all
    .filter((entry) => entry.slug !== slug)
    .map((entry) => ({
      entry,
      shared: entry.categories.filter((category) => current?.categories.includes(category)).length,
    }))
    .sort((a, b) => b.shared - a.shared || b.entry.datePublished.localeCompare(a.entry.datePublished));

  return scored.slice(0, count).map((item) => item.entry);
}
