/**
 * Browser-driven verification: Lighthouse, axe, hydration warnings and the
 * contact form paths.
 *
 * Uses the Chrome already installed on the machine through puppeteer-core, so
 * nothing downloads a second browser.
 *
 *   pnpm exec tsx scripts/audit-browser.ts http://localhost:3100
 */

import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

import puppeteer, { type Browser, type Page } from "puppeteer-core";

const require = createRequire(import.meta.url);
const BASE = process.argv[2] ?? "http://localhost:3100";
const DEBUG_PORT = 9333;

const CHROME_CANDIDATES = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
];

const AUDIT_PAGES = [
  "/",
  "/repair-prices",
  "/contact",
  // Phase 5 templates: one Tier 2 hub and one Tier 3 repair page, both of
  // which carry tables that keyboard and axe need to see.
  "/services/laptop-repair",
  "/repairs/iphone-screen-replacement",
  // Phase 6 templates.
  "/phone-repair-calgary",
  "/locations/calgary",
];

let failures = 0;
function fail(detail: string) {
  failures += 1;
  console.log(`  FAIL  ${detail}`);
}

function findChrome(): string {
  for (const candidate of CHROME_CANDIDATES) {
    try {
      readFileSync(candidate);
      return candidate;
    } catch {
      // try the next one
    }
  }
  throw new Error("No Chrome or Edge binary found.");
}

/* ------------------------------------------------- console and hydration */

/**
 * React reports a hydration mismatch through console.error with a recognisable
 * message. Anything matching is a real defect: it means the server HTML and the
 * first client render disagreed.
 */
const HYDRATION_PATTERNS = [
  /hydrat/i,
  /did not match/i,
  /text content does not match/i,
  /server rendered HTML/i,
];

async function collectConsole(browser: Browser, path: string) {
  const page = await browser.newPage();
  const messages: { type: string; text: string }[] = [];

  page.on("console", (message) => {
    messages.push({ type: message.type(), text: message.text() });
  });
  page.on("pageerror", (error) => {
    messages.push({ type: "pageerror", text: String(error) });
  });

  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle0", timeout: 90_000 });
  // Give React a moment past hydration.
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const errors = messages.filter((m) => m.type === "error" || m.type === "pageerror");
  const hydration = errors.filter((m) => HYDRATION_PATTERNS.some((p) => p.test(m.text)));

  console.log(
    `  ${path.padEnd(16)} console errors: ${errors.length}, hydration warnings: ${hydration.length}`,
  );

  for (const message of hydration) fail(`${path} hydration: ${message.text.slice(0, 160)}`);
  for (const message of errors.filter((m) => !hydration.includes(m))) {
    console.log(`         other error: ${message.text.slice(0, 160)}`);
  }

  return page;
}

/* ------------------------------------------------------------------- axe */

async function runAxe(page: Page, path: string) {
  const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
  await page.evaluate(axeSource);

  const results = (await page.evaluate(async () => {
    // @ts-expect-error injected above
    return await window.axe.run(document, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"],
      },
    });
  })) as {
    violations: {
      id: string;
      impact: string;
      help: string;
      nodes: { html: string; target: string[]; failureSummary?: string }[];
    }[];
  };

  const serious = results.violations.filter(
    (violation) => violation.impact === "critical" || violation.impact === "serious",
  );

  console.log(
    `  ${path.padEnd(16)} axe violations: ${results.violations.length} (serious or critical: ${serious.length})`,
  );

  for (const violation of results.violations) {
    const line = `${violation.id} [${violation.impact}] ${violation.help}, ${violation.nodes.length} nodes`;
    if (violation.impact === "critical" || violation.impact === "serious") fail(`${path} ${line}`);
    else console.log(`         minor: ${line}`);

    // Print the offending node, otherwise a violation count is unactionable.
    for (const node of violation.nodes.slice(0, 3)) {
      console.log(`           at ${node.target.join(" ")}`);
      console.log(`           ${node.html.replace(/\s+/g, " ").slice(0, 150)}`);
      const summary = node.failureSummary?.replace(/\s+/g, " ").slice(0, 180);
      if (summary) console.log(`           ${summary}`);
    }
  }
}

/* ------------------------------------------------------------ lighthouse */

async function runLighthouse(path: string) {
  const lighthouse = (await import("lighthouse")).default;

  const result = await lighthouse(
    `${BASE}${path}`,
    { port: DEBUG_PORT, output: "json", logLevel: "error" },
    undefined,
  );

  if (!result?.lhr) {
    fail(`${path} lighthouse produced no result`);
    return;
  }

  const categories = result.lhr.categories;
  const audits = result.lhr.audits;

  const scores = {
    performance: Math.round((categories.performance?.score ?? 0) * 100),
    accessibility: Math.round((categories.accessibility?.score ?? 0) * 100),
    bestPractices: Math.round((categories["best-practices"]?.score ?? 0) * 100),
    seo: Math.round((categories.seo?.score ?? 0) * 100),
  };

  const lcp = audits["largest-contentful-paint"]?.displayValue ?? "n/a";
  const cls = audits["cumulative-layout-shift"]?.displayValue ?? "n/a";
  const tbt = audits["total-blocking-time"]?.displayValue ?? "n/a";

  console.log(
    `  ${path.padEnd(16)} perf ${String(scores.performance).padStart(3)}  a11y ${String(
      scores.accessibility,
    ).padStart(3)}  bp ${String(scores.bestPractices).padStart(3)}  seo ${String(
      scores.seo,
    ).padStart(3)}   LCP ${lcp}  CLS ${cls}  TBT ${tbt}`,
  );

  /* What the LCP element actually is, and where the time went. */
  const lcpElement = audits["largest-contentful-paint-element"];
  const lcpDetail = (
    lcpElement?.details as { items?: { items?: { node?: { snippet?: string } }[] }[] } | undefined
  )?.items?.[0]?.items?.[0]?.node?.snippet;
  if (lcpDetail)
    console.log(`         LCP element: ${lcpDetail.replace(/\s+/g, " ").slice(0, 110)}`);

  const opportunities = Object.values(audits)
    .filter(
      (audit) =>
        audit.details?.type === "opportunity" &&
        typeof audit.numericValue === "number" &&
        audit.numericValue > 100,
    )
    .sort((a, b) => (b.numericValue ?? 0) - (a.numericValue ?? 0))
    .slice(0, 4);

  for (const opportunity of opportunities) {
    console.log(
      `         opportunity: ${opportunity.title} (${Math.round(opportunity.numericValue ?? 0)} ms)`,
    );
  }

  for (const [name, score] of Object.entries(scores)) {
    if (score < 95) fail(`${path} lighthouse ${name} is ${score}, target is 95`);
  }
}

