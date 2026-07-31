/**
 * The local-fact concentration report.
 *
 * The best local facts the site has are true of every local page at once:
 * there is one shop, one street, one transit station. Phase 5 established that
 * anything repeated across many pages becomes boilerplate, so each shared fact
 * gets exactly one page that carries it in full and a single, page-specific
 * sentence everywhere else.
 *
 * This reads the declarations in the content modules and reports which page
 * carries what, so the rule is provable rather than asserted. It also checks
 * the two things that would quietly break it: a fact with no home page, and a
 * mention whose sentence is reused verbatim somewhere else.
 *
 *   pnpm audit:local-facts
 */

import { LOCAL_PAGES } from "../lib/content/local-pages";
import { PLACES } from "../lib/content/places";
import { SHARED_FACTS, type FactId } from "../lib/content/local-shared";

interface Row {
  path: string;
  tier: "Tier 5" | "Tier 6";
  uses: { fact: FactId; treatment: string; sentence?: string }[];
}

function main() {
  const rows: Row[] = [
    ...LOCAL_PAGES.map((entry) => ({
      path: `/${entry.slug}`,
      tier: "Tier 5" as const,
      uses: entry.facts,
    })),
    ...PLACES.map((entry) => ({
      path: entry.path,
      tier: "Tier 6" as const,
      uses: entry.facts,
    })),
  ];

  console.log("\nLocal fact concentration\n");

  /* --- per fact ------------------------------------------------------ */
  let failures = 0;

  for (const fact of Object.values(SHARED_FACTS)) {
    const full = rows.filter((row) =>
      row.uses.some((use) => use.fact === fact.id && use.treatment === "full"),
    );
    const mentions = rows.filter((row) =>
      row.uses.some((use) => use.fact === fact.id && use.treatment === "mention"),
    );

    console.log(`  ${fact.label}`);
    console.log(`    in full   : ${full.map((row) => row.path).join(", ") || "NONE"}`);
    console.log(`    mentioned : ${mentions.length} pages`);
    for (const row of mentions) console.log(`                ${row.path}`);

    if (full.length === 0) {
      failures += 1;
      console.log(`    FAIL no page carries this fact in full`);
    }
    if (full.length > 1) {
      failures += 1;
      console.log(`    FAIL ${full.length} pages carry this fact in full, expected exactly 1`);
    }

    /* A reused sentence is the failure this rule exists to prevent. */
    const sentences = new Map<string, string[]>();
    for (const row of rows) {
      for (const use of row.uses) {
        if (use.fact !== fact.id || !use.sentence) continue;
        const key = use.sentence.trim().toLowerCase();
        sentences.set(key, [...(sentences.get(key) ?? []), row.path]);
      }
    }
    for (const [, paths] of sentences) {
      if (paths.length > 1) {
        failures += 1;
        console.log(`    FAIL the same sentence appears on ${paths.join(", ")}`);
      }
    }

    console.log();
  }

  /* --- per page ------------------------------------------------------ */
  console.log("Per page:\n");
  console.log("  page                                    tier      full          mention");
  console.log("  " + "-".repeat(82));

  for (const row of rows) {
    const full = row.uses.filter((use) => use.treatment === "full").map((use) => use.fact);
    const mention = row.uses.filter((use) => use.treatment === "mention").map((use) => use.fact);
    console.log(
      `  ${row.path.padEnd(39)} ${row.tier}    ${(full.join(", ") || "-").padEnd(13)} ${mention.join(", ") || "-"}`,
    );
  }

  const totalFull = rows.reduce(
    (sum, row) => sum + row.uses.filter((use) => use.treatment === "full").length,
    0,
  );
  const totalMention = rows.reduce(
    (sum, row) => sum + row.uses.filter((use) => use.treatment === "mention").length,
    0,
  );

  console.log(`\n  pages            : ${rows.length}`);
  console.log(`  shared facts     : ${Object.keys(SHARED_FACTS).length}`);
  console.log(`  full treatments  : ${totalFull}`);
  console.log(`  mentions         : ${totalMention}, each with its own sentence`);

  console.log("\n" + "=".repeat(84));
  if (failures === 0) {
    console.log("PASS: every shared fact has one home page and no repeated sentences.\n");
    return;
  }
  console.log(`FAIL: ${failures} concentration problems.\n`);
  process.exit(1);
}

main();

export {};
