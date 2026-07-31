"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { Card } from "@/components/primitives/Card";

export interface ModelIndexEntry {
  name: string | null;
  slug: string | null;
  brandSlug: string | null;
  aliases: string[] | null;
}

export interface NotFoundSuggestionsProps {
  models: ModelIndexEntry[];
  /** True once /repair/[brand]/[model] exists. Until then, deep-link the price list. */
  modelRoutesBuilt: boolean;
}

/** Everything a comparison should ignore: case, punctuation and spacing. */
function normalise(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

/**
 * Similarity between the attempted path and a model, as a small integer score.
 *
 * Deliberately simple: exact and containment matches on the name, the slug and
 * every alias, plus a token overlap fallback. A fuzzy edit-distance library
 * would score better on typos but is not worth a dependency for a 404 page,
 * and containment already catches the common case of someone typing or being
 * linked to "/iphone-8-plus-screen" or "/repair/iphone8plus".
 */
function score(attempt: string, model: ModelIndexEntry): number {
  const haystacks = [model.name ?? "", model.slug ?? "", ...(model.aliases ?? [])]
    .filter(Boolean)
    .map(normalise);

  const needle = normalise(attempt);
  if (!needle) return 0;

  let best = 0;

  for (const hay of haystacks) {
    if (!hay) continue;
    if (hay === needle) best = Math.max(best, 100);
    else if (needle.includes(hay) && hay.length >= 4) best = Math.max(best, 60 + hay.length);
    else if (hay.includes(needle) && needle.length >= 4) best = Math.max(best, 40 + needle.length);
  }

  if (best === 0) {
    // Token overlap, so "/samsung-galaxy-s7-repair" still reaches the S7.
    const tokens = attempt
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length > 1);
    const name = (model.name ?? "").toLowerCase();
    const hits = tokens.filter((token) => name.includes(token)).length;
    if (hits > 0) best = hits * 5;
  }

  return best;
}

/**
 * Suggests the three closest models to whatever the visitor actually typed.
 *
 * The path is only knowable in the browser for an unmatched route, so the
 * server hands down the model index and the matching happens after mount. The
 * page is useful without JavaScript too: the links below the suggestions are
 * server-rendered.
 */
export function NotFoundSuggestions({ models, modelRoutesBuilt }: NotFoundSuggestionsProps) {
  const [path, setPath] = useState<string | null>(null);

  useEffect(() => {
    setPath(window.location.pathname);
  }, []);

  const matches = useMemo(() => {
    if (!path) return [];

    return models
      .map((model) => ({ model, value: score(path, model) }))
      .filter((entry) => entry.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 3)
      .map((entry) => entry.model);
  }, [path, models]);

  if (matches.length === 0) return null;

  return (
    <Card className="mt-10">
      <h2 className="type-h3 text-tb-text">Were you looking for one of these?</h2>
      <p className="type-body text-tb-muted mt-2">
        These are the closest devices in the TechBrotherz repair catalogue to the address you tried.
      </p>

      <ul className="divide-tb-border mt-5 divide-y">
        {matches.map((model) => {
          const href =
            modelRoutesBuilt && model.brandSlug
              ? `/repair/${model.brandSlug}/${model.slug}`
              : `/repair-prices#model-${model.slug}`;

          return (
            <li key={model.slug}>
              <Link
                href={href}
                className="group text-tb-text hover:text-tb-green-deep flex items-center justify-between gap-4 py-3"
              >
                <span className="group-hover:underline">{model.name} repair prices</span>
                <ArrowUpRight
                  aria-hidden="true"
                  size={16}
                  strokeWidth={1.5}
                  className="text-tb-muted group-hover:text-tb-green-deep shrink-0"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