/* ------------------------------------------------------------ the form */

async function testContactForm(browser: Browser) {
  console.log("\nContact form");

  /* --- invalid submit --------------------------------------------- */
  {
    const page = await browser.newPage();
    await page.goto(`${BASE}/contact`, { waitUntil: "networkidle0", timeout: 90_000 });
    await page.type("#contact-name", "A");
    await page.type("#contact-contact", "x");
    await page.type("#contact-message", "short");
    await page.click('button[type="submit"]');
    await page.waitForSelector('[role="status"]', { timeout: 30_000 });
    const text = await page.$eval('[role="status"]', (el) => el.textContent ?? "");
    const errorCount = await page.$$eval('[id$="-error"]', (nodes) => nodes.length);
    console.log(`  invalid submit   -> "${text.trim().slice(0, 60)}", ${errorCount} field errors`);
    if (!/check the highlighted fields/i.test(text)) fail("invalid submit did not report an error");
    if (errorCount < 3) fail(`invalid submit surfaced ${errorCount} field errors, expected 3`);
    await page.close();
  }

  /* --- honeypot ---------------------------------------------------- */
  {
    const page = await browser.newPage();
    await page.goto(`${BASE}/contact`, { waitUntil: "networkidle0", timeout: 90_000 });
    await page.type("#contact-name", "Bot Test");
    await page.type("#contact-contact", "bot@example.com");
    await page.type("#contact-message", "This submission fills the hidden honeypot field.");
    await page.evaluate(() => {
      const honeypot = document.querySelector<HTMLInputElement>("#contact-website");
      if (honeypot) honeypot.value = "https://spam.example";
    });
    await page.click('button[type="submit"]');
    await page.waitForSelector('[role="status"]', { timeout: 30_000 });
    const text = await page.$eval('[role="status"]', (el) => el.textContent ?? "");
    console.log(`  honeypot tripped -> "${text.trim().slice(0, 60)}"`);
    // It must look like success to the bot, and must not mention email delivery.
    if (!/received/i.test(text)) fail("honeypot response did not look like a silent success");
    await page.close();
  }

  /* --- valid submit, no Resend key --------------------------------- */
  {
    const page = await browser.newPage();
    await page.goto(`${BASE}/contact`, { waitUntil: "networkidle0", timeout: 90_000 });
    await page.type("#contact-name", "Jordan Reid");
    await page.type("#contact-contact", "403 555 0142");
    await page.type("#contact-device", "iPhone 12");
    await page.type(
      "#contact-message",
      "The screen is cracked across the top corner but the display still works. What does a replacement cost?",
    );
    await page.click('button[type="submit"]');
    await page.waitForSelector('[role="status"]', { timeout: 30_000 });
    const text = await page.$eval('[role="status"]', (el) => el.textContent ?? "");
    console.log(`  valid submit     -> "${text.trim().slice(0, 90)}"`);
    if (!/thank you/i.test(text)) fail("valid submit did not confirm receipt");
    if (process.env.RESEND_API_KEY) {
      if (!/has been sent/i.test(text))
        fail("valid submit with a Resend key did not confirm sending");
    } else if (!/call/i.test(text)) {
      fail("valid submit without a Resend key did not fall back to the phone number");
    }
    await page.close();
  }
}

/* ------------------------------------------------------------------- run */

async function main() {
  const executablePath = findChrome();
  console.log(`\nChrome: ${executablePath}`);
  console.log(`Target: ${BASE}\n`);

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: [`--remote-debugging-port=${DEBUG_PORT}`, "--no-sandbox", "--disable-dev-shm-usage"],
  });

  try {
    console.log("Console and hydration");
    const pages: Page[] = [];
    for (const path of AUDIT_PAGES) pages.push(await collectConsole(browser, path));

    console.log("\nAccessibility, axe-core");
    for (let index = 0; index < AUDIT_PAGES.length; index += 1) {
      await runAxe(pages[index] as Page, AUDIT_PAGES[index] as string);
    }
    for (const page of pages) await page.close();

    await testContactForm(browser);

    console.log("\nLighthouse");
    for (const path of AUDIT_PAGES) await runLighthouse(path);
  } finally {
    await browser.close();
  }

  console.log("\n" + "=".repeat(72));
  if (failures === 0) {
    console.log("PASS: no browser-level failures.\n");
    return;
  }
  console.log(`FAIL: ${failures} problems, listed above.\n`);
  process.exit(1);
}

main().catch((error) => {
  console.error("audit-browser failed:", error);
  process.exit(1);
});
