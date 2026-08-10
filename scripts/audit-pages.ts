/**
 * Static verification over the rendered HTML of every built page.
 *
 * Covers the acceptance criteria that can be checked from the server output
 * alone, with no browser: status codes, heading structure, JSON-LD hygiene,
 * canonicals, hreflang, Open Graph, and the size and row count of the price
 * list. Anything needing a real browser lives in audit-browser.ts.
 *
 *   pnpm exec tsx scripts/audit-pages.ts http://localhost:3100
 */

const BASE = process.argv[2] ?? "http://localhost:3100";

const PAGES = [
  "/",
  "/services",
  "/locations",
  "/faq",
  "/about",
  "/contact",
  "/warranty",
  "/privacy-policy",
  "/terms",
];

/** Added in Phase 4: one brand hub, one priced model, one quote-only model. */
const PROGRAMMATIC_PAGES = [
  "/repair/apple-iphone",
  "/repair/apple-ipad",
  "/repair/apple-iphone/iphone-8-plus",
  "/repair/apple-iphone/iphone-16",
];

/**
 * Added in Phase 5: every Tier 2 service hub and a spread of Tier 3 repair
 * pages covering both table shapes, the cross-model price table and the
 * comparison table used where no per-model prices exist.
 */
const TIER_2_3_PAGES = [
  "/services/phone-repair",
  "/services/tablet-repair",
  "/services/laptop-repair",
  "/services/computer-repair",
  "/services/phone-unlocking",
  "/services/password-reset",
  "/services/virus-removal",
  "/repairs/iphone-screen-replacement",
  "/repairs/samsung-screen-replacement",
  "/repairs/ipad-screen-replacement",
  "/repairs/iphone-camera-repair",
  "/repairs/laptop-screen-replacement",
  "/repairs/computer-diagnostics",
];

/** Phase 6: the local tiers. */
const TIER_5_6_PAGES = [
  "/phone-repair-calgary",
  "/iphone-screen-repair-calgary",
  "/laptop-repair-calgary",
  "/walk-in-phone-repair-calgary",
  "/cell-phone-repair-chestermere",
  "/locations/calgary",
  "/locations/calgary/forest-lawn",
  "/locations/chestermere",
];

const EXPECTED_404 = [
  "/this-page-does-not-exist",
  // Phase 6 cuts. Nothing was ever live at these, so they 404 rather than
  // redirect. content/local-inventory.md records the four-fact rule that cut
  // the Airdrie pages and the seven Calgary neighbourhoods.
  "/cell-phone-repair-airdrie",
  "/laptop-repair-airdrie",
  "/laptop-repair-chestermere",
  "/same-day-phone-repair-calgary",
  "/locations/airdrie",
  "/locations/calgary/inglewood",
  "/locations/calgary/ogden",
  // The pre-Phase-5 Tier 2 and Tier 3 URLs. Nothing was ever live at these,
  // so they 404 rather than redirect. CLAUDE.md Section 7.
  "/services/iphone-repair",
  "/services/samsung-repair",
  "/services/ipad-repair",
  "/services/iphone-repair/screen-replacement",
  "/services/computer-repair/tune-up",
  // Unpublished model: seeded but held back for want of written content.
  "/repair/apple-iphone/iphone-12-mini",
  // Right model, wrong brand. A 404, deliberately, not a redirect.
  "/repair/samsung-galaxy/iphone-8-plus",
  // Unknown brand entirely.
  "/repair/nokia/lumia-900",
];

interface Failure {
  page: string;
  detail: string;
}

const failures: Failure[] = [];

function fail(page: string, detail: string) {
  failures.push({ page, detail });
}

/* --------------------------------------------------------------- helpers */

function decode(input: string): string {
  return input
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&rsquo;/g, "’");
}

/** Every heading in document order, with its level. */
function headings(html: string): { level: number; text: string }[] {
  const found: { level: number; text: string }[] = [];
  const pattern = /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi;

  let match: RegExpExecArray | null;
  while ((match = pattern.exec(html)) !== null) {
    const level = Number(match[1] ?? 0);
    const inner = match[2] ?? "";
    found.push({
      level,
      text: decode(
        inner
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim(),
      ).slice(0, 70),
    });
  }
  return found;
}

function jsonLdBlocks(html: string): unknown[] {
  const pattern = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  const blocks: unknown[] = [];

  let match: RegExpExecArray | null;
  while ((match = pattern.exec(html)) !== null) {
    try {
      blocks.push(JSON.parse((match[1] ?? "").replace(/\\u003c/g, "<")));
    } catch (error) {
      blocks.push({ __parseError: String(error) });
    }
  }
  return blocks;
}

