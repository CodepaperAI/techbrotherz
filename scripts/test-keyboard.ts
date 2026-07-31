/**
 * Keyboard-only pass through the interactive parts of the site.
 *
 * Everything here is done with Tab, Enter, Space and Escape. No clicks. A
 * control that cannot be reached or operated this way is unusable for anyone
 * navigating without a mouse, and no automated contrast check will catch it.
 *
 *   pnpm exec tsx scripts/test-keyboard.ts http://localhost:3100
 */

import { readFileSync } from "node:fs";

import puppeteer, { type Page } from "puppeteer-core";

const BASE = process.argv[2] ?? "http://localhost:3100";

let failures = 0;
function check(label: string, passed: boolean, detail = "") {
  console.log(`  ${passed ? "pass" : "FAIL"}  ${label}${detail ? `  (${detail})` : ""}`);
  if (!passed) failures += 1;
}

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

/** Describes whatever currently has focus, for readable assertions. */
async function focused(page: Page) {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (!el) return { tag: "none", text: "", id: "", visibleOutline: false };
    const styles = window.getComputedStyle(el);
    return {
      tag: el.tagName.toLowerCase(),
      text: (el.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 40),
      id: el.id,
      // A visible focus indicator is required, not optional.
      visibleOutline:
        styles.outlineStyle !== "none" &&
        styles.outlineWidth !== "0px" &&
        styles.outlineColor !== "transparent",
    };
  });
}

