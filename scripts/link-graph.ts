/**
 * Internal link graph across the programmatic tier.
 *
 * Checks the two things that decide whether 84 model pages are reachable
 * assets or an orphaned island: outbound links per page, and how many pages
 * link back in. A page nobody links to is a page Google will crawl late and
 * value little, however good the content is.
 *
 *   pnpm exec tsx scripts/link-graph.ts http://localhost:3100
 */

import { readFileSync } from "node:fs";

import puppeteer from "puppeteer-core";

import { LOCAL_PAGES } from "../lib/content/local-pages";
import { PLACES } from "../lib/content/places";
import { REPAIRS } from "../lib/content/repairs";
import { SERVICES } from "../lib/content/services";

const BASE = process.argv[2] ?? "http://localhost:3100";
const MIN_OUTBOUND = 6;
const MIN_INBOUND = 2;

function findChrome(): string {
  for (const candidate of [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  ]) {
    try {
      readFileSync(candidate);
      return candidate;
    } catch {
      // next
    }
  }
  throw new Error("No Chrome binary found.");
}

/**
 * Normalises an href for comparison.
 *
 * Stripping the trailing slash is right for every path except the home page,
 * where it produces an empty string. Left unhandled, that made "/" invisible
 * to the inbound counter and reported the home page as an orphan.
 */
function normalise(href: string): string {
  const trimmed = href.replace(/\/$/, "");
  return trimmed === "" ? "/" : trimmed;
}

