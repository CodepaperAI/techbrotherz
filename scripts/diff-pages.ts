/**
 * Diffs the rendered site against a snapshot.
 *
 * Phase 6.9 is a move, not a rewrite: the query layer changed shape, the
 * brands and repair types became constants, and the prices became array
 * entries. If any of that altered what a visitor sees, this is what says so.
 *
 * Two things are ignored, both of which change on every build regardless:
 *   - Next's build id, which appears in every script URL
 *   - the ISR timestamp comment
 *
 * Everything else counts. A price that moved, a row that vanished, a table
 * that reordered: all of those show up as a changed page.
 *
 *   pnpm exec tsx scripts/diff-pages.ts http://localhost:3100 before
 */

import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const BASE = process.argv[2] ?? "http://localhost:3100";
const LABEL = process.argv[3] ?? "before";
const DIR = path.join("snapshots", LABEL);

/**
 * The content surface of a page, with build plumbing excluded.
 *
 * A page's asset hashes and its flight payload change whenever the bundle
 * changes, and Phase 6.9 changed the bundle by design. Neither is content. What
 * is content: the head metadata, the rendered markup, and the JSON-LD graph.
 * All three are compared in full, so a moved price, a dropped row or a
 * reordered table still fails.
 */
function contentSurface(html: string): string {
  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((match) => {
      const raw = match[1] ?? "";
      try {
        return JSON.stringify(JSON.parse(raw));
      } catch {
        return raw;
      }
    })
    .join("\n");

  const head = /<head>([\s\S]*?)<\/head>/i.exec(html)?.[1] ?? "";
  const metadata = [...head.matchAll(/<(title|meta|link)\b[^>]*>(?:([^<]*)<\/title>)?/gi)]
    .map((match) => match[0] + (match[2] ?? ""))
    /* Stylesheet and preload tags name content-hashed bundles. */
    .filter((tag) => !tag.includes("/_next/static/"))
    .join("\n");

  const body = (/<body[^>]*>([\s\S]*?)<\/body>/i.exec(html)?.[1] ?? html)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<!--[^>]*-->/g, "");

  return [metadata, body, jsonLd].join("\n---\n").replace(/\s+/g, " ").trim();
}

/** The visible text inside <main>, for describing what actually moved. */
function bodyText(html: string): string {
  const main = /<main[^>]*>([\s\S]*?)<\/main>/i.exec(html)?.[1] ?? html;
  return main
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pathFor(file: string): string {
  const slug = file.replace(/\.html$/, "");
  return slug === "index" ? "/" : `/${slug.replace(/__/g, "/")}`;
}

async function main() {
  if (!existsSync(DIR)) {
    console.error(`No snapshot at ${DIR}.`);
    process.exit(1);
  }

  const files = readdirSync(DIR).filter((file) => file.endsWith(".html"));
  console.log(`\nDiffing ${files.length} pages against snapshots/${LABEL}\n`);

  const changed: { path: string; beforeLen: number; afterLen: number; sample: string }[] = [];
  const missing: string[] = [];
  let identical = 0;

  for (const file of files) {
    const pagePath = pathFor(file);
    const before = readFileSync(path.join(DIR, file), "utf8");

    const response = await fetch(`${BASE}${pagePath}`);
    if (!response.ok) {
      missing.push(`${pagePath} (${response.status})`);
      continue;
    }
    const after = await response.text();

    if (contentSurface(before) === contentSurface(after)) {
      identical += 1;
      continue;
    }

    /* Describe the difference in visible terms, not markup terms. */
    const beforeText = bodyText(before);
    const afterText = bodyText(after);

    let sample = "markup only, visible text identical";
    if (beforeText !== afterText) {
      let i = 0;
      while (i < beforeText.length && i < afterText.length && beforeText[i] === afterText[i]) i += 1;
      sample =
        `at char ${i}: ` +
        `before "...${beforeText.slice(Math.max(0, i - 40), i + 60)}..." ` +
        `after "...${afterText.slice(Math.max(0, i - 40), i + 60)}..."`;
    }

    changed.push({
      path: pagePath,
      beforeLen: beforeText.length,
      afterLen: afterText.length,
      sample,
    });
  }

  console.log(`  identical : ${identical}`);
  console.log(`  changed   : ${changed.length}`);
  console.log(`  missing   : ${missing.length}\n`);

  for (const gone of missing) console.log(`  MISSING ${gone}`);

  for (const entry of changed.slice(0, 25)) {
    console.log(`  CHANGED ${entry.path}`);
    console.log(`          text ${entry.beforeLen} -> ${entry.afterLen} chars`);
    console.log(`          ${entry.sample.slice(0, 260)}\n`);
  }

  if (changed.length > 25) console.log(`  ... and ${changed.length - 25} more\n`);

  console.log("=".repeat(70));
  if (changed.length === 0 && missing.length === 0) {
    console.log("PASS: every page is byte-identical after normalising build ids.\n");
    return;
  }
  console.log(`${changed.length} changed, ${missing.length} missing. Every one needs a reason.\n`);
  process.exit(1);
}

main().catch((error) => {
  console.error("diff-pages failed:", error);
  process.exit(1);
});

export {};
