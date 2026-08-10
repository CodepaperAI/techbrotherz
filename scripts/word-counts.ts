/**
 * Prose word counts for the Tier 2 and Tier 3 pages.
 *
 * The Phase 5 brief sets a floor of 900 words of genuine body content per
 * page, excluding tables and FAQ. Counting from the rendered HTML would mean
 * guessing which text is prose and which is a table cell, so this counts the
 * authored copy in the content modules directly: leads, section paragraphs,
 * process and repair steps, symptoms, model notes, and the honest-limits
 * lists. FAQ answers and every table are deliberately excluded, because
 * padding those would be exactly the wrong response to a low number.
 *
 *   pnpm exec tsx scripts/word-counts.ts
 */

import { buildPriceContext } from "../lib/content/prices";
import { LOCAL_PAGES } from "../lib/content/local-pages";
import { PLACES } from "../lib/content/places";
import { REPAIRS } from "../lib/content/repairs";
import { SERVICES } from "../lib/content/services";

const FLOOR = 900;

/**
 * A context with plausible prices, purely so the copy functions run.
 *
 * The exact figures do not matter for a word count, and using a fixed context
 * keeps this script runnable without a Sanity connection.
 */
const warrantyDays = 60;
const waitMinutes = 30;
const ctx = buildPriceContext({ warrantyDays, waitMinutes });

function count(...parts: (string | undefined | null)[]): number {
  return parts
    .filter((part): part is string => Boolean(part))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
}

interface Row {
  path: string;
  words: number;
}

function serviceRows(): Row[] {
  return SERVICES.map((entry) => {
    const sections = entry.sections(ctx);
    return {
      path: `/services/${entry.slug}`,
      words: count(
        entry.lead(ctx),
        ...sections.flatMap((section) => [section.heading, ...section.paragraphs]),
        ...entry.process.flatMap((step) => [step.title, step.body]),
        ...entry.whoFor,
        ...entry.limits(ctx).flatMap((limit) => [limit.title, limit.body]),
        ...entry.sources.map((source) => source.note),
      ),
    };
  });
}

function repairRows(): Row[] {
  return REPAIRS.map((entry) => {
    const sections = entry.sections(ctx);
    return {
      path: `/repairs/${entry.slug}`,
      words: count(
        entry.lead(ctx),
        ...sections.flatMap((section) => [section.heading, ...section.paragraphs]),
        ...entry.steps.flatMap((step) => [step.title, step.body]),
        ...entry.symptoms,
        ...entry.modelNotes.flatMap((note) => [note.model, note.note]),
        ...entry.notWorthIt,
      ),
    };
  });
}

function localRows(): Row[] {
  return LOCAL_PAGES.map((entry) => ({
    path: `/${entry.slug}`,
    words: count(
      entry.lead(ctx),
      ...entry.sections(ctx).flatMap((section) => [section.heading, ...section.paragraphs]),
      ...entry.localMix.flatMap((item) => [item.title, item.body]),
      ...entry.facts.map((use) => use.sentence),
    ),
  }));
}

function placeRows(): Row[] {
  return PLACES.map((entry) => ({
    path: entry.path,
    words: count(
      entry.lead(ctx),
      ...entry.sections(ctx).flatMap((section) => [section.heading, ...section.paragraphs]),
      ...(entry.neighbourhoods ?? []).flatMap((area) => [area.name, ...area.paragraphs]),
      ...entry.facts.map((use) => use.sentence),
    ),
  }));
}

function main() {
  const rows = [...serviceRows(), ...repairRows(), ...localRows(), ...placeRows()].sort(
    (a, b) => a.words - b.words,
  );

  console.log(`\nProse word counts, excluding tables and FAQ answers\n`);
  console.log("  words   page");
  console.log("  " + "-".repeat(56));

  for (const row of rows) {
    const flag = row.words < FLOOR ? "  <-- under the 900-word floor" : "";
    console.log(`  ${String(row.words).padStart(5)}   ${row.path}${flag}`);
  }

  const total = rows.reduce((sum, row) => sum + row.words, 0);
  const under = rows.filter((row) => row.words < FLOOR);

  console.log(`\n  pages          : ${rows.length}`);
  console.log(`  total words    : ${total.toLocaleString("en-CA")}`);
  console.log(`  median         : ${rows[Math.floor(rows.length / 2)]?.words ?? 0}`);
  console.log(`  lowest         : ${rows[0]?.words ?? 0}`);
  console.log(`  floor          : ${FLOOR}`);

  console.log("\n" + "=".repeat(60));
  if (under.length === 0) {
    console.log(`PASS: every page carries at least ${FLOOR} words of prose.\n`);
    return;
  }

  console.log(`${under.length} pages are under the floor:\n`);
  for (const row of under) console.log(`  ${row.path}  ${row.words} words`);
  console.log(
    "\nReport these rather than padding them. A page that cannot reach the floor\n" +
      "honestly is a page whose scope is wrong, not a page missing filler.\n",
  );
  process.exit(1);
}

main();

export {};
