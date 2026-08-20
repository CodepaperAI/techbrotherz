/**
 * Duplicate-content detector, across every content tier.
 *
 * 84 model pages built from one template is either 84 assets or 84
 * liabilities, and the difference is whether the prose actually differs. Phase
 * 5 extended this beyond the model tier, because the same risk applies to 16
 * repair pages built from one template, and applies harder to the location
 * tier coming in Phase 6, where the pages differ by place rather than by
 * device and place is harder to differentiate.
 *
 * This fetches every content page, extracts the visible body text, and
 * compares every pair.
 *
 * Method: 5-word shingles, Jaccard similarity. Shingling catches reordered
 * sentences that a bag-of-words measure would call different, and Jaccard is
 * easy to reason about: 0.70 means seventy percent of the five-word sequences
 * on one page also appear on the other.
 *
 * The threshold is 70 percent and it is not to be tuned. If pages fail, the
 * content is too similar and the content is what changes.
 *
 *   pnpm exec tsx scripts/content-similarity.ts http://localhost:3100
 */

import { LOCAL_PAGES } from "../lib/content/local-pages";
import { PLACES } from "../lib/content/places";
import { REPAIRS } from "../lib/content/repairs";
import { ROUTES } from "../lib/routes";
import { SERVICES } from "../lib/content/services";

const BASE = process.argv[2] ?? "http://localhost:3100";

/** The Tier 1 pages carrying enough prose to be worth comparing. */
const CORE_PATHS = [
  "/",
  "/services",
  "/locations",
  "/about",
  "/warranty",
  "/faq",
];
const THRESHOLD = 0.7;
const SHINGLE = 5;

type Tier = "core" | "service" | "repair" | "brand" | "model" | "local" | "place" | "guide";

interface Page {
  path: string;
  name: string;
  tier: Tier;
  words: string[];
  shingles: Set<string>;
}

