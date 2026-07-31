/**
 * Document counts by type, across two datasets.
 *
 * Run before migrating staging, to prove the copy is faithful, and after, to
 * prove the migration did what it said.
 *
 *   pnpm exec tsx --env-file=.env.local scripts/compare-datasets.ts production staging
 */

import { createReadClient } from "../sanity/lib/write-client";

const [, , A = "production", B = "staging"] = process.argv;

async function counts(dataset: string) {
  const rows = await createReadClient(dataset).fetch<{ _type: string }[]>(
    `*[!(_id in path("drafts.**")) && !(_type match "system.*")]{_type}`,
  );
  const by = new Map<string, number>();
  for (const row of rows) by.set(row._type, (by.get(row._type) ?? 0) + 1);
  return by;
}

async function main() {
  const [left, right] = await Promise.all([counts(A), counts(B)]);
  const types = [...new Set([...left.keys(), ...right.keys()])].sort();

  console.log(`\n  type                      ${A.padEnd(12)} ${B}`);
  console.log("  " + "-".repeat(52));

  let drift = 0;
  let totalA = 0;
  let totalB = 0;

  for (const type of types) {
    const a = left.get(type) ?? 0;
    const b = right.get(type) ?? 0;
    totalA += a;
    totalB += b;
    const flag = a === b ? "" : "   <-- differs";
    if (a !== b) drift += 1;
    console.log(
      `  ${type.padEnd(25)} ${String(a).padStart(5)}        ${String(b).padStart(5)}${flag}`,
    );
  }

  console.log("  " + "-".repeat(52));
  console.log(
    `  ${"TOTAL".padEnd(25)} ${String(totalA).padStart(5)}        ${String(totalB).padStart(5)}`,
  );

  console.log(`\n  ${drift === 0 ? "Identical by type." : `${drift} types differ.`}\n`);
}

main().catch((error) => {
  console.error("compare-datasets failed:", error);
  process.exit(1);
});

export {};
