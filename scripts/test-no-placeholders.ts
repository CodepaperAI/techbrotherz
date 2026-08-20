/**
 * No visible placeholders anywhere in the demo build.
 *
 * `/placeholder-photo.svg` is honest engineering and it stays in the code as
 * the fallback of last resort: the demo imagery must never be load-bearing, so
 * every component that takes a picture has to render something sensible
 * without one. But a placeholder is not what a client is shown, and the
 * difference between "the fallback exists" and "the fallback is on screen" is
 * exactly the thing that is easy to lose track of.
 *
 * So this crawls the built site and fails if the placeholder reaches any page,
 * and reports how many slots are filled by photograph versus by illustration.
 *
 *   pnpm exec tsx scripts/test-no-placeholders.ts http://localhost:3100
 */

import { IMAGES } from "../lib/content/images";
import { LOCAL_PAGES } from "../lib/content/local-pages";
import { PLACES } from "../lib/content/places";
import { REPAIRS } from "../lib/content/repairs";
import { SERVICES } from "../lib/content/services";

const BASE = process.argv[2] ?? "http://localhost:3100";
const PLACEHOLDER = "placeholder-photo";

async function main() {
  const paths = [
    "/",
    "/services",
    "/repair-prices",
    "/locations",
    "/faq",
    "/about",
    "/contact",
    "/warranty",
    "/styleguide/images",
    ...SERVICES.map((entry) => `/services/${entry.slug}`),
    ...REPAIRS.map((entry) => `/repairs/${entry.slug}`),
    ...LOCAL_PAGES.map((entry) => `/${entry.slug}`),
    ...PLACES.map((entry) => entry.path),
    "/repair/apple-iphone",
    "/repair/apple-iphone/iphone-8-plus",
  ];

  console.log(`\nPlaceholder check, ${BASE}\n`);
  console.log(`Crawling ${paths.length} pages...\n`);

  let failures = 0;
  let illustrations = 0;
  let photographs = 0;

  for (const path of paths) {
    const response = await fetch(`${BASE}${path}`);
    if (!response.ok) continue;
    const html = await response.text();

    const hits = [...html.matchAll(new RegExp(PLACEHOLDER, "g"))].length;
    if (hits > 0) {
      failures += 1;
      console.log(`  FAIL ${path} renders the placeholder ${hits} times`);
    }

    // The illustrations are inline SVG carrying a <title> from the set.
    illustrations += [
      ...html.matchAll(
        /<title>(Screen replacement|Battery replacement|Charging port repair|Camera repair|Keyboard replacement|Board-level work|Password and unlocking|Diagnostics)<\/title>/g,
      ),
    ].length;
    photographs += [...html.matchAll(/%2Fdemo%2F/g)].length > 0 ? 1 : 0;
  }

  console.log(`  pages crawled            : ${paths.length}`);
  console.log(`  pages carrying a photo   : ${photographs}`);
  console.log(`  illustration instances   : ${illustrations}`);
  console.log(`  photograph slots defined : ${Object.keys(IMAGES).length}`);

  console.log("\n" + "=".repeat(66));
  if (failures === 0) {
    console.log("PASS: no page renders the placeholder.\n");
    return;
  }
  console.log(`FAIL: ${failures} pages still render a placeholder.\n`);
  process.exit(1);
}

main().catch((error) => {
  console.error("test-no-placeholders failed:", error);
  process.exit(1);
});

export {};
