/**
 * Fails if a star rating or a review count is hardcoded in the source rather
 * than flowing from live review data.
 *
 * The client's rating has never been supplied (open question 8), and an
 * invented "5.0" would be the single most damaging thing this site could
 * ship: checkable against the real Google listing in seconds. RatingBadge and
 * aggregateRating() both render nothing until getReviewSummary() returns real
 * data, and this guard is what keeps it that way under deadline pressure.
 *
 * Scanned: app/, components/, lib/ source files. Not scanned: the data files
 * where real supplied review data legitimately lives (content/data/), the
 * docs, and this script.
 *
 *   pnpm exec tsx scripts/test-no-fake-rating.ts
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const ROOTS = ["app", "components", "lib"];

const PATTERNS: { name: string; regex: RegExp }[] = [
  {
    name: "literal star rating",
    regex: /\b[0-5]\.\d\s*(?:stars?\b|★|\/\s*5\b|out of 5)/i,
  },
  {
    name: "literal rating value",
    regex: /\bratingValue\s*[:=]\s*\d/,
  },
  {
    name: "literal review count",
    regex: /\breviewCount\s*[:=]\s*\d/,
  },
  {
    name: "literal count of reviews in copy",
    regex: /\b\d[\d,]*\+?\s+(?:Google\s+|Facebook\s+)?reviews\b/i,
  },
];

/** Lines that legitimately carry a digit next to rating vocabulary. */
const ALLOW = [/bestRating/, /worstRating/, /out of 5 on Google/];

function* walk(dir: string): Generator<string> {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === "node_modules" || entry === ".next") continue;
      yield* walk(full);
    } else if (/\.(ts|tsx)$/.test(entry)) {
      yield full;
    }
  }
}

const failures: string[] = [];

for (const root of ROOTS) {
  for (const file of walk(root)) {
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, index) => {
      if (ALLOW.some((allow) => allow.test(line))) return;
      for (const { name, regex } of PATTERNS) {
        if (regex.test(line)) {
          failures.push(`${file}:${index + 1}  [${name}]  ${line.trim().slice(0, 100)}`);
        }
      }
    });
  }
}

console.log(`\nHardcoded rating guard: scanned ${ROOTS.join(", ")}\n`);

if (failures.length === 0) {
  console.log("PASS: no hardcoded star rating or review count in the source.\n");
} else {
  console.log(`FAIL: ${failures.length} suspicious lines:\n`);
  for (const failure of failures) console.log(`  ${failure}`);
  console.log(
    "\nA rating must come from getReviewSummary() live data, never from a literal.\n",
  );
  process.exit(1);
}

export {};
