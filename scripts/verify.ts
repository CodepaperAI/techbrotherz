/**
 * The behavioural suite.
 *
 * Three phases in a row shipped code that typechecked, linted and built
 * cleanly and was broken at runtime: dead document validation in Phase 2, a
 * "use server" file exporting a plain object in Phase 3, and a stale Next
 * fetch cache serving old content in Phase 4. Types and builds do not catch
 * that class of bug. Behaviour does.
 *
 * Every check here exercises what the site actually does. It grows each phase.
 *
 *   pnpm verify                      against http://localhost:3100
 *   pnpm verify https://example.com  against a deployed URL
 *
 * Checks that need no server run first, so a broken token fails fast.
 */

import { spawnSync } from "node:child_process";

const BASE = process.argv[2] ?? "http://localhost:3100";

interface Check {
  name: string;
  script: string;
  /** Checks that need a running site take the base URL. */
  needsServer: boolean;
  why: string;
}

const CHECKS: Check[] = [
  {
    name: "contrast",
    script: "scripts/test-contrast.ts",
    needsServer: false,
    why: "The design system's own rules, as assertions. Caught by axe in Phase 3.",
  },
  {
    name: "timezone",
    script: "scripts/test-timezone.ts",
    needsServer: false,
    why: "Open-now answers must not depend on the server's or the visitor's zone.",
  },
  {
    name: "local-facts",
    script: "scripts/audit-local-facts.ts",
    needsServer: false,
    why: "Each shared local fact has one home page and no repeated sentences.",
  },
  {
    name: "words",
    script: "scripts/word-counts.ts",
    needsServer: false,
    why: "Every Tier 2 and Tier 3 page carries at least 900 words of real prose.",
  },
  {
    name: "pages",
    script: "scripts/audit-pages.ts",
    needsServer: true,
    why: "Status codes, one h1, heading order, JSON-LD hygiene, canonicals.",
  },
  {
    name: "placeholders",
    script: "scripts/test-no-placeholders.ts",
    needsServer: true,
    why: "The demo build shows no placeholder frames, though the fallback still exists.",
  },
  {
    name: "noindex",
    script: "scripts/test-staging-noindex.ts",
    needsServer: true,
    why: "Only the canonical host is indexable. Staging must never be.",
  },
  {
    name: "schema",
    script: "scripts/validate-schema.ts",
    needsServer: true,
    why: "One graph per page, no holes, no price-less Offer, on every template.",
  },
  {
    name: "faq-scoping",
    script: "scripts/test-faq-scoping.ts",
    needsServer: true,
    why: "No question and answer pair appears in structured data on two URLs.",
  },
  {
    name: "similarity",
    script: "scripts/content-similarity.ts",
    needsServer: true,
    why: "Templated pages across every tier must not read as duplicates.",
  },
  {
    name: "links",
    script: "scripts/link-graph.ts",
    needsServer: true,
    why: "No orphans, and every model page carries enough outbound and inbound links.",
  },
  {
    name: "not-found",
    script: "scripts/test-not-found.ts",
    needsServer: true,
    why: "Typos, old addresses and raw model numbers still reach a price.",
  },
  {
    name: "keyboard",
    script: "scripts/test-keyboard.ts",
    needsServer: true,
    why: "Every control reachable and operable without a mouse.",
  },
  {
    name: "browser",
    script: "scripts/audit-browser.ts",
    needsServer: true,
    why: "Hydration warnings, axe violations, and the contact form's four paths.",
  },
  /*
   * The determinism check retired with the dataset. It existed because Next
   * persisted Sanity fetch results in .next/cache between builds, so a rebuild
   * after a content change could silently serve the old content and still
   * report success. Content is compiled in now: a build either has it or does
   * not compile, and there is no fetch cache to go stale.
   */
];

function run(check: Check): boolean {
  const args = ["tsx", check.script, ...(check.needsServer ? [BASE] : [])];

  console.log(`\n${"=".repeat(72)}`);
  console.log(`  ${check.name.toUpperCase()}  ${check.why}`);
  console.log("=".repeat(72));

  const result = spawnSync("pnpm", ["exec", ...args], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  return result.status === 0;
}

function main() {
  console.log(`\nTechBrotherz behavioural verification against ${BASE}`);

  const results: { name: string; passed: boolean }[] = [];

  for (const check of CHECKS) {
    results.push({ name: check.name, passed: run(check) });
  }

  console.log(`\n${"=".repeat(72)}`);
  console.log("  SUMMARY");
  console.log("=".repeat(72));

  for (const result of results) {
    console.log(`  ${result.passed ? "pass" : "FAIL"}  ${result.name}`);
  }

  const failed = results.filter((result) => !result.passed);

  console.log();
  if (failed.length === 0) {
    console.log(`All ${results.length} behavioural checks passed.\n`);
    return;
  }

  console.log(
    `${failed.length} of ${results.length} checks failed: ${failed.map((f) => f.name).join(", ")}\n`,
  );
  process.exit(1);
}

main();
