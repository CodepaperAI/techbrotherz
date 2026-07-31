/**
 * Transfer weight per page, before and after a change.
 *
 * The imagery pass added weight to exactly the pages whose performance was
 * already short of target, so the honest way to run it is to record every
 * page's weight first and compare afterwards rather than deciding it looks
 * fine.
 *
 * Getting this measurement right took three attempts, and both wrong versions
 * are worth recording because each misrepresented the pass:
 *
 *   1. Summing every srcset candidate overstated by roughly ten times. A
 *      browser downloads one candidate, not all ten.
 *   2. Taking the largest candidate still overstated badly. A 380px step card
 *      was credited with the 1920w file, when in reality it fetches an 8 KB
 *      AVIF rather than the 145 KB source.
 *
 * So this parses the `sizes` attribute on each image, works out the widest
 * slot it declares at a 1440px viewport, and fetches the smallest candidate
 * that covers it. That is what a desktop visitor actually downloads.
 *
 *   pnpm exec tsx scripts/measure-weight.ts http://localhost:3100 > before.json
 *   pnpm exec tsx scripts/measure-weight.ts http://localhost:3100 before.json
 */

import { readFileSync } from "node:fs";

const BASE = process.argv[2] ?? "http://localhost:3100";
const BASELINE = process.argv[3];
const VIEWPORT = 1440;

const PAGES = [
  "/",
  "/services",
  "/services/phone-repair",
  "/services/laptop-repair",
  "/services/computer-repair",
  "/repairs/iphone-screen-replacement",
  "/repairs/laptop-screen-replacement",
  "/repair-prices",
  "/repair/apple-iphone",
  "/repair/apple-iphone/iphone-8-plus",
  "/phone-repair-calgary",
  "/locations/calgary",
  "/about",
  "/contact",
];

interface Measurement {
  path: string;
  html: number;
  images: number;
  imageCount: number;
}

/** The widest slot a `sizes` attribute declares, at a desktop viewport. */
function slotWidth(sizes: string): number {
  let widest = 0;
  for (const clause of sizes.split(",")) {
    const value = clause.trim().split(/\s+/).pop() ?? "";
    const vw = /^(\d+(?:\.\d+)?)vw$/.exec(value);
    const px = /^(\d+(?:\.\d+)?)px$/.exec(value);
    if (vw) widest = Math.max(widest, (Number(vw[1]) / 100) * VIEWPORT);
    else if (px) widest = Math.max(widest, Number(px[1]));
  }
  return widest || VIEWPORT;
}

/** One URL per <img>, resolved to the variant a desktop browser would take. */
function chosenImages(html: string): string[] {
  const chosen: string[] = [];

  for (const tag of html.matchAll(/<img[^>]*>/g)) {
    const markup = tag[0];
    const raw = (/srcSet="([^"]+)"/.exec(markup) ?? /srcset="([^"]+)"/.exec(markup))?.[1] ?? "";

    if (raw === "") {
      const src = /src="([^"]+)"/.exec(markup)?.[1]?.replace(/&amp;/g, "&");
      if (src && /(_next\/image|\/demo\/)/.test(src)) chosen.push(src);
      continue;
    }

    const want = slotWidth(/sizes="([^"]+)"/.exec(markup)?.[1] ?? "100vw");

    const candidates = raw
      .split(",")
      .map((entry) => {
        const parts = entry.trim().split(/\s+/);
        return {
          url: (parts[0] ?? "").replace(/&amp;/g, "&"),
          width: Number((parts[1] ?? "").replace("w", "")),
        };
      })
      .filter((candidate) => candidate.url !== "" && Number.isFinite(candidate.width))
      .sort((a, b) => a.width - b.width);

    const pick = candidates.find((candidate) => candidate.width >= want) ?? candidates.at(-1);
    if (pick) chosen.push(pick.url);
  }

  return chosen;
}

async function measure(path: string): Promise<Measurement> {
  const response = await fetch(`${BASE}${path}`);
  const html = await response.text();
  const urls = chosenImages(html);

  let images = 0;
  for (const url of urls) {
    try {
      const image = await fetch(url.startsWith("http") ? url : `${BASE}${url}`, {
        headers: { Accept: "image/avif,image/webp,*/*" },
      });
      images += (await image.arrayBuffer()).byteLength;
    } catch {
      continue;
    }
  }

  return { path, html: Buffer.byteLength(html, "utf8"), images, imageCount: urls.length };
}

function kb(bytes: number): string {
  return (bytes / 1024).toFixed(0);
}

async function main() {
  const results: Measurement[] = [];
  for (const path of PAGES) results.push(await measure(path));

  let baseline: Record<string, Measurement> = {};
  if (BASELINE) {
    try {
      baseline = JSON.parse(readFileSync(BASELINE, "utf8"));
    } catch {
      console.error(`Could not read baseline ${BASELINE}, reporting absolute figures only.\n`);
    }
  }

  const hasBaseline = Object.keys(baseline).length > 0;

  console.log(`\nTransfer weight, ${BASE}\n`);
  console.log("  page                                   HTML     images  imgs    total   change");
  console.log("  " + "-".repeat(84));

  for (const result of results) {
    const total = result.html + result.images;
    const before = baseline[result.path];
    const delta = before ? total - (before.html + before.images) : 0;
    const change = before ? `${delta >= 0 ? "+" : ""}${kb(delta)} KB` : "";

    console.log(
      `  ${result.path.padEnd(38)} ${kb(result.html).padStart(5)} KB ${kb(result.images).padStart(6)} KB ` +
        `${String(result.imageCount).padStart(4)} ${kb(total).padStart(7)} KB  ${change}`,
    );
  }

  const totalAfter = results.reduce((sum, r) => sum + r.html + r.images, 0);
  console.log(`\n  site total across ${results.length} pages: ${kb(totalAfter)} KB`);

  if (hasBaseline) {
    const totalBefore = results.reduce((sum, r) => {
      const before = baseline[r.path];
      return sum + (before ? before.html + before.images : 0);
    }, 0);
    console.log(`  before                          : ${kb(totalBefore)} KB`);
    const delta = totalAfter - totalBefore;
    console.log(`  change                          : ${delta >= 0 ? "+" : ""}${kb(delta)} KB`);
  }

  if (!BASELINE) {
    const asRecord: Record<string, Measurement> = {};
    for (const result of results) asRecord[result.path] = result;
    console.error("\n--- baseline JSON below, redirect stdout to save it ---");
    console.log(`\n${JSON.stringify(asRecord)}`);
  }
}

main().catch((error) => {
  console.error("measure-weight failed:", error);
  process.exit(1);
});

export {};