/** Internal hrefs inside <main>, so chrome links are not double counted. */
function internalLinks(html: string): string[] {
  const main = /<main[^>]*>([\s\S]*?)<\/main>/i.exec(html)?.[1] ?? html;
  return [
    ...new Set(
      Array.from(main.matchAll(/href="(\/[^"#?]*)/g))
        .map((match) => normalise(match[1] as string))
        .filter((href) => !href.startsWith("/api")),
    ),
  ];
}

/** Every link on the page including nav and footer, for inbound counting. */
function allInternalLinks(html: string): string[] {
  return [
    ...new Set(
      Array.from(html.matchAll(/href="(\/[^"#?]*)/g))
        .map((match) => normalise(match[1] as string))
        .filter((href) => !href.startsWith("/api")),
    ),
  ];
}

async function main() {
  console.log(`\nInternal link graph, ${BASE}\n`);

  const priceHtml = await (await fetch(`${BASE}/repair-prices`)).text();
  const modelPaths = [
    ...new Set(
      Array.from(priceHtml.matchAll(/href="(\/repair\/[^"/]+\/[^"]+)"/g)).map(
        (match) => match[1] as string,
      ),
    ),
  ].sort();

  const brandPaths = [
    ...new Set(
      Array.from(priceHtml.matchAll(/href="(\/repair\/[^"/]+)"/g))
        .map((match) => match[1] as string)
        .filter((path) => path.split("/").length === 3),
    ),
  ].sort();

  const corePaths = [
    "/",
    "/services",
    "/repair-prices",
    "/locations",
    "/faq",
    "/about",
    "/contact",
    "/warranty",
    "/privacy-policy",
    "/terms",
  ];

  // Phase 5 tiers. Taken from the content modules rather than crawled, so a
  // page that nothing links to still gets counted and shows up as an orphan
  // instead of being invisible to this check.
  const servicePaths = SERVICES.map((entry) => `/services/${entry.slug}`);
  const repairPaths = REPAIRS.map((entry) => `/repairs/${entry.slug}`);
  const localPaths = LOCAL_PAGES.map((entry) => `/${entry.slug}`);
  const placePaths = PLACES.map((entry) => entry.path);

  const allPaths = [
    ...corePaths,
    ...servicePaths,
    ...repairPaths,
    ...localPaths,
    ...placePaths,
    ...brandPaths,
    ...modelPaths,
  ];

  const tierOf = new Map<string, string>([
    ...corePaths.map((path) => [path, "core"] as [string, string]),
    ...servicePaths.map((path) => [path, "service"] as [string, string]),
    ...repairPaths.map((path) => [path, "repair"] as [string, string]),
    ...localPaths.map((path) => [path, "local"] as [string, string]),
    ...placePaths.map((path) => [path, "place"] as [string, string]),
    ...brandPaths.map((path) => [path, "brand"] as [string, string]),
    ...modelPaths.map((path) => [path, "model"] as [string, string]),
  ]);
  const inbound = new Map<string, number>();
  const outbound = new Map<string, number>();

  console.log(`Crawling ${allPaths.length} pages...`);

  for (const path of allPaths) {
    const response = await fetch(`${BASE}${path}`);
    if (!response.ok) continue;
    const html = await response.text();

    outbound.set(path, internalLinks(html).length);

    for (const target of allInternalLinks(html)) {
      if (target === path) continue;
      inbound.set(target, (inbound.get(target) ?? 0) + 1);
    }
  }

  let failures = 0;

  /* --- outbound on model pages ------------------------------------- */
  const thinOutbound = modelPaths.filter((path) => (outbound.get(path) ?? 0) < MIN_OUTBOUND);
  const outboundCounts = modelPaths.map((path) => outbound.get(path) ?? 0);
  const minOut = Math.min(...outboundCounts);
  const maxOut = Math.max(...outboundCounts);

  console.log(`\nOutbound in-body internal links per model page:`);
  console.log(`  minimum ${minOut}, maximum ${maxOut}, required at least ${MIN_OUTBOUND}`);
  if (thinOutbound.length > 0) {
    failures += thinOutbound.length;
    for (const path of thinOutbound.slice(0, 10)) {
      console.log(`  FAIL ${path} has ${outbound.get(path)} outbound links`);
    }
  }

  /* --- inbound ------------------------------------------------------ */
  const inboundCounts = modelPaths.map((path) => inbound.get(path) ?? 0);
  const orphans = modelPaths.filter((path) => (inbound.get(path) ?? 0) === 0);
  const thinInbound = modelPaths.filter(
    (path) => (inbound.get(path) ?? 0) > 0 && (inbound.get(path) ?? 0) < MIN_INBOUND,
  );

  const distribution = new Map<number, number>();
  for (const count of inboundCounts) distribution.set(count, (distribution.get(count) ?? 0) + 1);

  console.log(`\nInbound link distribution across ${modelPaths.length} model pages:`);
  console.log("  inbound links   model pages");
  for (const [count, pages] of [...distribution.entries()].sort((a, b) => a[0] - b[0])) {
    console.log(`  ${String(count).padStart(13)}   ${"#".repeat(Math.min(pages, 50))} ${pages}`);
  }

  console.log(`\n  orphans (zero inbound) : ${orphans.length}`);
  console.log(`  below ${MIN_INBOUND} inbound        : ${thinInbound.length}`);

  if (orphans.length > 0) {
    failures += orphans.length;
    for (const path of orphans.slice(0, 10)) console.log(`  FAIL orphan: ${path}`);
  }
  if (thinInbound.length > 0) {
    failures += thinInbound.length;
    for (const path of thinInbound.slice(0, 10)) {
      console.log(`  FAIL ${path} has ${inbound.get(path)} inbound link`);
    }
  }

  /* --- inbound distribution per tier, and site-wide orphans ---------- */
  console.log(`

Inbound links per tier:
`);
  console.log("  tier      pages   min   median   max   orphans");
  console.log("  " + "-".repeat(52));

  let siteOrphans: string[] = [];

  for (const tier of ["core", "service", "repair", "local", "place", "brand", "model"]) {
    const inTier = allPaths.filter((path) => tierOf.get(path) === tier);
    if (inTier.length === 0) continue;

    const counts = inTier.map((path) => inbound.get(path) ?? 0).sort((a, b) => a - b);
    const tierOrphans = inTier.filter((path) => (inbound.get(path) ?? 0) === 0);
    siteOrphans = [...siteOrphans, ...tierOrphans];

    console.log(
      `  ${tier.padEnd(9)} ${String(inTier.length).padStart(5)}   ` +
        `${String(counts[0] ?? 0).padStart(3)}   ` +
        `${String(counts[Math.floor(counts.length / 2)] ?? 0).padStart(6)}   ` +
        `${String(counts[counts.length - 1] ?? 0).padStart(3)}   ` +
        `${String(tierOrphans.length).padStart(7)}`,
    );
  }

  if (siteOrphans.length > 0) {
    failures += siteOrphans.length;
    console.log(`
  Orphaned pages, nothing on the site links to them:`);
    for (const path of siteOrphans.slice(0, 15)) console.log(`  FAIL orphan: ${path}`);
  }

  /* --- brand hubs --------------------------------------------------- */
  console.log(`\nBrand hubs:`);
  for (const path of brandPaths) {
    console.log(
      `  ${path.padEnd(32)} ${String(outbound.get(path) ?? 0).padStart(3)} outbound, ${String(inbound.get(path) ?? 0).padStart(3)} inbound`,
    );
  }

  /* --- DOM node counts, for the /repair-prices comparison ----------- */
  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: true,
    args: ["--no-sandbox"],
  });
  try {
    console.log(`\nDOM node counts:`);
    for (const path of [
      "/repair-prices",
      "/repair/apple-iphone",
      "/repair/apple-iphone/iphone-8-plus",
      "/",
    ]) {
      const page = await browser.newPage();
      await page.goto(`${BASE}${path}`, { waitUntil: "networkidle0", timeout: 90_000 });
      const nodes = await page.evaluate(() => document.querySelectorAll("*").length);
      const raw = await (await fetch(`${BASE}${path}`)).text();
      console.log(
        `  ${path.padEnd(38)} ${String(nodes).padStart(5)} nodes, ${(Buffer.byteLength(raw, "utf8") / 1024).toFixed(0).padStart(5)} KB`,
      );
      await page.close();
    }
  } finally {
    await browser.close();
  }

  console.log("\n" + "=".repeat(70));
  if (failures === 0) {
    console.log("PASS: no orphans, and every model page meets the link minimums.\n");
    return;
  }
  console.log(`FAIL: ${failures} link problems.\n`);
  process.exit(1);
}

main().catch((error) => {
  console.error("link-graph failed:", error);
  process.exit(1);
});
