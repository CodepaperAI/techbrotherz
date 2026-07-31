/**
 * The FAQ scoping rule, verified against the rendered site.
 *
 * lib/faq/scoping.ts enforces the per-page limits at render time, so a page
 * that breaks them fails the build. That covers the rules a single page can
 * break on its own. It cannot cover the rule that matters most, which is a
 * property of the whole site: the same question and answer pair must never
 * appear in FAQPage structured data on more than one URL.
 *
 * Phase 4 found that eight shared FAQ answers were half the body text of every
 * model page. The structured-data version of the same problem is worse: it
 * asks Google to pick a canonical answer from 90 identical candidates, and
 * gives it no reason to prefer any of them.
 *
 *   pnpm exec tsx scripts/test-faq-scoping.ts http://localhost:3100
 */

import { REPAIRS } from "../lib/content/repairs";
import { ROUTES } from "../lib/routes";
import { SERVICES } from "../lib/content/services";

const BASE = process.argv[2] ?? "http://localhost:3100";
const MAX_PER_PAGE = 6;

/**
 * /faq is the canonical home of the site-wide questions, so the six-question
 * cap does not apply to it. That is the rule working, not an exception to it:
 * the cap exists to stop the global set being copied onto every other page,
 * and the "appears on 2+ URLs" check below is what proves it has not been.
 */
const CANONICAL_FAQ_PAGE = "/faq";

interface Question {
  question: string;
  answer: string;
}

/** Pulls every FAQPage node out of a page's JSON-LD graph. */
function faqQuestions(html: string): Question[] {
  const out: Question[] = [];

  for (const match of html.matchAll(
    /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
  )) {
    let parsed: unknown;
    try {
      parsed = JSON.parse((match[1] as string).replace(/&quot;/g, '"'));
    } catch {
      continue;
    }

    const graph = (parsed as { "@graph"?: unknown[] })["@graph"] ?? [parsed];

    for (const node of graph as Record<string, unknown>[]) {
      if (node?.["@type"] !== "FAQPage") continue;
      const entities = (node.mainEntity ?? []) as Record<string, unknown>[];
      for (const entity of entities) {
        const question = String(entity.name ?? "").trim();
        const answer = String(
          (entity.acceptedAnswer as Record<string, unknown> | undefined)?.text ?? "",
        ).trim();
        if (question && answer) out.push({ question, answer });
      }
    }
  }

  return out;
}

async function main() {
  console.log(`\nFAQ scoping, ${BASE}\n`);

  /* Every page that could carry an FAQ block. */
  const paths = [
    ...ROUTES.filter((entry) => entry.status === "built" && !entry.path.includes("."))
      .filter((entry) => !entry.path.startsWith("/studio") && !entry.path.startsWith("/styleguide"))
      .filter((entry) => !entry.path.startsWith("/api"))
      .map((entry) => entry.path),
    ...SERVICES.map((entry) => `/services/${entry.slug}`),
    ...REPAIRS.map((entry) => `/repairs/${entry.slug}`),
  ];

  /* Plus every model page, discovered from the price list. */
  const priceHtml = await (await fetch(`${BASE}/repair-prices`)).text();
  const modelPaths = [
    ...new Set(
      Array.from(priceHtml.matchAll(/href="(\/repair\/[^"/]+\/[^"]+)"/g)).map(
        (match) => match[1] as string,
      ),
    ),
  ];

  const allPaths = [...new Set([...paths, ...modelPaths])].sort();

  console.log(`Reading FAQPage structured data from ${allPaths.length} pages...\n`);

  /** question+answer key -> the URLs that emit it. */
  const seen = new Map<string, string[]>();
  const perPage = new Map<string, number>();
  let failures = 0;

  for (const path of allPaths) {
    const response = await fetch(`${BASE}${path}`);
    if (!response.ok) continue;

    const questions = faqQuestions(await response.text());
    perPage.set(path, questions.length);

    if (path !== CANONICAL_FAQ_PAGE && questions.length > MAX_PER_PAGE) {
      failures += 1;
      console.log(
        `  FAIL ${path} emits ${questions.length} questions, the limit is ${MAX_PER_PAGE}`,
      );
    }

    for (const entry of questions) {
      const key = `${entry.question.toLowerCase()}||${entry.answer.toLowerCase()}`;
      seen.set(key, [...(seen.get(key) ?? []), path]);
    }
  }

  /* --- the site-wide rule ------------------------------------------- */
  const duplicated = [...seen.entries()].filter(([, urls]) => urls.length > 1);

  const withFaqs = [...perPage.entries()].filter(([, count]) => count > 0);
  const total = withFaqs.reduce((sum, [, count]) => sum + count, 0);

  console.log(`Pages carrying FAQPage data : ${withFaqs.length} of ${allPaths.length}`);
  console.log(`Total question and answer pairs: ${total}`);
  console.log(`Distinct pairs                 : ${seen.size}`);
  console.log(`Pairs appearing on 2+ URLs     : ${duplicated.length}`);

  if (duplicated.length > 0) {
    failures += duplicated.length;
    console.log(`\nDuplicated across URLs:`);
    for (const [key, urls] of duplicated.slice(0, 10)) {
      console.log(`  FAIL "${key.split("||")[0]}"`);
      console.log(
        `       on ${urls.length} URLs: ${urls.slice(0, 4).join(", ")}${urls.length > 4 ? ", ..." : ""}`,
      );
    }
  }

  const distribution = new Map<number, number>();
  for (const [, count] of perPage) distribution.set(count, (distribution.get(count) ?? 0) + 1);
  console.log(`\nQuestions per page:`);
  for (const [count, pages] of [...distribution.entries()].sort((a, b) => a[0] - b[0])) {
    console.log(
      `  ${String(count).padStart(2)} questions   ${"#".repeat(Math.min(pages, 50))} ${pages} pages`,
    );
  }

  console.log("\n" + "=".repeat(70));
  if (failures === 0) {
    console.log("PASS: every question and answer pair is unique to one URL.\n");
    return;
  }
  console.log(`FAIL: ${failures} scoping problems.\n`);
  process.exit(1);
}

main().catch((error) => {
  console.error("test-faq-scoping failed:", error);
  process.exit(1);
});

export {};
