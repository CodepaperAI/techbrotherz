/**
 * Measures DOM size and client-side work on the heaviest pages, so a decision
 * about splitting /repair-prices is made on numbers rather than instinct.
 *
 *   pnpm exec tsx scripts/measure-dom.ts http://localhost:3100
 */

import { readFileSync } from "node:fs";

import puppeteer from "puppeteer-core";

const BASE = process.argv[2] ?? "http://localhost:3100";
const PAGES = ["/", "/repair-prices", "/contact", "/faq"];

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

  console.log(`\nDOM and transfer, ${BASE}\n`);
  console.log(
    "page".padEnd(17) +
      "nodes".padEnd(9) +
      "depth".padEnd(8) +
      "html".padEnd(10) +
      "gzip".padEnd(9) +
      "js".padEnd(9) +
      "requests",
  );
  console.log("-".repeat(70));

  for (const path of PAGES) {
    const page = await browser.newPage();

    let jsBytes = 0;
    let requests = 0;

    page.on("response", (response) => {
      requests += 1;
      const type = response.headers()["content-type"] ?? "";
      const length = Number(response.headers()["content-length"] ?? 0);
      if (type.includes("javascript")) jsBytes += length;
    });

    await page.goto(`${BASE}${path}`, { waitUntil: "networkidle0", timeout: 90_000 });

    const stats = await page.evaluate(() => {
      const all = document.querySelectorAll("*");
      let maxDepth = 0;
      for (const node of Array.from(all)) {
        let depth = 0;
        let current: Element | null = node;
        while (current) {
          depth += 1;
          current = current.parentElement;
        }
        if (depth > maxDepth) maxDepth = depth;
      }
      return { nodes: all.length, depth: maxDepth };
    });

    const raw = await (await fetch(`${BASE}${path}`)).text();
    const rawKb = Buffer.byteLength(raw, "utf8") / 1024;

    const gzipResponse = await fetch(`${BASE}${path}`, {
      headers: { "accept-encoding": "gzip" },
    });
    const gzipKb = Number(gzipResponse.headers.get("content-length") ?? 0) / 1024;

    console.log(
      path.padEnd(17) +
        String(stats.nodes).padEnd(9) +
        String(stats.depth).padEnd(8) +
        `${rawKb.toFixed(0)} KB`.padEnd(10) +
        (gzipKb > 0 ? `${gzipKb.toFixed(0)} KB` : "n/a").padEnd(9) +
        `${(jsBytes / 1024).toFixed(0)} KB`.padEnd(9) +
        String(requests),
    );

    await page.close();
  }

  console.log(
    "\nLighthouse warns above 1,400 DOM nodes and errors above 2,500. React has to\nreconcile every one of them during hydration, which is what total blocking\ntime measures.\n",
  );

  await browser.close();
}

main().catch((error) => {
  console.error("measure-dom failed:", error);
  process.exit(1);
});