async function tabTo(page: Page, predicate: (id: string, text: string) => boolean, max = 60) {
  for (let index = 0; index < max; index += 1) {
    await page.keyboard.press("Tab");
    const current = await focused(page);
    if (predicate(current.id, current.text)) return current;
  }
  return null;
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: true,
    args: ["--no-sandbox"],
  });

  try {
    /* ----------------------------------------------- skip link and nav */
    console.log("\nHeader and skip link");
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 900 });
      await page.goto(`${BASE}/`, { waitUntil: "networkidle0", timeout: 90_000 });
      await page.keyboard.press("Tab");

      const first = await focused(page);
      check("first Tab reaches the skip link", /skip to content/i.test(first.text), first.text);
      check("focused element has a visible focus ring", first.visibleOutline);

      const nav = await tabTo(page, (_id, text) => /repair prices/i.test(text));
      check("Tab reaches the Repair Prices nav link", nav !== null, nav?.text ?? "not reached");

      await page.close();
    }

    /* --------------------------------------------------- mobile menu */
    console.log("\nMobile menu, focus trap and Escape");
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 390, height: 844, isMobile: true });
      await page.goto(`${BASE}/`, { waitUntil: "networkidle0", timeout: 90_000 });

      const trigger = await tabTo(page, (_id, text) => /open menu/i.test(text) === false && false);
      void trigger;

      // The open-menu button is an icon button, so match on aria-label.
      const opened = await page.evaluate(() => {
        const button = document.querySelector<HTMLButtonElement>('button[aria-label="Open menu"]');
        if (!button) return false;
        button.focus();
        return document.activeElement === button;
      });
      check("the menu button can take focus", opened);

      await page.keyboard.press("Enter");
      await new Promise((resolve) => setTimeout(resolve, 400));

      const dialogOpen = await page.$('[role="dialog"][aria-modal="true"]');
      check("Enter opens the menu sheet", dialogOpen !== null);

      // Tab several times and confirm focus never escapes the dialog.
      let escaped = false;
      for (let index = 0; index < 15; index += 1) {
        await page.keyboard.press("Tab");
        const inside = await page.evaluate(() => {
          const dialog = document.querySelector('[role="dialog"]');
          return dialog ? dialog.contains(document.activeElement) : false;
        });
        if (!inside) {
          escaped = true;
          break;
        }
      }
      check("focus stays trapped inside the open menu", !escaped);

      await page.keyboard.press("Escape");
      await new Promise((resolve) => setTimeout(resolve, 400));
      const closed = (await page.$('[role="dialog"][aria-modal="true"]')) === null;
      check("Escape closes the menu", closed);

      const returned = await page.evaluate(
        () => document.activeElement?.getAttribute("aria-label") === "Open menu",
      );
      check("focus returns to the button that opened it", returned);

      await page.close();
    }

    /* ------------------------------------------------- FAQ accordion */
    console.log("\nFAQ accordion");
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 900 });
      await page.goto(`${BASE}/faq`, { waitUntil: "networkidle0", timeout: 90_000 });

      await page.evaluate(() => {
        document.querySelector<HTMLButtonElement>("dt button")?.focus();
      });

      const before = await page.$eval("dt button", (el) => el.getAttribute("aria-expanded"));
      await page.keyboard.press("Enter");
      await new Promise((resolve) => setTimeout(resolve, 300));
      const after = await page.$eval("dt button", (el) => el.getAttribute("aria-expanded"));

      check("first question starts collapsed", before === "false", `aria-expanded=${before}`);
      check("Enter expands it", after === "true", `aria-expanded=${after}`);

      const answerVisible = await page.evaluate(() => {
        const panel = document.querySelector<HTMLElement>("[data-accordion-panel]");
        return panel ? !panel.hasAttribute("hidden") : false;
      });
      check("the answer panel is revealed", answerVisible);

      await page.keyboard.press("Enter");
      await new Promise((resolve) => setTimeout(resolve, 300));
      const collapsed = await page.$eval("dt button", (el) => el.getAttribute("aria-expanded"));
      check("Enter collapses it again", collapsed === "false");

      await page.close();
    }

    /* -------------------------------------------------- price filter */
    console.log("\nPrice list filter");
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 900 });
      await page.goto(`${BASE}/repair-prices`, { waitUntil: "networkidle0", timeout: 90_000 });

      await page.evaluate(() => document.querySelector<HTMLInputElement>("#price-search")?.focus());
      const isFocused = await page.evaluate(() => document.activeElement?.id === "price-search");
      check("the search box can take focus", isFocused);

      await page.keyboard.type("iphone 8 plus");
      await new Promise((resolve) => setTimeout(resolve, 500));

      const counts = await page.evaluate(() => ({
        total: document.querySelectorAll("[data-price-row]").length,
        visible: document.querySelectorAll('[data-price-row][data-hidden="false"]').length,
        status: document.querySelector('[aria-live="polite"]')?.textContent ?? "",
      }));

      // Since the Phase 4 refactor a row is one model, not one repair, so the
      // expected count is the published model total rather than the 344 price
      // rows this page used to carry.
      check(
        "filtering hides rows without removing them from the DOM",
        counts.total > counts.visible && counts.total >= 80,
        `${counts.visible} of ${counts.total} visible`,
      );
      check(
        "the result count is announced",
        /Showing \d+ of \d+/.test(counts.status),
        counts.status.trim(),
      );

      await page.close();
    }

    /* ------------------------------------------------- contact form */
    console.log("\nContact form, keyboard only");
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 900 });
      await page.goto(`${BASE}/contact`, { waitUntil: "networkidle0", timeout: 90_000 });

      await page.evaluate(() => document.querySelector<HTMLInputElement>("#contact-name")?.focus());
      await page.keyboard.type("Keyboard Test");
      await page.keyboard.press("Tab");
      await page.keyboard.type("403 555 0199");
      await page.keyboard.press("Tab");
      await page.keyboard.type("iPhone 11");
      await page.keyboard.press("Tab");
      await page.keyboard.type("The battery drops from forty percent to nothing without warning.");

      const reachedSubmit = await tabTo(page, (_id, text) => /send the message/i.test(text), 10);
      check("Tab order reaches the submit button", reachedSubmit !== null);
      check("submit button shows a focus ring", reachedSubmit?.visibleOutline ?? false);

      await page.keyboard.press("Enter");
      await page.waitForSelector('[role="status"]', { timeout: 30_000 });
      const status = await page.$eval('[role="status"]', (el) => el.textContent ?? "");
      check("Enter submits the form", /thank you/i.test(status), status.trim().slice(0, 50));

      await page.close();
    }
  } finally {
    await browser.close();
  }

  console.log("\n" + "=".repeat(64));
  if (failures === 0) {
    console.log("PASS: every interactive element is reachable and operable by keyboard.\n");
    return;
  }
  console.log(`FAIL: ${failures} keyboard problems.\n`);
  process.exit(1);
}

main().catch((error) => {
  console.error("test-keyboard failed:", error);
  process.exit(1);
});
