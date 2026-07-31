/**
 * Proves the on-demand revalidation webhook works end to end.
 *
 * 1. Reads the current iPhone 8 Plus screen price from the running site.
 * 2. Changes that price in Sanity.
 * 3. Sends a correctly signed webhook to /api/revalidate.
 * 4. Reads the site again and checks the new price is live.
 * 5. Puts the original price back and revalidates once more.
 *
 * No redeploy anywhere in that sequence.
 *
 *   pnpm exec tsx --env-file=.env.local scripts/prove-revalidate.ts http://localhost:3100
 */

import { createHmac } from "node:crypto";

import { createWriteClient } from "../sanity/lib/write-client";

const SITE = process.argv[2] ?? "http://localhost:3000";
const PRICE_ID = "price.iphone-8-plus.screen-replacement";
const PROBE_PRICE = 111.11;

/**
 * Sanity signs webhooks as `t=<timestamp>,v1=<base64url hmac of
 * "timestamp.body">`. Reproducing that here is what makes this a real test of
 * the signature check rather than a bypass of it.
 */
function signBody(body: string, secret: string): string {
  const timestamp = Date.now();
  const hmac = createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("base64url");
  return `t=${timestamp},v1=${hmac}`;
}

async function priceOnSite(): Promise<string | null> {
  const response = await fetch(`${SITE}/styleguide/data`, { cache: "no-store" });
  const html = await response.text();
  const match =
    /iPhone 8 Plus[\s\S]{0,4000}?Screen \/ LCD replacement[\s\S]{0,400}?\$([\d,.]+)/.exec(html);
  return match?.[1] ?? null;
}

async function revalidate(secret: string) {
  const body = JSON.stringify({
    _type: "priceEntry",
    _id: PRICE_ID,
    modelSlug: "iphone-8-plus",
    brandSlug: "apple-iphone",
  });

  const response = await fetch(`${SITE}/api/revalidate`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "sanity-webhook-signature": signBody(body, secret),
    },
    body,
  });

  return { status: response.status, json: await response.json() };
}

async function main() {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) throw new Error("SANITY_REVALIDATE_SECRET is required.");

  const client = createWriteClient({ dataset: process.env.NEXT_PUBLIC_SANITY_DATASET! });

  const original = await client.fetch<number>(`*[_id == $id][0].price`, { id: PRICE_ID });
  console.log(`Original price in Sanity:      $${original}`);
  console.log(`Price rendered on the site:    $${await priceOnSite()}`);

  console.log("\nRejecting an unsigned request first:");
  const unsigned = await fetch(`${SITE}/api/revalidate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ _type: "priceEntry" }),
  });
  console.log(`  unsigned POST -> ${unsigned.status} ${(await unsigned.json()).message}`);

  const badSignature = await fetch(`${SITE}/api/revalidate`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "sanity-webhook-signature": "t=1,v1=not-a-real-signature",
    },
    body: JSON.stringify({ _type: "priceEntry" }),
  });
  console.log(`  bad signature -> ${badSignature.status} ${(await badSignature.json()).message}`);

  console.log(`\nChanging the price in Sanity to $${PROBE_PRICE}...`);
  await client.patch(PRICE_ID).set({ price: PROBE_PRICE }).commit();

  const before = await priceOnSite();
  console.log(`  site before revalidating:    $${before}  (still the cached value)`);

  const result = await revalidate(secret);
  console.log(`\nSigned webhook -> ${result.status}`);
  console.log(`  tags revalidated: ${(result.json as { tags: string[] }).tags.join(", ")}`);

  const after = await priceOnSite();
  console.log(`  site after revalidating:     $${after}`);

  console.log(`\nRestoring the original price of $${original}...`);
  await client.patch(PRICE_ID).set({ price: original }).commit();
  await revalidate(secret);
  console.log(`  site restored to:            $${await priceOnSite()}`);

  const worked = after === String(PROBE_PRICE);
  console.log(
    `\n${worked ? "PASS" : "FAIL"}: the price changed on the live site without a redeploy.\n`,
  );
  if (!worked) process.exit(1);
}

main().catch((error) => {
  console.error("prove-revalidate failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
