/**
 * The copy consistency audit, 2026-08, from the client's site-wide copy brief.
 *
 * Source-level checks over every user-facing string: known misspellings,
 * brand and device name casing, NAP formatting, double spaces, em dashes and
 * mixed quote styles. Complements the rendered checks: audit-pages owns
 * heading nesting, and test-service-areas owns the area list.
 *
 * Device-name casing skips lines that are code rather than copy: slugs,
 * hrefs, ids and imports legitimately contain "iphone-8-plus".
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOTS = ["app/(site)", "components", "lib/content", "lib/data", "content"];
const EXTENSIONS = [".ts", ".tsx"];

interface Finding {
  file: string;
  line: number;
  rule: string;
  excerpt: string;
}

const findings: Finding[] = [];

function* walk(dir: string): Generator<string> {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (EXTENSIONS.some((ext) => full.endsWith(ext))) yield full;
  }
}

/** Lines that are code context, where lowercase device slugs are correct. */
function isCodeContext(line: string): boolean {
  const trimmed = line.trim();
  // Comments are not user-facing copy; several quote the client's own
  // messages verbatim, misspellings included, as the record of what was asked.
  if (
    trimmed.startsWith("*") ||
    trimmed.startsWith("//") ||
    trimmed.startsWith("/*") ||
    trimmed.startsWith("{/*")
  )
    return true;
  // Search-alias data is deliberately lowercase; CSS values and prop unions
  // legitimately carry "center" and "-color"; CLI output strings indent with
  // runs of spaces.
  if (/-color|"center"|'center'|console\.(log|error|warn)|\\n/.test(line)) return true;
  return /href|slug|import |from "|path:|id[:=]|\/repair|\/services|\/blog|url|Url|URL|key=|@\/|aliases/.test(
    line,
  );
}

const MISSPELLINGS: [RegExp, string][] = [
  [/tamper glass/i, '"tamper glass" should be "tempered glass"'],
  [/charing port/i, '"charing port" should be "charging port"'],
  [/\btech brotherz\b/i, 'brand name split as "Tech Brotherz"'],
  [/\bcounsels?\b/i, '"counsel" where "console" is meant'],
  [/\bwarrenty\b/i, 'misspelt "warranty"'],
  [/\bseperate/i, 'misspelt "separate"'],
  [/\baccomodate/i, 'misspelt "accommodate"'],
  [/\brecieve/i, 'misspelt "receive"'],
];

/** en-CA: the American form is wrong in prose. Checked as whole words. */
const AMERICANISMS: [RegExp, string][] = [
  [/\blabor\b/, "labour"],
  [/\bcatalog\b/, "catalogue"],
  [/\bdefense\b/, "defence"],
  [/\btraveling\b/, "travelling"],
  [/\bcolor\b(?!:)/, "colour"],
  [/\bcenter\b/, "centre"],
];

/** Wrong casings of device and brand names, in copy context only. */
const DEVICE_CASING: [RegExp, string][] = [
  [/\bIphone\b|\bIPhone\b/, "iPhone"],
  [/\bIpad\b|\bIPad\b/, "iPad"],
  [/\bMacbook\b|\bmacbook\b/, "MacBook"],
  [/\bplaystation\b|\bPlaystation\b/, "PlayStation"],
  [/\bXBox\b|\bXBOX\b/, "Xbox"],
  [/\bnintendo\b/, "Nintendo"],
  [/\bsamsung galaxy\b/, "Samsung Galaxy"],
  [/\bgoogle pixel\b/, "Google Pixel"],
];

for (const root of ROOTS) {
  for (const file of walk(root)) {
    const lines = readFileSync(file, "utf-8").split("\n");
    let inAliases = false;
    lines.forEach((line, index) => {
      // Alias arrays in models.ts hold deliberately lowercase search strings.
      if (/"aliases"\s*:\s*\[/.test(line)) inAliases = !line.includes("]");
      else if (inAliases && line.includes("]")) {
        inAliases = false;
        return;
      }
      if (inAliases) return;
      const record = (rule: string) =>
        findings.push({ file, line: index + 1, rule, excerpt: line.trim().slice(0, 90) });

      for (const [pattern, rule] of MISSPELLINGS) {
        if (pattern.test(line)) record(rule);
      }

      // The rest only apply to copy, not code.
      if (isCodeContext(line)) return;

      for (const [pattern, replacement] of AMERICANISMS) {
        // Class attributes carry center/color legitimately.
        if (/className|text-center|items-center|justify-center|currentColor|color:/.test(line))
          continue;
        if (pattern.test(line)) record(`en-CA: use "${replacement}"`);
      }
      for (const [pattern, correct] of DEVICE_CASING) {
        // Verbatim filenames (the IMAGE_EDITS provenance notes) are quoted
        // as-is; a lowercase name inside one is the file's, not the site's.
        if (/\.(jpe?g|png|webp|avif)/.test(line)) continue;
        if (pattern.test(line)) record(`device name should be "${correct}"`);
      }

      // Double spaces inside string literals (not indentation).
      const literals = line.match(/"[^"]*"|'[^']*'|`[^`]*`/g) ?? [];
      for (const literal of literals) {
        if (/\S {2,}\S/.test(literal)) record("double space inside a string");
      }

      // Em dashes are banned in user-facing copy (CLAUDE.md rule 5).
      if (line.includes("—") && !line.trim().startsWith("*") && !line.trim().startsWith("//"))
        record("em dash in copy");

      // The brand has one canonical spelling: TechBrotherz. The stylised
      // TechBrotherZ exists only inside the logo lockup as a graphic, and the
      // deployment URL's "techbrothers" is an artifact, not the name.
      if (!file.endsWith("Logo.tsx") && !file.endsWith("LogoConcepts.tsx")) {
        const brandForms = line.match(/[Tt]ech[ -]?[Bb]rother[sz]?\b/g) ?? [];
        for (const form of brandForms) {
          if (form === "TechBrotherz") continue;
          // Lowercase inside URLs and hosts is a deployment artifact.
          if (/techbrothers?\.vercel|techbrotherz\.com|github/.test(line)) continue;
          record(`brand spelled "${form}", canonical is "TechBrotherz"`);
        }
      }

      // Wrong phone formatting: any 403 number not matching the two canonical forms.
      const phones = line.match(/\(?403\)?[ .-]?\d{3}[ .-]?\d{4}/g) ?? [];
      for (const phone of phones) {
        if (phone !== "(403) 273-8324" && phone !== "4032738324") {
          record(`phone formatted "${phone}", canonical is "(403) 273-8324"`);
        }
      }

      // Wrong address formatting: 3317 must be followed by the canonical street.
      if (/3317(?! 17 Ave SE)/.test(line) && line.includes("3317 17")) {
        record('address must read "3317 17 Ave SE"');
      }
    });
  }
}

console.log(`Copy audit: ${findings.length} finding(s)\n`);
for (const f of findings) {
  console.log(`  ${f.file}:${f.line}  ${f.rule}`);
  console.log(`    ${f.excerpt}`);
}

if (findings.length > 0) {
  console.error("\nFAIL: copy inconsistencies found.");
  process.exit(1);
}
console.log("PASS: no misspellings, casing errors, NAP drift, double spaces or em dashes.");
