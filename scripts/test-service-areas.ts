/**
 * The service-area regression guard.
 *
 * The "Which Calgary areas does TechBrotherz serve?" section on /locations
 * once rendered only the areas that had a published page of their own, which
 * silently filtered the Google Business Profile list of 21 areas down to a
 * single Forest Lawn card. The client reported it twice before it was traced,
 * because the full list rendered correctly in a different section of the same
 * page and on the home page, so every eyeball check passed somewhere.
 *
 * This asserts, against the rendered page, that the areas section contains a
 * tile for every entry in lib/content/service-areas.ts plus Airdrie. It fails
 * on a count mismatch or a missing name, so a filter reappearing between the
 * list and the render breaks the build instead of waiting for the client to
 * notice.
 */

import { SERVICE_AREAS } from "../lib/content/service-areas";

const BASE = process.argv[2] ?? "http://localhost:3100";

async function main() {
  const res = await fetch(`${BASE}/locations`);
  if (!res.ok) {
    console.error(`FAIL: ${BASE}/locations returned ${res.status}`);
    process.exit(1);
  }
  const html = await res.text();

  // The section is identified by its aria-labelledby anchor. Slice from the
  // heading id to the close of its <section> so tiles elsewhere on the page
  // (the footer column renders the same list) cannot satisfy the check.
  const start = html.indexOf('aria-labelledby="areas-heading"');
  if (start === -1) {
    console.error('FAIL: no section with aria-labelledby="areas-heading" on /locations');
    process.exit(1);
  }
  const end = html.indexOf("</section>", start);
  const section = html.slice(start, end === -1 ? undefined : end);

  const expected = [...SERVICE_AREAS.map((a) => a.name), "Airdrie"];
  const missing = expected.filter((name) => !section.includes(`>${name}<`));

  // Count rendered tiles: anchors inside the section.
  const rendered = (section.match(/<a\s/g) ?? []).length;

  console.log(`Service areas on /locations: ${rendered} rendered, ${expected.length} expected`);

  if (missing.length > 0) {
    console.error(`\nFAIL: ${missing.length} area(s) missing from the section:`);
    for (const name of missing) console.error(`  - ${name}`);
    process.exit(1);
  }
  if (rendered < expected.length) {
    console.error(
      `\nFAIL: only ${rendered} tiles rendered where ${expected.length} were expected.`,
    );
    process.exit(1);
  }

  // The Calgary page carries the anchored sections those tiles point at.
  // Assert every #fragment target exists, so a tile can never be a dead anchor.
  const calRes = await fetch(`${BASE}/locations/calgary`);
  const calHtml = await calRes.text();
  const fragments = [
    ...new Set(
      SERVICE_AREAS.map((a) => a.href)
        .concat("/locations/calgary#airdrie")
        .filter((href) => href.includes("#"))
        .map((href) => href.split("#")[1]),
    ),
  ];
  const deadAnchors = fragments.filter((id) => !calHtml.includes(`id="${id}"`));
  console.log(
    `Anchored area sections on /locations/calgary: ${fragments.length - deadAnchors.length}/${fragments.length} present`,
  );
  if (deadAnchors.length > 0) {
    console.error(`\nFAIL: dead area anchors on /locations/calgary: ${deadAnchors.join(", ")}`);
    process.exit(1);
  }

  console.log("\nPASS: every service area renders in the areas section on /locations.");
}

main().catch((error) => {
  console.error("FAIL:", error);
  process.exit(1);
});
