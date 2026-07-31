/**
 * Proves the two guards that matter actually fire.
 *
 * Sanity runs schema validation in the Studio and in `sanity documents
 * validate`, not inside the write API, so a script can create a deliberately
 * invalid document and then have the validator catch it. That is exactly what
 * this does, and it cleans up after itself.
 *
 *   pnpm exec tsx --env-file=.env.local scripts/prove-validation.ts
 *   pnpm exec tsx --env-file=.env.local scripts/prove-validation.ts --cleanup
 *
 * Run `pnpm exec sanity documents validate` between the two to see the errors.
 */

import { createWriteClient } from "../sanity/lib/write-client";

const CLEANUP = process.argv.includes("--cleanup");

/** A price row with neither a price nor the quote-only switch. */
const INVALID_PRICE_ID = "price.__validation-probe";

/** A model published with no price and no content to stand on. */
const THIN_MODEL_ID = "model.__validation-probe";

async function main() {
  const client = createWriteClient({ dataset: process.env.NEXT_PUBLIC_SANITY_DATASET! });

  if (CLEANUP) {
    await client.delete(INVALID_PRICE_ID).catch(() => undefined);
    await client.delete(THIN_MODEL_ID).catch(() => undefined);
    console.log("Validation probes removed.");
    return;
  }

  await client.createOrReplace({
    _id: THIN_MODEL_ID,
    _type: "deviceModel",
    name: "Validation Probe Phone",
    slug: { _type: "slug", current: "validation-probe-phone" },
    brand: { _type: "reference", _ref: "brand.apple-iphone" },
    deviceType: "phone",
    // Published with no release year, no common problems, no introduction and
    // no priced repair. The thin-content guard must refuse this.
    published: true,
  });

  await client.createOrReplace({
    _id: INVALID_PRICE_ID,
    _type: "priceEntry",
    model: { _type: "reference", _ref: "model.iphone-8-plus" },
    repairType: { _type: "reference", _ref: "repairType.keyboard-replacement" },
    // Neither a price nor quoteOnly. The priceEntry guard must refuse this.
    quoteOnly: false,
    inStock: true,
  });

  console.log("Created two deliberately invalid documents:");
  console.log(`  ${THIN_MODEL_ID}     published with no price and no content`);
  console.log(`  ${INVALID_PRICE_ID}  neither a price nor quote-only`);
  console.log("\nNow run: pnpm exec sanity documents validate");
  console.log("Then clean up with: --cleanup\n");
}

main().catch((error) => {
  console.error("prove-validation failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