/** Walks a JSON-LD payload looking for anything that would read as a hole. */
function findHoles(value: unknown, path = "$"): string[] {
  const holes: string[] = [];

  if (value === null) return [`${path} is null`];
  if (value === undefined) return [`${path} is undefined`];

  if (Array.isArray(value)) {
    if (value.length === 0) return [`${path} is an empty array`];
    value.forEach((item, index) => holes.push(...findHoles(item, `${path}[${index}]`)));
    return holes;
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return [`${path} is an empty object`];
    for (const [key, item] of entries) holes.push(...findHoles(item, `${path}.${key}`));
    return holes;
  }

  if (typeof value === "string" && value.trim() === "") return [`${path} is an empty string`];
  if (typeof value === "number" && Number.isNaN(value)) return [`${path} is NaN`];

  return holes;
}

/**
 * The properties Google requires, or strongly expects, per type. Not a
 * substitute for the live Rich Results Test, which needs a public URL, but it
 * catches the mistakes that tool reports.
 */
const REQUIRED_BY_TYPE: Record<string, string[]> = {
  LocalBusiness: ["name", "address", "telephone", "url"],
  Organization: ["name", "url"],
  WebSite: ["name", "url"],
  BreadcrumbList: ["itemListElement"],
  FAQPage: ["mainEntity"],
  ItemList: ["itemListElement"],
  Service: ["name", "provider"],
  WebPage: ["name", "url"],
  AboutPage: ["name", "url"],
  ContactPage: ["name", "url"],
  CollectionPage: ["name", "url"],
};

function checkSchemaShape(page: string, graph: Record<string, unknown>) {
  const nodes = Array.isArray(graph["@graph"])
    ? (graph["@graph"] as Record<string, unknown>[])
    : [];

  if (nodes.length === 0) {
    fail(page, "JSON-LD has no @graph nodes");
    return;
  }

  for (const node of nodes) {
    const type = String(node["@type"] ?? "");
    const required = REQUIRED_BY_TYPE[type];
    if (!required) continue;

    for (const property of required) {
      if (node[property] === undefined) {
        fail(page, `${type} is missing the required property "${property}"`);
      }
    }
  }

  /* Phase 4 rule: an Offer without a price is invalid, and inventing one to
     satisfy the shape would be worse. Quote-only repairs are described by a
     Service node with a ContactAction instead. */
  const walkForOffers = (value: unknown): void => {
    if (Array.isArray(value)) {
      value.forEach(walkForOffers);
      return;
    }
    if (!value || typeof value !== "object") return;

    const node = value as Record<string, unknown>;
    if (node["@type"] === "Offer" && node.price === undefined) {
      fail(page, `Offer "${String(node.name ?? "unnamed")}" has no price`);
    }
    Object.values(node).forEach(walkForOffers);
  };
  walkForOffers(graph);

  /* FAQPage must not repeat a question. */
  for (const node of nodes) {
    if (node["@type"] !== "FAQPage") continue;
    const entities = (node.mainEntity as { name?: string }[]) ?? [];
    const seen = new Set<string>();
    for (const entity of entities) {
      const key = (entity.name ?? "").toLowerCase().trim();
      if (seen.has(key)) fail(page, `FAQPage repeats the question "${entity.name}"`);
      seen.add(key);
    }
  }
}

/* ------------------------------------------------------------------- run */

