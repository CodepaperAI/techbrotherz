/**
 * Asserts that no price appears in prose, and that nothing clickable promises
 * one.
 *
 * Phase 7a-i removed prices from the copy. The price tables and the JSON-LD
 * still carry them, and that is expected until 7a-ii; so this deliberately
 * excludes <table> elements and ld+json blocks and checks everything else:
 * the AnswerBox, the key facts, the section prose, the FAQ answers and the
 * meta description.
 *
 * A price is a dollar sign followed by digits. That is narrower than "any
 * number", because "about 30 minutes" and "60-day warranty" are exactly the
 * facts the copy now leads with.
 *
 * **The third check is about the promise rather than the figure.** Six service
 * cards on the home page read "Phone repair details and prices" for months
 * after the prices came out, and the first two checks could not see it: there is
 * no dollar sign in "and prices". A link that offers a price the target page
 * does not carry is the same broken promise as a price in a sentence, so every
 * anchor, button and aria-label on the page is checked for the word itself.
 * This one runs over the whole document rather than <main>, because the header
 * and the footer are exactly where that phrasing survives longest.
 *
 *   pnpm exec tsx scripts/test-no-prose-prices.ts http://localhost:3100
 */

import { readdirSync } from "node:fs";
import path from "node:path";

const BASE = process.argv[2] ?? "http://localhost:3100";
const DIR = path.join("snapshots", "before");

const PRICE = /\$\s?\d[\d,]*(?:\.\d{2})?/g;

/** The word, not the figure. "and prices", "See every price", "Pricing". */
const PRICE_WORD = /\bpric(?:e|es|ed|ing)\b/gi;

function pathFor(file: string): string {
  const slug = file.replace(/\.html$/, "");
  return slug === "index" ? "/" : `/${slug.replace(/__/g, "/")}`;
}

/** Everything a visitor reads that is not a price table. */
function prose(html: string): string {
  const main = /<main[^>]*>([\s\S]*?)<\/main>/i.exec(html)?.[1] ?? html;
  return main
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<table[\s\S]*?<\/table>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function metaDescription(html: string): string {
  return /<meta name="description" content="([^"]*)"/i.exec(html)?.[1] ?? "";
}

/**
 * Every navigational label on the page: anchor text, button text, and the
 * aria-label on either, which is what a screen reader announces instead.
 *
 * Two things are deliberately not navigational labels and are skipped, because
 * without the exemptions the real failures drown in them:
 *
 * - **A label containing a question mark is a question**, which is FAQ content
 *   rather than a promise about where the link goes. "Do your prices include
 *   the part and the labour?" is a question the site should answer. "Phone
 *   repair details and prices" is a promise it cannot keep. The answers
 *   themselves are still checked, by the prose pass.
 * - **A same-document `#` link cannot promise another page's content.** It
 *   jumps within a document whose prose this script already reads, so the FAQ
 *   category chips are covered without being flagged twice.
 */
function clickableLabels(html: string): string[] {
  const labels: string[] = [];
  const clickable = /<(a|button)\b([^>]*)>([\s\S]*?)<\/\1>/gi;

  let match: RegExpExecArray | null;
  while ((match = clickable.exec(html)) !== null) {
    const attributes = match[2] ?? "";
    const inner = match[3] ?? "";

    const href = /href="([^"]*)"/i.exec(attributes)?.[1];
    if (href?.startsWith("#")) continue;

    const text = inner
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (text && !text.includes("?")) labels.push(text);

    const aria = /aria-label="([^"]*)"/i.exec(attributes)?.[1];
    if (aria && !aria.includes("?")) labels.push(aria);
  }

  return labels;
}

async function main() {
  const files = readdirSync(DIR).filter((file) => file.endsWith(".html"));
  const failures: { path: string; where: string; found: string[] }[] = [];

  for (const file of files) {
    const pagePath = pathFor(file);
    const response = await fetch(`${BASE}${pagePath}`);
    if (!response.ok) continue;
    const html = await response.text();

    const inProse = prose(html).match(PRICE);
    if (inProse)
      failures.push({ path: pagePath, where: "prose", found: [...new Set(inProse)].slice(0, 6) });

    const inMeta = metaDescription(html).match(PRICE);
    if (inMeta)
      failures.push({ path: pagePath, where: "meta description", found: [...new Set(inMeta)] });

    // match() rather than test(), because both patterns are global and test()
    // carries lastIndex between calls, which would skip every other label.
    const offending = clickableLabels(html).filter(
      (label) => label.match(PRICE_WORD) !== null || label.match(PRICE) !== null,
    );
    if (offending.length > 0) {
      failures.push({
        path: pagePath,
        where: "link text",
        found: [...new Set(offending)].slice(0, 6),
      });
    }
  }

  console.log(`\nChecked ${files.length} pages for prices outside price tables.\n`);
  for (const failure of failures) {
    console.log(`  FAIL ${failure.path} (${failure.where}): ${failure.found.join(", ")}`);
  }

  console.log("=".repeat(70));
  if (failures.length === 0) {
    console.log(
      "PASS: no price in any prose sentence, key fact, FAQ answer or meta description.\n",
    );
    return;
  }
  console.log(`${failures.length} pages still quote a price in prose.\n`);
  process.exit(1);
}

main().catch((error) => {
  console.error("test-no-prose-prices failed:", error);
  process.exit(1);
});

export {};
