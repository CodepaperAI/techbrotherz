/**
 * Captures a full-page PNG of one route, for design review.
 *
 * Phase 8 is judged by eye before any page is rebuilt, and a description of a
 * design is not a design. This writes to snapshots/shots/ so the file can be
 * opened directly.
 *
 *   pnpm exec tsx scripts/screenshot.ts /styleguide styleguide
 */

import { mkdirSync } from "node:fs";
import path from "node:path";

import puppeteer from "puppeteer-core";

const BASE = process.env.BASE_URL ?? "http://localhost:3100";
const route = process.argv[2] ?? "/styleguide";
const name = process.argv[3] ?? "shot";
const width = Number(process.argv[4] ?? 1440);

async function main() {
  mkdirSync("snapshots/shots", { recursive: true });

  /*
   * puppeteer's own Chrome download is skipped by pnpm's ignored-build-scripts
   * policy, so fall back to the system browser. CHROME_PATH overrides.
   */
  const CHROME_CANDIDATES = [
    process.env.CHROME_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  ].filter((entry): entry is string => Boolean(entry));

  const { existsSync } = await import("node:fs");
  const executablePath = CHROME_CANDIDATES.find((entry) => existsSync(entry));

  const browser = await puppeteer.launch({
    headless: true,
    ...(executablePath ? { executablePath } : {}),
  });
  const page = await browser.newPage();
  await page.setViewport({ width, height: Number(process.argv[5] ?? 2200), deviceScaleFactor: 2 });
  await page.goto(`${BASE}${route}`, { waitUntil: "networkidle0", timeout: 60_000 });

  /*
   * No scroll pass is needed. Reveals render visible server-side by design and
   * only hide client-side before paint, so a full-page capture gets the whole
   * document rather than a column of empty boxes. That was a deliberate Phase 1
   * decision so crawlers never receive hidden content, and it pays off here.
   */
  await new Promise((resolve) => setTimeout(resolve, 600));

  /*
   * Viewport capture, not fullPage. Chrome tiles a fullPage shot on very long
   * documents, which made the Phase 8 styleguide look duplicated when it was
   * not. A tall viewport captures the part of the page a person actually
   * judges without that artifact.
   */
  const file = path.join("snapshots", "shots", `${name}-${width}.png`);
  await page.screenshot({ path: file as `${string}.png`, fullPage: false });
  await browser.close();

  console.log(`Wrote ${file}`);
}

main().catch((error) => {
  console.error("screenshot failed:", error);
  process.exit(1);
});

export {};
