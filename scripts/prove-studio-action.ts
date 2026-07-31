/**
 * Exercises the "Add standard repairs" Studio action headlessly.
 *
 * Runs the exact queries and the exact transaction that
 * sanity/actions/addStandardRepairs.tsx performs, so the behaviour is proven
 * even though the button itself lives in the browser. Cleans up afterwards so
 * the dataset returns to its seeded state.
 *
 *   pnpm exec tsx --env-file=.env.local scripts/prove-studio-action.ts
 */

import { createWriteClient } from "../sanity/lib/write-client";

const MODEL_SLUG = "iphone-16";
const MODEL_ID = `model.${MODEL_SLUG}`;

interface RepairTypeRow {
  _id: string;
  name: string;
  slug: string;
}

async function main() {
  const client = createWriteClient({ dataset: process.env.NEXT_PUBLIC_SANITY_DATASET! });

  const model = await client.fetch<{ name: string; deviceType: string } | null>(
    `*[_id == $id][0]{name, deviceType}`,
    { id: MODEL_ID },
  );
  if (!model) throw new Error(`${MODEL_ID} not found. Run pnpm seed first.`);

  const before = await client.fetch<number>(
    `count(*[_type == "priceEntry" && model._ref == $id])`,
    { id: MODEL_ID },
  );
  console.log(`${model.name} (${model.deviceType}) starts with ${before} price rows.`);

  /* --- exactly what the action does ----------------------------------- */

  const repairTypes = await client.fetch<RepairTypeRow[]>(
    `*[_type == "repairType" && $deviceType in appliesTo] | order(order asc){
      _id, name, "slug": slug.current
    }`,
    { deviceType: model.deviceType },
  );

  const existing = await client.fetch<string[]>(
    `*[_type == "priceEntry" && model._ref == $modelId].repairType._ref`,
    { modelId: MODEL_ID },
  );
  const already = new Set(existing);
  const toCreate = repairTypes.filter((repair) => !already.has(repair._id));

  console.log(
    `${repairTypes.length} repair types apply to a ${model.deviceType}, ${toCreate.length} are missing.`,
  );

  const transaction = client.transaction();
  for (const repair of toCreate) {
    transaction.createIfNotExists({
      _id: `price.${MODEL_SLUG}.${repair.slug}`,
      _type: "priceEntry",
      model: { _type: "reference", _ref: MODEL_ID },
      repairType: { _type: "reference", _ref: repair._id },
      quoteOnly: true,
      inStock: true,
    });
  }
  await transaction.commit();

  const after = await client.fetch<number>(`count(*[_type == "priceEntry" && model._ref == $id])`, {
    id: MODEL_ID,
  });
  console.log(
    `After the action: ${after} price rows. Added: ${toCreate.map((r) => r.name).join(", ")}`,
  );

  /* --- running it twice must add nothing ------------------------------ */

  const existingAgain = await client.fetch<string[]>(
    `*[_type == "priceEntry" && model._ref == $modelId].repairType._ref`,
    { modelId: MODEL_ID },
  );
  const secondRun = repairTypes.filter((repair) => !new Set(existingAgain).has(repair._id));
  console.log(`Running it a second time would add ${secondRun.length} rows.`);

  /* --- restore the seeded state --------------------------------------- */

  const cleanup = client.transaction();
  for (const repair of toCreate) cleanup.delete(`price.${MODEL_SLUG}.${repair.slug}`);
  await cleanup.commit();

  const restored = await client.fetch<number>(
    `count(*[_type == "priceEntry" && model._ref == $id])`,
    { id: MODEL_ID },
  );
  console.log(`Cleaned up, back to ${restored} price rows.`);

  const pass = after === before + toCreate.length && secondRun.length === 0 && restored === before;
  console.log(
    `\n${pass ? "PASS" : "FAIL"}: add standard repairs creates the missing rows and is safe to re-run.\n`,
  );
  if (!pass) process.exit(1);
}

main().catch((error) => {
  console.error("prove-studio-action failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
