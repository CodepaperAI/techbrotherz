import type { PortableTextBlock } from "@portabletext/types";

/**
 * Per-model SEO copy, moved out of Sanity in Phase 6.9.
 *
 * Rule 1: if the shop owner will not edit it, it does not belong in a CMS.
 * Eighty-four model introductions, their common-issue lists and their
 * repair-or-replace verdicts are copy we wrote, and the similarity detector
 * and the word-count check run over it in a pull request. Behind a CMS it was
 * 84 pages of prose the owner would never touch and a way to break the thing
 * six phases went into getting right.
 *
 * The Phase 4 thin-content guard was a Sanity validation rule. It becomes a
 * build-time check here, with three outcomes rather than two:
 *
 *   full  a content file exists, so the page renders the whole template
 *   lean  prices but no copy, so the page renders the price table, what is
 *         included, the warranty, the turnaround and the CTA. A real page,
 *         just a short one, and honest about it rather than padded
 *   fail   neither prices nor copy, so the build stops and names the slug
 *
 * The lean tier is what makes the owner's workflow work. They add a Pixel 9
 * with prices in the Studio, the page exists that day, and we write the full
 * copy in the next pull request.
 */

export interface ModelContent {
  slug: string;
  name: string;
  /** Portable text, kept in the shape Sanity stored so rendering is unchanged. */
  intro: PortableTextBlock[] | null;
  commonIssues: string[];
  verdict: PortableTextBlock[] | null;
  repairNotes: PortableTextBlock[] | null;
  lastSupportedOs: string | null;
  stillReceivesUpdates: boolean | null;
}

export type ModelTier = "full" | "lean";

/**
 * Content files are imported eagerly at build so a missing file is a build
 * concern rather than a runtime one. The generated index keeps this a plain
 * static import map, which is what lets `pnpm build` fail on a model that has
 * neither prices nor copy.
 */
import { MODEL_CONTENT } from "@/content/models/index";

export function modelContent(slug: string): ModelContent | undefined {
  return MODEL_CONTENT[slug];
}

export function hasModelContent(slug: string): boolean {
  return Boolean(MODEL_CONTENT[slug]);
}

/**
 * Which template a model gets, or an error naming the slug.
 *
 * Called during `generateStaticParams`, so a model with neither prices nor
 * copy stops the build with a list rather than shipping a stub page.
 */
export function tierFor(input: { slug: string; pricedCount: number }): ModelTier | null {
  if (hasModelContent(input.slug)) return "full";
  if (input.pricedCount > 0) return "lean";
  return null;
}

export interface TierSummary {
  full: string[];
  lean: string[];
  failed: string[];
}

/** Classifies every model and reports, for the build summary. */
export function summarise(models: { slug: string; pricedCount: number }[]): TierSummary {
  const summary: TierSummary = { full: [], lean: [], failed: [] };

  for (const model of models) {
    const tier = tierFor(model);
    if (tier === "full") summary.full.push(model.slug);
    else if (tier === "lean") summary.lean.push(model.slug);
    else summary.failed.push(model.slug);
  }

  return summary;
}

/**
 * Prints the build summary and throws when a model cannot render honestly.
 *
 * Failing the build is deliberate. A model with no prices and no copy has
 * nothing true to say, and the alternative is a stub page that exists only to
 * be indexed, which is the thin-content liability the guard has existed to
 * prevent since Phase 2.
 */
export function assertBuildable(models: { slug: string; pricedCount: number }[]): TierSummary {
  const summary = summarise(models);

  console.log(
    `\n  Model pages: ${summary.full.length} full, ${summary.lean.length} lean` +
      `${summary.failed.length > 0 ? `, ${summary.failed.length} unbuildable` : ""}`,
  );

  if (summary.lean.length > 0) {
    console.log(`  Awaiting copy from us: ${summary.lean.join(", ")}`);
  }

  if (summary.failed.length > 0) {
    throw new Error(
      `These models have neither a published price nor a content file, so they cannot render ` +
        `an honest page:\n  ${summary.failed.join("\n  ")}\n\n` +
        `Either add a price in the Studio, which gives them a lean page, or add ` +
        `content/models/<slug>.ts, which gives them the full template.`,
    );
  }

  return summary;
}
