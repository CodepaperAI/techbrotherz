/**
 * Can the deleted quote-only rows be derived, or were they arbitrary?
 *
 * This is the load-bearing question of Phase 6.9. The old model page rendered
 * one row per priceEntry document, priced or not. The new one has to render
 * the same rows from a shorter array plus a code constant, which only works if
 * the set of repair types a model had rows for is exactly the set that applies
 * to its device kind.
 *
 * If they match, derivation is lossless and the page is unchanged. If they do
 * not, deriving would silently add or drop rows, and the fix is to keep the
 * applicable set per model rather than infer it.
 *
 * Reads production, which still holds every original row.
 *
 *   pnpm exec tsx --env-file=.env.local scripts/verify-derivation.ts
 */

import { createClient } from "@sanity/client";

import { repairsFor, type DeviceKind } from "../lib/content/repair-types";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
  dataset: "production",
  apiVersion: "2024-10-01",
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
});

interface Row {
  slug: string;
  name: string;
  deviceType: string | null;
  published: boolean | null;
  repairSlugs: string[];
}

async function main() {
  const models = await client.fetch<Row[]>(`
    *[_type == "deviceModel" && !(_id in path("drafts.**"))]{
      "slug": slug.current, name, deviceType, published,
      "repairSlugs": *[_type == "priceEntry" && model._ref == ^._id].repairType->slug.current
    }
  `);

  let exact = 0;
  const mismatches: { slug: string; had: string[]; applies: string[] }[] = [];

  for (const model of models) {
    const kind = (model.deviceType ?? "phone") as DeviceKind;
    const applies = repairsFor(kind)
      .map((entry) => entry.slug as string)
      .sort();
    const had = [...new Set(model.repairSlugs.filter(Boolean))].sort();

    if (had.length === 0) continue;

    if (JSON.stringify(had) === JSON.stringify(applies)) exact += 1;
    else mismatches.push({ slug: model.slug, had, applies });
  }

  console.log(
    `\n  models with rows        : ${models.filter((m) => m.repairSlugs.length > 0).length}`,
  );
  console.log(`  set matches "applies to": ${exact}`);
  console.log(`  set differs             : ${mismatches.length}\n`);

  for (const bad of mismatches.slice(0, 6)) {
    const missing = bad.applies.filter((slug) => !bad.had.includes(slug));
    const extra = bad.had.filter((slug) => !bad.applies.includes(slug));
    console.log(`  ${bad.slug}`);
    console.log(`    had ${bad.had.length}, applies ${bad.applies.length}`);
    if (missing.length) console.log(`    would ADD    : ${missing.join(", ")}`);
    if (extra.length) console.log(`    would DROP   : ${extra.join(", ")}`);
  }

  if (mismatches.length > 0) {
    console.log(
      `\n  Derivation from deviceType is NOT lossless. The applicable set must be\n` +
        `  stored per model, or every one of these pages changes.\n`,
    );
  } else {
    console.log(`  Derivation is lossless.\n`);
  }
}

main().catch((error) => {
  console.error("verify-derivation failed:", error);
  process.exit(1);
});

export {};
