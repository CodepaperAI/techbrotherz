/**
 * Enforces the contrast rules DESIGN.md states, as a test rather than a
 * document.
 *
 * The Phase 3 logo used --tb-green on cream at 2.55:1, which DESIGN.md
 * Section 2.1 explicitly forbids in plain words. A design system whose first
 * component violates it is a document, not a system. This turns the two rules
 * that get broken most often into assertions.
 *
 * Colour values are read from app/globals.css, so the test fails if a token is
 * changed to something that breaks a documented pairing.
 *
 *   pnpm exec tsx scripts/test-contrast.ts
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

const CSS = readFileSync(join(process.cwd(), "app", "globals.css"), "utf8");

function token(name: string): string {
  const match = new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`).exec(CSS);
  if (!match?.[1]) throw new Error(`Token --color-${name} not found in app/globals.css`);
  return match[1];
}

/** WCAG 2.1 relative luminance. */
function luminance(hex: string): number {
  const channels = [1, 3, 5].map((offset) => {
    const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function ratio(a: string, b: string): number {
  const light = Math.max(luminance(a), luminance(b));
  const dark = Math.min(luminance(a), luminance(b));
  return (light + 0.05) / (dark + 0.05);
}

interface Rule {
  label: string;
  fg: string;
  bg: string;
  /** "pass" means it must meet the minimum. "forbid" means it must not. */
  expect: "pass" | "forbid";
  minimum: number;
  why: string;
}

const RULES: Rule[] = [
  {
    label: "body text on the page background",
    fg: "tb-text",
    bg: "tb-cream",
    expect: "pass",
    minimum: 4.5,
    why: "Default body copy.",
  },
  {
    label: "secondary text on the page background",
    fg: "tb-muted",
    bg: "tb-cream",
    expect: "pass",
    minimum: 4.5,
    why: "Used for every lead paragraph and caption.",
  },
  {
    label: "green TEXT on the page background",
    fg: "tb-green-deep",
    bg: "tb-cream",
    expect: "pass",
    minimum: 4.5,
    why: "DESIGN.md 2.1: green text on light is --tb-green-deep, and this is why.",
  },
  {
    label: "brand green used as TEXT on the page background",
    fg: "tb-green",
    bg: "tb-cream",
    expect: "forbid",
    minimum: 4.5,
    why: "DESIGN.md 2.1: --tb-green on cream fails AA, so it is fills only, never text.",
  },
  {
    label: "button label on a green fill",
    fg: "tb-ink",
    bg: "tb-green",
    expect: "pass",
    minimum: 4.5,
    why: "DESIGN.md 2.1: the label on a green button is ink, never white.",
  },
  {
    label: "white on a green fill",
    fg: "tb-white",
    bg: "tb-green",
    expect: "forbid",
    minimum: 4.5,
    why: "The pairing DESIGN.md forbids on buttons.",
  },
  {
    label: "text on a dark section",
    fg: "tb-white",
    bg: "tb-ink",
    expect: "pass",
    minimum: 4.5,
    why: "Headings and body on a dark chapter break.",
  },
  {
    label: "secondary text on a dark section",
    fg: "tb-muted-dark",
    bg: "tb-ink",
    expect: "pass",
    minimum: 4.5,
    why: "Lead paragraphs on dark.",
  },
  {
    label: "brand green as text on a dark section",
    fg: "tb-green",
    bg: "tb-ink",
    expect: "pass",
    minimum: 4.5,
    why: "Green text IS permitted on dark, which is the other half of the rule.",
  },
  {
    label: "green text on the soft green tint",
    fg: "tb-green-deep",
    bg: "tb-green-soft",
    expect: "pass",
    minimum: 4.5,
    why: "Used for every AnswerBox label and table header.",
  },
];

function main() {
  console.log("\nContrast rules from DESIGN.md Section 2.1\n");
  console.log("  ratio    rule");
  console.log("  " + "-".repeat(64));

  let failures = 0;

  for (const rule of RULES) {
    const value = ratio(token(rule.fg), token(rule.bg));
    const meets = value >= rule.minimum;
    const ok = rule.expect === "pass" ? meets : !meets;

    console.log(
      `  ${value.toFixed(2).padStart(5)}:1  ${ok ? "pass" : "FAIL"}  ${rule.label}` +
        (rule.expect === "forbid" ? "  (must stay below the threshold)" : ""),
    );

    if (!ok) {
      failures += 1;
      console.log(`           ${rule.why}`);
    }
  }

  console.log("\n" + "=".repeat(66));
  if (failures === 0) {
    console.log("PASS: every documented contrast rule holds.\n");
    return;
  }
  console.log(`FAIL: ${failures} contrast rules broken.\n`);
  process.exit(1);
}

main();
