/**
 * Structural validation of the JSON-LD graph, one page per template.
 *
 * Google's Rich Results Test has no public API, so it has to be run by hand.
 * This checks mechanically the things that test reports as errors and
 * warnings, so a broken graph is caught in CI rather than by remembering to
 * paste four URLs into a browser.
 *
 *   pnpm exec tsx scripts/validate-schema.ts https://techbrotherz.vercel.app
 */

const BASE = process.argv[2] ?? "http://localhost:3100";

/**
 * On localhost the @id values correctly carry the localhost origin, because
 * that is what NEXT_PUBLIC_SITE_URL is set to for local development. Flagging
 * them would make this check disagree with a correct local build, so the
 * origin assertions only run against a deployed host.
 */
const IS_LOCAL = /^https?:\/\/(localhost|127\.0\.0\.1)/.test(BASE);

interface Node {
  [key: string]: unknown;
  "@type"?: string | string[];
  "@id"?: string;
}

const TEMPLATES = [
  { path: "/", label: "home" },
  { path: "/repair-prices", label: "price list" },
  { path: "/repair/apple-iphone", label: "brand hub" },
  { path: "/repair/apple-iphone/iphone-8-plus", label: "model, priced" },
  { path: "/repair/apple-iphone/iphone-16", label: "model, quote-only" },
  { path: "/services/laptop-repair", label: "Tier 2 service hub" },
  { path: "/repairs/iphone-screen-replacement", label: "Tier 3 repair page" },
  { path: "/repairs/computer-diagnostics", label: "Tier 3, flat priced" },
  { path: "/phone-repair-calgary", label: "Tier 5 service and place" },
  { path: "/cell-phone-repair-chestermere", label: "Tier 5, out of city" },
  { path: "/locations/calgary", label: "Tier 6 place hub" },
  { path: "/locations/calgary/forest-lawn", label: "Tier 6 neighbourhood" },
  { path: "/locations/chestermere", label: "Tier 6, out of city" },
];

function graphOf(html: string): Node[] {
  const scripts = [
    ...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g),
  ];
  const nodes: Node[] = [];
  for (const script of scripts) {
    const parsed = JSON.parse((script[1] as string).replace(/&quot;/g, '"'));
    nodes.push(...((parsed["@graph"] as Node[]) ?? [parsed]));
  }
  return nodes;
}

function typeOf(node: Node): string {
  const t = node["@type"];
  return Array.isArray(t) ? t.join("+") : (t ?? "?");
}

/** Walks every nested object, so a hole three levels down is still found. */
function walk(value: unknown, visit: (node: Node, path: string) => void, path = "$") {
  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, visit, `${path}[${index}]`));
    return;
  }
  if (value && typeof value === "object") {
    visit(value as Node, path);
    for (const [key, child] of Object.entries(value)) walk(child, visit, `${path}.${key}`);
  }
}

async function main() {
  console.log(`\nStructured data validation, ${BASE}\n`);
  let failures = 0;
  const businessIds = new Set<string>();

  for (const template of TEMPLATES) {
    const response = await fetch(`${BASE}${template.path}`);
    if (!response.ok) {
      console.log(`  FAIL ${template.path} returned ${response.status}`);
      failures += 1;
      continue;
    }

    const html = await response.text();
    const scriptCount = [...html.matchAll(/<script type="application\/ld\+json"/g)].length;
    const nodes = graphOf(html);
    const types = nodes.map(typeOf);

    const problems: string[] = [];

    // One script, one @graph. CLAUDE.md Section 8.2.
    if (scriptCount !== 1) problems.push(`${scriptCount} ld+json scripts, expected exactly 1`);

    // Every page carries the business, the site and a breadcrumb trail.
    for (const required of ["Organization", "WebSite", "BreadcrumbList"]) {
      if (!types.some((t) => t.includes(required))) problems.push(`missing ${required}`);
    }

    walk(nodes, (node, path) => {
      const type = node["@type"];

      if (typeof type === "string" && type.includes("LocalBusiness")) {
        if (typeof node["@id"] === "string") businessIds.add(node["@id"]);
      }
      if (Array.isArray(type) && type.some((t) => String(t).includes("LocalBusiness"))) {
        if (typeof node["@id"] === "string") businessIds.add(node["@id"]);
      }

      // No holes: compact() should have stripped these before output.
      for (const [key, value] of Object.entries(node)) {
        if (value === null) problems.push(`null at ${path}.${key}`);
        if (value === "") problems.push(`empty string at ${path}.${key}`);
        if (Array.isArray(value) && value.length === 0)
          problems.push(`empty array at ${path}.${key}`);
      }

      // The rule Phase 4 established: never an Offer without a price.
      if (type === "Offer") {
        if (typeof node.price !== "number") problems.push(`Offer with no numeric price at ${path}`);
        if (node.priceCurrency !== "CAD") problems.push(`Offer not in CAD at ${path}`);
      }

      // A Question must carry a real answer.
      if (type === "Question") {
        const answer = node.acceptedAnswer as Node | undefined;
        const text = answer?.text;
        if (typeof text !== "string" || text.trim().length < 20) {
          problems.push(`Question with a thin or missing answer at ${path}`);
        }
      }

      // Every node that claims an @id should use the canonical origin.
      const id = node["@id"];
      if (!IS_LOCAL && typeof id === "string") {
        if (id.startsWith("http") && !id.startsWith("https://")) {
          problems.push(`insecure @id ${id}`);
        }
        if (/localhost/.test(id)) {
          problems.push(`localhost @id ${id}`);
        }
      }
    });

    const offers = types.filter((t) => t === "Offer").length;
    const summary = [...new Set(types)].join(", ");

    if (problems.length === 0) {
      console.log(`  pass  ${template.path}`);
      console.log(`        ${template.label}: ${nodes.length} nodes`);
      console.log(`        ${summary}`);
      if (offers > 0) console.log(`        ${offers} Offer nodes, all priced in CAD`);
    } else {
      failures += problems.length;
      console.log(`  FAIL  ${template.path} (${template.label})`);
      for (const problem of [...new Set(problems)].slice(0, 6)) console.log(`        ${problem}`);
    }
  }

  console.log("\n" + "=".repeat(70));
  if (failures === 0) {
    console.log(`PASS: ${TEMPLATES.length} templates, no holes and no price-less Offers.\n`);
    console.log("Rich Results itself has no public API. Run it by hand against the");
    console.log("four URLs listed in CLAUDE.md Section 12.1.\n");
    return;
  }
  console.log(`FAIL: ${failures} structured-data problems.\n`);
  process.exit(1);
}

main().catch((error) => {
  console.error("validate-schema failed:", error);
  process.exit(1);
});

export {};
