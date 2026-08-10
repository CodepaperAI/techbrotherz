/**
 * Writes content/archive/prices-2026-08.ts from the live content files.
 *
 * Run once, before the prices are stripped. Reversing the client's decision
 * should be an afternoon of work, not a re-entry job from a printed list.
 *
 *   pnpm exec tsx scripts/build-price-archive.ts
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

function load<T>(file: string): T {
  const src = readFileSync(file, "utf8");
  return JSON.parse(src.slice(src.indexOf("= ") + 2, src.lastIndexOf(" as unknown as")));
}

interface RawModel {
  name: string;
  slug: { current: string };
  brandSlug: string;
  repairs?: { repair: string; price?: number; note?: string; needsVerification?: boolean }[];
}
interface RawFlat {
  name: string;
  slug: { current: string };
  price?: number;
  priceTo?: number;
  description: string;
}
interface RawUnlock {
  carrier: string;
  price: number;
}

function main() {
  const models = load<RawModel[]>("content/data/models.ts");
  const flat = load<RawFlat[]>("content/data/flat-services.ts");
  const unlocking = load<RawUnlock[]>("content/data/unlocking.ts");

  const modelPrices = models
    .map((model) => ({
      slug: model.slug.current,
      name: model.name,
      brandSlug: model.brandSlug,
      repairs: (model.repairs ?? [])
        .filter((entry) => typeof entry.price === "number")
        .map((entry) => ({
          repair: entry.repair,
          price: entry.price as number,
          ...(entry.needsVerification ? { needsVerification: true } : {}),
        })),
    }))
    .filter((model) => model.repairs.length > 0);

  const priced = modelPrices.reduce((n, m) => n + m.repairs.length, 0);

  const body = `/**
 * ARCHIVED PRICES. Nothing imports this file.
 *
 * The client decided in August 2026 that no price appears anywhere on the site.
 * Phases 7a-i, 7a-i-b and 7a-ii removed every figure from the copy, the data and
 * the structured data. This file is the record, so that reversing the decision
 * is an afternoon of work rather than re-entering a printed price list.
 *
 * WHAT IS CHEAPEST TO RESTORE, IF THE CLIENT RECONSIDERS
 *
 * Two items need no diagnosis, so "it depends" was never true of them and they
 * were the strongest quotable facts on the site:
 *
 *   1. The carrier unlock. One figure, any Canadian carrier, no inspection.
 *      CLAUDE.md Section 8.4 named it as a unique GEO asset.
 *   2. The ten flat computer services. Each is a fixed job at a fixed figure,
 *      agreed before work starts, and they are what made the computer pages
 *      concrete rather than generic.
 *
 * Restoring either is: put the number back in content/data/, add the figure to
 * the relevant copy, and re-emit the Offer nodes in lib/seo/schema.ts. The model
 * prices below are a larger job and were always the weaker asset, because they
 * genuinely do depend on the handset and the damage.
 *
 * Archived ${modelPrices.length} models carrying ${priced} priced repairs,
 * ${flat.length} flat services and ${unlocking.length} unlocking entry.
 */

export const ARCHIVED_MODEL_PRICES = ${JSON.stringify(modelPrices, null, 2)} as const;

export const ARCHIVED_FLAT_SERVICES = ${JSON.stringify(
    flat.map((entry) => ({
      slug: entry.slug.current,
      name: entry.name,
      price: entry.price ?? null,
      priceTo: entry.priceTo ?? null,
      description: entry.description,
    })),
    null,
    2,
  )} as const;

export const ARCHIVED_UNLOCKING = ${JSON.stringify(
    unlocking.map((entry) => ({ carrier: entry.carrier, price: entry.price })),
    null,
    2,
  )} as const;
`;

  mkdirSync("content/archive", { recursive: true });
  writeFileSync("content/archive/prices-2026-08.ts", body, "utf8");

  console.log(
    `Archived ${modelPrices.length} models / ${priced} priced repairs, ` +
      `${flat.length} flat services, ${unlocking.length} unlocking entry.`,
  );
}

main();

export {};