async function main() {
  console.log(`\nAuditing ${BASE}\n`);
  console.log(
    "page".padEnd(18) +
      "status".padEnd(8) +
      "h1".padEnd(5) +
      "jsonld".padEnd(8) +
      "canon".padEnd(7) +
      "hreflang".padEnd(10) +
      "og".padEnd(5) +
      "kb",
  );
  console.log("-".repeat(72));

  for (const page of [...PAGES, ...PROGRAMMATIC_PAGES, ...TIER_2_3_PAGES, ...TIER_5_6_PAGES]) {
    const response = await fetch(`${BASE}${page}`, { redirect: "manual" });
    const html = await response.text();
    const kb = Math.round(Buffer.byteLength(html, "utf8") / 1024);

    if (response.status !== 200) fail(page, `returned ${response.status}`);

    /* --- headings --------------------------------------------------- */
    const all = headings(html);
    const h1Count = all.filter((entry) => entry.level === 1).length;
    if (h1Count !== 1) fail(page, `has ${h1Count} h1 elements, expected exactly 1`);

    let previous = 0;
    for (const heading of all) {
      if (previous !== 0 && heading.level > previous + 1) {
        fail(
          page,
          `heading level jumps from h${previous} to h${heading.level} at "${heading.text}"`,
        );
      }
      previous = heading.level;
    }

    /* --- json-ld ---------------------------------------------------- */
    const blocks = jsonLdBlocks(html);
    if (blocks.length !== 1) {
      fail(
        page,
        `has ${blocks.length} JSON-LD script tags, expected exactly 1 containing a @graph`,
      );
    }

    for (const block of blocks) {
      const holes = findHoles(block);
      for (const hole of holes.slice(0, 5)) fail(page, `JSON-LD hole: ${hole}`);
      checkSchemaShape(page, block as Record<string, unknown>);
    }

    /* --- metadata --------------------------------------------------- */
    const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1];
    if (!canonical) fail(page, "has no canonical link");
    else if (!canonical.startsWith("http")) fail(page, `canonical is not absolute: ${canonical}`);

    const hreflang = /<link rel="alternate" hrefLang="en-CA" href="([^"]+)"/i.exec(html)?.[1];
    if (!hreflang) fail(page, "has no en-CA alternate");

    const ogImage = /<meta property="og:image"[^>]*content="([^"]+)"/i.exec(html)?.[1];
    if (!ogImage) fail(page, "has no og:image");

    const ogLocale = /<meta property="og:locale"[^>]*content="([^"]+)"/i.exec(html)?.[1];
    if (ogLocale !== "en_CA") fail(page, `og:locale is "${ogLocale}", expected en_CA`);

    /* --- answer box ------------------------------------------------- */
    if (!html.includes('data-speakable="answer"')) {
      fail(page, "has no AnswerBox with data-speakable");
    }

    console.log(
      page.padEnd(18) +
        String(response.status).padEnd(8) +
        String(h1Count).padEnd(5) +
        String(blocks.length).padEnd(8) +
        (canonical ? "yes" : "NO").padEnd(7) +
        (hreflang ? "yes" : "NO").padEnd(10) +
        (ogImage ? "yes" : "NO").padEnd(5) +
        String(kb),
    );
  }

  /* --- 404s -------------------------------------------------------- */
  console.log();
  for (const page of EXPECTED_404) {
    const response = await fetch(`${BASE}${page}`, { redirect: "manual" });
    console.log(
      `${page.padEnd(40)} -> ${response.status} ${response.status === 404 ? "ok" : "EXPECTED 404"}`,
    );
    if (response.status !== 404) fail(page, `returned ${response.status}, expected 404`);
  }

  /* --- retired URLs -------------------------------------------------
   *
   * /repair-prices is not a 404 and not a page. It carried the whole price
   * list, it is deleted, and next.config.ts 301s it to /contact. It was in
   * PAGES above until that deletion, which made this audit report eight
   * failures about a page that no longer exists: no h1, no canonical, no
   * AnswerBox. Asserting the redirect is the check that is actually owed,
   * because the URL had inbound links and a 301 into a 404 would be worse
   * than the page it replaced.
   */
  console.log();
  for (const [from, to] of [["/repair-prices", "/contact"]] as const) {
    const response = await fetch(`${BASE}${from}`, { redirect: "manual" });
    const target = response.headers.get("location");
    const ok = (response.status === 301 || response.status === 308) && target === to;
    console.log(`${from.padEnd(40)} -> ${response.status} ${target ?? ""} ${ok ? "ok" : "FAIL"}`);
    if (!ok) fail(from, `expected a permanent redirect to ${to}, got ${response.status} ${target}`);
  }

  /* --- pending links must not appear in a production build --------- */
  const homeHtml = await (await fetch(`${BASE}/`)).text();
  const pendingMarkers = (homeHtml.match(/>soon</g) ?? []).length;
  console.log(`\nPending-route markers rendered on /: ${pendingMarkers}`);
  if (process.env.NODE_ENV === "production" && pendingMarkers > 0) {
    fail("/", "pending route markers rendered in a production build");
  }

  /* --- report ------------------------------------------------------ */
  console.log("\n" + "=".repeat(72));
  if (failures.length === 0) {
    console.log("PASS: no failures across " + PAGES.length + " pages.\n");
    return;
  }

  console.log(`FAIL: ${failures.length} problems\n`);
  for (const failure of failures) {
    console.log(`  ${failure.page.padEnd(18)} ${failure.detail}`);
  }
  console.log();
  process.exit(1);
}

main().catch((error) => {
  console.error("audit-pages failed:", error);
  process.exit(1);
});

export {};