/** The visible text inside <main>, with all markup and scripts removed. */
function bodyText(html: string): string {
  const main = /<main[^>]*>([\s\S]*?)<\/main>/i.exec(html)?.[1] ?? html;

  return main
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;|&rsquo;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function shingles(words: string[]): Set<string> {
  const set = new Set<string>();
  for (let index = 0; index + SHINGLE <= words.length; index += 1) {
    set.add(words.slice(index, index + SHINGLE).join(" "));
  }
  return set;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;

  let intersection = 0;
  const [smaller, larger] = a.size <= b.size ? [a, b] : [b, a];
  for (const item of smaller) if (larger.has(item)) intersection += 1;

  return intersection / (a.size + b.size - intersection);
}

async function main() {
  console.log(`
Content similarity across every tier, ${BASE}
`);

  /* Model pages used to be discovered from /repair-prices, which is deleted
     and 301s to /contact, so the scrape returned nothing and the script bailed.
     Same fix as scripts/link-graph.ts: brands from the registry, models from
     crawling each brand hub, which is the page that carries the catalogue. */
  const builtBrandPaths = ROUTES.filter(
    (entry) => entry.tier === "brand" && entry.status === "built",
  ).map((entry) => entry.path);

  const modelPaths = [
    ...new Set(
      (
        await Promise.all(
          builtBrandPaths.map(async (path) => {
            const html = await (await fetch(`${BASE}${path}`)).text();
            return Array.from(html.matchAll(/href="(\/repair\/[^"/]+\/[^"#?]+)"/g)).map(
              (match) => match[1] as string,
            );
          }),
        )
      ).flat(),
    ),
  ].sort();

  if (modelPaths.length === 0) {
    console.error("No model pages found on any brand hub. Is the server running?");
    process.exit(1);
  }

  const targets: { path: string; tier: Tier }[] = [
    ...CORE_PATHS.map((path) => ({ path, tier: "core" as Tier })),
    ...SERVICES.map((entry) => ({ path: `/services/${entry.slug}`, tier: "service" as Tier })),
    ...REPAIRS.map((entry) => ({ path: `/repairs/${entry.slug}`, tier: "repair" as Tier })),
    ...ROUTES.filter((entry) => entry.tier === "brand" && entry.status === "built").map(
      (entry) => ({
        path: entry.path,
        tier: "brand" as Tier,
      }),
    ),
    ...modelPaths.map((path) => ({ path, tier: "model" as Tier })),
    // Phase 6. Measured from the first build, because seventeen pages about one
    // shop was the differentiation risk this tier was cut down to answer.
    ...LOCAL_PAGES.map((entry) => ({ path: `/${entry.slug}`, tier: "local" as Tier })),
    ...PLACES.map((entry) => ({ path: entry.path, tier: "place" as Tier })),
    // The guide tier, added 2026-08 when the blog reached six articles.
    ...ROUTES.filter((entry) => entry.tier === "guide" && entry.status === "built").map(
      (entry) => ({ path: entry.path, tier: "guide" as Tier }),
    ),
  ];

  console.log(`Fetching ${targets.length} content pages...`);

  const pages: Page[] = [];

  for (const target of targets) {
    const response = await fetch(`${BASE}${target.path}`);
    if (!response.ok) {
      console.log(`  ${target.path} returned ${response.status}, skipped`);
      continue;
    }

    const text = bodyText(await response.text());
    const words = text.toLowerCase().split(" ").filter(Boolean);

    pages.push({
      path: target.path,
      name: target.path.replace(/^\//, ""),
      tier: target.tier,
      words,
      shingles: shingles(words),
    });
  }

  console.log(`Comparing ${(pages.length * (pages.length - 1)) / 2} pairs...\n`);

  const pairs: { a: string; b: string; tierA: Tier; tierB: Tier; score: number }[] = [];

  for (let i = 0; i < pages.length; i += 1) {
    for (let j = i + 1; j < pages.length; j += 1) {
      const first = pages[i] as Page;
      const second = pages[j] as Page;
      pairs.push({
        a: first.name,
        b: second.name,
        tierA: first.tier,
        tierB: second.tier,
        score: jaccard(first.shingles, second.shingles),
      });
    }
  }

  pairs.sort((left, right) => right.score - left.score);

  const worst = pairs.slice(0, 10);
  const failing = pairs.filter((pair) => pair.score > THRESHOLD);

  console.log("The ten most similar pairs on the whole site:\n");
  console.log("  score   pages");
  console.log("  " + "-".repeat(66));
  for (const pair of worst) {
    const flag = pair.score > THRESHOLD ? "  <-- OVER THRESHOLD" : "";
    console.log(`  ${(pair.score * 100).toFixed(1).padStart(5)}%  ${pair.a} / ${pair.b}${flag}`);
  }

  const averageWords = Math.round(
    pages.reduce((sum, page) => sum + page.words.length, 0) / pages.length,
  );
  const median = pairs[Math.floor(pairs.length / 2)]?.score ?? 0;

  /* --- per tier, because a tier that reads as templated is the real risk --- */
  console.log("\n\nWithin each tier:\n");
  console.log("  tier      pages   median   highest   worst pair");
  console.log("  " + "-".repeat(78));

  for (const tier of ["core", "service", "repair", "brand", "model", "local", "place", "guide"] as Tier[]) {
    const inTier = pages.filter((page) => page.tier === tier);
    if (inTier.length < 2) continue;

    const tierPairs = pairs
      .filter((pair) => pair.tierA === tier && pair.tierB === tier)
      .sort((left, right) => right.score - left.score);
    const tierMedian = tierPairs[Math.floor(tierPairs.length / 2)]?.score ?? 0;
    const tierWorst = tierPairs[0];

    console.log(
      `  ${tier.padEnd(9)} ${String(inTier.length).padStart(5)}   ` +
        `${(tierMedian * 100).toFixed(1).padStart(5)}%   ` +
        `${((tierWorst?.score ?? 0) * 100).toFixed(1).padStart(6)}%   ` +
        `${tierWorst ? `${tierWorst.a} / ${tierWorst.b}` : ""}`,
    );
  }

  console.log(`\n  pages compared      : ${pages.length}`);

  console.log(`  average body words  : ${averageWords}`);
  console.log(`  median pair score   : ${(median * 100).toFixed(1)}%`);
  console.log(`  highest pair score  : ${((worst[0]?.score ?? 0) * 100).toFixed(1)}%`);
  console.log(`  threshold           : ${(THRESHOLD * 100).toFixed(0)}%`);

  console.log("\n" + "=".repeat(70));
  if (failing.length === 0) {
    console.log(`PASS: no pair above ${(THRESHOLD * 100).toFixed(0)}% similarity.\n`);
    return;
  }

  console.log(`FAIL: ${failing.length} pairs above the threshold.\n`);
  console.log("Fix the content on these pages. Do not tune the threshold.\n");
  process.exit(1);
}

main().catch((error) => {
  console.error("content-similarity failed:", error);
  process.exit(1);
});

export {};
