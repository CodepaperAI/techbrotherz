/**
 * Full document census against the Phase 6.9 baseline.
 *
 * A permission probe wrote a document into production during Part 2 and was
 * caught by a FAQ count that looked one too high. Catching it was luck of the
 * right shape; relying on catching it is not a control. This checks every
 * type against the recorded baseline, so "production is clean" is a
 * measurement rather than an impression.
 *
 *   pnpm exec tsx --env-file=.env.local scripts/census-production.ts
 */

import { createClient } from "@sanity/client";

/** Taken before anything in Phase 6.9 touched the dataset. 917 content documents. */
export const BASELINE: Record<string, number> = {
  priceEntry: 685,
  deviceModel: 156,
  faq: 20,
  repairType: 16,
  location: 11,
  flatService: 10,
  brand: 9,
  priceGroup: 7,
  reviewSummary: 1,
  siteSettings: 1,
  unlockingService: 1,
};

const DATASET = process.argv[2] ?? "production";

async function main() {
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
    dataset: DATASET,
    apiVersion: "2024-10-01",
    token: process.env.SANITY_API_READ_TOKEN,
    useCdn: false,
  });

  const rows = await client.fetch<{ _type: string; _id: string }[]>(
    `*[!(_id in path("drafts.**")) && !(_type match "system.*")]{_type, _id}`,
  );

  const actual = new Map<string, number>();
  for (const row of rows) actual.set(row._type, (actual.get(row._type) ?? 0) + 1);

  const types = [...new Set([...Object.keys(BASELINE), ...actual.keys()])].sort();

  console.log(`\nCensus of "${DATASET}" against the Phase 6.9 baseline\n`);
  console.log("  type                      baseline   actual   drift");
  console.log("  " + "-".repeat(52));

  let drift = 0;
  let total = 0;

  for (const type of types) {
    const expected = BASELINE[type] ?? 0;
    const found = actual.get(type) ?? 0;
    total += found;
    const delta = found - expected;
    if (delta !== 0) drift += 1;
    console.log(
      `  ${type.padEnd(25)} ${String(expected).padStart(6)}  ${String(found).padStart(7)}  ` +
        `${delta === 0 ? "  ok" : `${delta > 0 ? "+" : ""}${delta}  <-- DRIFT`}`,
    );
  }

  const baselineTotal = Object.values(BASELINE).reduce((sum, n) => sum + n, 0);
  console.log("  " + "-".repeat(52));
  console.log(
    `  ${"TOTAL".padEnd(25)} ${String(baselineTotal).padStart(6)}  ${String(total).padStart(7)}  ` +
      `${total === baselineTotal ? "  ok" : `${total - baselineTotal > 0 ? "+" : ""}${total - baselineTotal}`}`,
  );

  /* Anything created by a probe would carry an id that is not a seeded one. */
  const suspicious = rows.filter((row) => /probe|test|tmp|fixture/i.test(row._id));
  if (suspicious.length > 0) {
    console.log(`\n  Suspicious ids:`);
    for (const row of suspicious) console.log(`    ${row._id}  (${row._type})`);
  }

  console.log(
    `\n  ${drift === 0 && suspicious.length === 0 ? "Clean. Matches baseline exactly." : `${drift} types drift.`}\n`,
  );

  if (drift > 0 || suspicious.length > 0) process.exit(1);
}

main().catch((error) => {
  console.error("census failed:", error);
  process.exit(1);
});
