/**
 * Proves the seed is idempotent.
 *
 * Fetches every seeded document, strips the fields Sanity changes on any write
 * (_rev, _createdAt, _updatedAt), sorts by _id, and hashes the result. Running
 * this before and after a second `pnpm seed` must produce the same hash: same
 * documents, same content, no duplicates.
 *
 *   pnpm exec tsx --env-file=.env.local scripts/verify-seed.ts
 */

import { createHash } from "node:crypto";

import { createReadClient } from "../sanity/lib/write-client";

const SEEDED_TYPES = [
  "siteSettings",
  "reviewSummary",
  "brand",
  "repairType",
  "deviceModel",
  "priceEntry",
  "priceGroup",
  "flatService",
  "unlockingService",
  "location",
  "faq",
];

async function main() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

  if (!projectId || !dataset) throw new Error("Sanity project id and dataset are required.");

  const client = createReadClient(process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production");

  const docs = await client.fetch<Record<string, unknown>[]>(
    `*[_type in $types] | order(_id asc)`,
    { types: SEEDED_TYPES },
  );

  const counts = new Map<string, number>();
  for (const doc of docs) {
    const type = String(doc._type);
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }

  // Volatile fields change on every write even when the content is identical.
  const stable = docs.map((doc) => {
    const { _rev, _createdAt, _updatedAt, ...rest } = doc;
    void _rev;
    void _createdAt;
    void _updatedAt;
    return rest;
  });

  const hash = createHash("sha256").update(JSON.stringify(stable)).digest("hex");

  console.log("\nSeeded documents in the dataset:");
  for (const [type, count] of [...counts].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(count).padStart(4)}  ${type}`);
  }
  console.log(`  ${String(docs.length).padStart(4)}  total`);

  /* Cross-checks that would catch a seed writing duplicates or dangling data. */
  const priceKeys = new Set<string>();
  let duplicatePairs = 0;
  let brokenPrices = 0;

  for (const doc of docs) {
    if (doc._type !== "priceEntry") continue;

    const model = (doc.model as { _ref?: string } | undefined)?._ref ?? "";
    const repair = (doc.repairType as { _ref?: string } | undefined)?._ref ?? "";
    const key = `${model}|${repair}`;
    if (priceKeys.has(key)) duplicatePairs += 1;
    priceKeys.add(key);

    const hasPrice = typeof doc.price === "number";
    const quoteOnly = doc.quoteOnly === true;
    if (hasPrice === quoteOnly) brokenPrices += 1;
  }

  console.log(`\n  duplicate model+repair pairs: ${duplicatePairs}`);
  console.log(`  prices with neither or both price and quoteOnly: ${brokenPrices}`);
  console.log(`\ncontent hash: ${hash}\n`);
}

main().catch((error) => {
  console.error("verify-seed failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
