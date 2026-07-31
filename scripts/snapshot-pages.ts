/**
 * Snapshot every rendered page, so a refactor can be diffed rather than
 * trusted.
 *
 * Phase 6.9 moves ten document types out of Sanity and collapses 685 price
 * documents into inline arrays. The rendered output is supposed to be
 * identical. Four phases have now demonstrated that a green build is not
 * evidence of that, so this captures the before state and `diff-pages.ts`
 * compares the after.
 *
 *   pnpm exec tsx scripts/snapshot-pages.ts http://localhost:3100 before
 *   pnpm exec tsx scripts/snapshot-pages.ts http://localhost:3100 after
 */

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { LOCAL_PAGES } from "../lib/content/local-pages";
import { PLACES } from "../lib/content/places";
import { REPAIRS } from "../lib/content/repairs";
import { ROUTES } from "../lib/routes";
import { SERVICES } from "../lib/content/services";

const BASE = process.argv[2] ?? "http://localhost:3100";
const LABEL = process.argv[3] ?? "before";
const OUT = path.join("snapshots", LABEL);

/**
 * Everything that renders HTML. Model pages are discovered from the price list
 * rather than listed, so a model published later is captured automatically.
 */
async function allPaths(): Promise<string[]> {
  const priceHtml = await (await fetch(`${BASE}/repair-prices`)).text();
  const models = [
    ...new Set(
      Array.from(priceHtml.matchAll(/href="(\/repair\/[^"/]+\/[^"]+)"/g)).map(
        (match) => match[1] as string,
      ),
    ),
  ];

  const registry = ROUTES.filter(
    (entry) =>
      entry.status === "built" &&
      !entry.path.includes(".") &&
      !entry.path.startsWith("/api") &&
      !entry.path.startsWith("/studio"),
  ).map((entry) => entry.path);

  return [
    ...new Set([
      ...registry,
      ...SERVICES.map((entry) => `/services/${entry.slug}`),
      ...REPAIRS.map((entry) => `/repairs/${entry.slug}`),
      ...LOCAL_PAGES.map((entry) => `/${entry.slug}`),
      ...PLACES.map((entry) => entry.path),
      ...models,
    ]),
  ].sort();
}

/** A stable filename for a path. */
function fileFor(pagePath: string): string {
  const slug = pagePath === "/" ? "index" : pagePath.replace(/^\//, "").replace(/\//g, "__");
  return `${slug}.html`;
}

async function main() {
  const paths = await allPaths();
  mkdirSync(OUT, { recursive: true });

  console.log(`\nSnapshotting ${paths.length} pages from ${BASE} into ${OUT}\n`);

  let saved = 0;
  for (const pagePath of paths) {
    const response = await fetch(`${BASE}${pagePath}`);
    if (!response.ok) {
      console.log(`  skip ${pagePath} (${response.status})`);
      continue;
    }
    writeFileSync(path.join(OUT, fileFor(pagePath)), await response.text(), "utf8");
    saved += 1;
  }

  writeFileSync(path.join(OUT, "_paths.json"), JSON.stringify(paths, null, 2), "utf8");
  console.log(`\nSaved ${saved} pages.\n`);
}

main().catch((error) => {
  console.error("snapshot-pages failed:", error);
  process.exit(1);
});

export {};
