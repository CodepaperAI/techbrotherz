/**
 * The 404 suggester, tested against the paths people actually arrive on.
 *
 * The 156 seeded aliases exist for this: a typo, an old Wix address, or a
 * model number typed into the bar should still reach a price. Matching happens
 * in the browser because an unmatched route cannot know its own path on the
 * server, so this drives a real one.
 *
 *   pnpm exec tsx scripts/test-not-found.ts http://localhost:3100
 */

import { readFileSync } from "node:fs";

import puppeteer from "puppeteer-core";

const BASE = process.argv[2] ?? "http://localhost:3100";

/** Each case is a path someone could plausibly land on, and what should surface. */
const CASES = [
  {
    path: "/repair/apple-Iphone/Iphone-8-pluss",
    expect: "Iphone 8 Plus",
    why: "a typo in the slug",
  },
  { path: "/Iphone-8-plus", expect: "Iphone 8 Plus", why: "the model slug at the site root" },
  { path: "/A1864", expect: "Iphone 8 Plus", why: "a raw Apple model number from the aliases" },
  { path: "/galaxy-s7-edge-screen", expect: "Galaxy S7 Edge", why: "a model plus a repair word" },
  { path: "/SM-G935W8", expect: "Galaxy S7 Edge", why: "a Samsung part number from the aliases" },
];

function findChrome(): string {
  for (const candidate of [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  ]) {
    try {
      readFileSync(candidate);
      return candidate;
    } catch {
      // next
    }
  }
  throw new Error("No Chrome binary found.");
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: true,
    args: ["--no-sandbox"],
  });

  let failures = 0;

  try {
    console.log(`\n404 suggester, ${BASE}\n`);

    for (const testCase of CASES) {
      const page = await browser.newPage();
      const response = await page.goto(`${BASE}${testCase.path}`, {
        waitUntil: "networkidle0",
        timeout: 90_000,
      });

      const status = response?.status() ?? 0;
      await new Promise((resolve) => setTimeout(resolve, 600));

      const suggestions = await page.$$eval("a", (nodes) =>
        nodes
          .map((node) => ({
            text: (node.textContent ?? "").trim(),
            href: node.getAttribute("href") ?? "",
          }))
          // "repair details" until the price list came out, "repair prices"
          // before it. Matching the suffix rather than the whole label keeps
          // this test about the suggestion logic rather than the wording.
          .filter(
            (entry) => entry.href.includes("/repair/") && entry.text.includes("repair details"),
          ),
      );

      const hit = suggestions.some((entry) => entry.text.includes(testCase.expect));
      const top = suggestions[0]?.text ?? "none";

      console.log(
        `  ${status === 404 ? "404" : String(status)}  ${testCase.path.padEnd(38)} -> ${hit ? "pass" : "FAIL"}  top suggestion: ${top}`,
      );
      console.log(`       ${testCase.why}, expecting ${testCase.expect}`);

      if (status !== 404) {
        failures += 1;
        console.log(`       FAIL: expected a 404 status, got ${status}`);
      }
      if (!hit) {
        failures += 1;
        console.log(`       FAIL: ${testCase.expect} was not among the suggestions`);
      }

      await page.close();
    }
  } finally {
    await browser.close();
  }

  console.log("\n" + "=".repeat(66));
  if (failures === 0) {
    console.log("PASS: every 404 resolved to the right model page.\n");
    return;
  }
  console.log(`FAIL: ${failures} problems.\n`);
  process.exit(1);
}

main().catch((error) => {
  console.error("test-not-found failed:", error);
  process.exit(1);
});
