/**
 * Non-canonical hosts must not be indexable.
 *
 * Phase 5 pointed the deployment's canonicals at the production domain, which
 * left the staging host serving a fully crawlable copy of the site whose
 * canonicals name a domain that currently hosts the client's old Wix site.
 * middleware.ts closes that. This proves it, in both directions, because a
 * noindex rule that also fires on the real domain would be worse than no rule
 * at all.
 *
 *   pnpm exec tsx scripts/test-staging-noindex.ts https://techbrotherz.vercel.app
 *
 * Against localhost it verifies the exemption instead: a local host is neither
 * canonical nor reachable by Google, and putting noindex on it would make every
 * local audit disagree with production.
 */

const BASE = process.argv[2] ?? "http://localhost:3100";
const CANONICAL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://techbrotherz.com";

const PATHS = ["/", "/repair-prices", "/services/laptop-repair"];

function hostOf(url: string): string {
  return new URL(url).host.toLowerCase();
}

async function main() {
  const host = hostOf(BASE);
  const canonicalHost = hostOf(CANONICAL);
  const isLocal = host.startsWith("localhost") || host.startsWith("127.0.0.1");
  const isCanonical = host === canonicalHost;

  console.log(`\nStaging noindex, ${BASE}`);
  console.log(`  canonical host : ${canonicalHost}`);
  console.log(`  this host      : ${host}`);
  console.log(
    `  expectation    : ${isCanonical || isLocal ? "indexable, no directive" : "noindex, nofollow, and a disallow-all robots.txt"}\n`,
  );

  let failures = 0;

  /* --- the X-Robots-Tag header on real pages ------------------------- */
  for (const path of PATHS) {
    const response = await fetch(`${BASE}${path}`);
    const tag = (response.headers.get("x-robots-tag") ?? "").toLowerCase();

    if (isCanonical || isLocal) {
      const bad = tag.includes("noindex");
      if (bad) {
        failures += 1;
        console.log(`  FAIL ${path} carries "${tag}" on a host that should be indexable`);
      } else {
        console.log(`  pass ${path} has no noindex directive`);
      }
      continue;
    }

    const ok = tag.includes("noindex") && tag.includes("nofollow");
    if (!ok) {
      failures += 1;
      console.log(
        `  FAIL ${path} X-Robots-Tag is "${tag || "absent"}", expected noindex, nofollow`,
      );
    } else {
      console.log(`  pass ${path} X-Robots-Tag: ${tag}`);
    }
  }

  /* --- robots.txt ---------------------------------------------------- */
  const robots = await (await fetch(`${BASE}/robots.txt`)).text();
  const disallowsEverything = /^\s*disallow:\s*\/\s*$/im.test(robots);

  if (isCanonical || isLocal) {
    if (disallowsEverything) {
      failures += 1;
      console.log(`  FAIL robots.txt disallows everything on a host that should be crawlable`);
    } else {
      console.log(`  pass robots.txt allows crawling`);
    }
  } else if (!disallowsEverything) {
    failures += 1;
    console.log(`  FAIL robots.txt does not disallow everything on a non-canonical host`);
    console.log(`       got: ${robots.replace(/\s+/g, " ").slice(0, 120)}`);
  } else {
    console.log(`  pass robots.txt disallows everything`);
  }

  /* --- the canonical link still names the production domain ---------- */
  const html = await (await fetch(`${BASE}/repair-prices`)).text();
  const canonicalLink = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1] ?? "";
  if (!isLocal && !canonicalLink.startsWith(CANONICAL)) {
    failures += 1;
    console.log(`  FAIL canonical is "${canonicalLink}", expected it under ${CANONICAL}`);
  } else if (!isLocal) {
    console.log(`  pass canonical points at ${canonicalHost}`);
  }

  console.log("\n" + "=".repeat(70));
  if (failures === 0) {
    console.log("PASS: indexability matches the host.\n");
    return;
  }
  console.log(`FAIL: ${failures} problems.\n`);
  process.exit(1);
}

main().catch((error) => {
  console.error("test-staging-noindex failed:", error);
  process.exit(1);
});

export {};
