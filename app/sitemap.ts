import type { MetadataRoute } from "next";

import { getAllSlugsForSitemap } from "@/lib/data";
import { ROUTES, type RouteTier } from "@/lib/routes";
import { SITE_URL } from "@/lib/site";
import { listArticles } from "@/lib/uplift/client";

/**
 * /sitemap.xml, built from the same sources the pages are.
 *
 * Registered routes come from the route registry, so a page appears here the
 * moment its status flips to "built". Model pages come from the sitemap
 * accessor, which already drops unpublished and noindexed models. Blog
 * articles come from Uplift, which is why this file revalidates on the blog's
 * own window rather than being fixed at build time.
 *
 * `lastModified` is set on blog articles only. The `_updatedAt` on a model
 * record is the Sanity migration stamp, shared to the second by 97 models, and
 * no other page has a modification date at all. A wrong date is worse than
 * none: Google stops trusting lastmod across a sitemap that misuses it.
 *
 * Priorities follow CLAUDE.md Section 8.1.
 */

export const revalidate = 300;

type Entry = MetadataRoute.Sitemap[number];

const PRIORITY: Record<RouteTier, number> = {
  core: 0.6,
  "service-hub": 0.8,
  "repair-type": 0.8,
  brand: 0.8,
  local: 0.9,
  neighbourhood: 0.9,
  guide: 0.6,
  utility: 0,
  internal: 0,
};

/** Core pages that carry more weight than the core default. */
const CORE_PRIORITY: Record<string, number> = {
  "/": 1.0,
  "/services": 0.8,
  "/contact": 0.8,
  "/locations": 0.8,
  "/privacy-policy": 0.2,
  "/terms": 0.2,
};

function url(path: string): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const registered: Entry[] = ROUTES.filter(
    (entry) =>
      entry.status === "built" &&
      entry.tier !== "utility" &&
      entry.tier !== "internal" &&
      !entry.path.startsWith("/styleguide"),
  ).map((entry) => ({
    url: url(entry.path),
    changeFrequency: entry.path === "/blog" ? "daily" : "monthly",
    priority: CORE_PRIORITY[entry.path] ?? PRIORITY[entry.tier],
  }));

  const { models } = await getAllSlugsForSitemap();
  const modelEntries: Entry[] = models
    .filter((model) => model.brandSlug)
    .map((model) => ({
      url: url(`/repair/${model.brandSlug}/${model.slug}`),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  // listArticles() returns [] when the token is missing or the API is down,
  // so the sitemap degrades to the static pages rather than failing.
  const articles = await listArticles();
  const articleEntries: Entry[] = articles.map((article) => ({
    url: url(`/blog/${article.slug}`),
    lastModified: article.dateModified || article.datePublished,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...registered, ...modelEntries, ...articleEntries];
}
