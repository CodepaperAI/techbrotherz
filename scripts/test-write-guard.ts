/**
 * No script may build a Sanity client that can write, except through the
 * factory in sanity/lib/write-client.ts.
 *
 * The factory refuses production without an unlock. That protection is worth
 * nothing if a script can call `createClient` with a write token directly,
 * which is exactly what the permission probe did in Part 2. This is the check
 * that makes the factory the only door.
 *
 *   pnpm exec tsx scripts/test-write-guard.ts
 */

import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const SCRIPTS = "scripts";

/** These may construct clients directly, because they cannot write. */
const READ_ONLY_ALLOWED = new Set(["census-production.ts", "verify-derivation.ts"]);

/** The factory itself, obviously. */
const FACTORY = path.join("sanity", "lib", "write-client.ts");

interface Finding {
  file: string;
  line: number;
  text: string;
  why: string;
}

function main() {
  const findings: Finding[] = [];

  for (const name of readdirSync(SCRIPTS).filter((file) => file.endsWith(".ts"))) {
    const file = path.join(SCRIPTS, name);
    const source = readFileSync(file, "utf8");
    const lines = source.split("\n");

    const buildsClient = /createClient\s*\(/.test(source);
    if (!buildsClient) continue;

    const usesWriteToken = /SANITY_API_WRITE_TOKEN|SANITY_ADMIN_TOKEN/.test(source);
    const usesFactory = /createWriteClient/.test(source);

    if (usesFactory && !/createClient\s*\(/.test(source.replace(/createWriteClient/g, ""))) {
      continue;
    }

    if (!usesWriteToken) {
      if (READ_ONLY_ALLOWED.has(name)) continue;
      // Reads only, but flag it so the allow list stays deliberate.
      const line = lines.findIndex((text) => /createClient\s*\(/.test(text));
      findings.push({
        file,
        line: line + 1,
        text: lines[line]?.trim() ?? "",
        why: "constructs a client directly; add to READ_ONLY_ALLOWED if it genuinely cannot write",
      });
      continue;
    }

    const line = lines.findIndex((text) => /createClient\s*\(/.test(text));
    findings.push({
      file,
      line: line + 1,
      text: lines[line]?.trim() ?? "",
      why: "builds a client with a write token outside the factory",
    });
  }

  console.log(`\nWrite-client guard\n`);
  console.log(`  factory : ${FACTORY}`);
  console.log(
    `  scanned : ${readdirSync(SCRIPTS).filter((f) => f.endsWith(".ts")).length} scripts\n`,
  );

  if (findings.length === 0) {
    console.log("  Every writer goes through the factory.\n");
    console.log("=".repeat(66));
    console.log("PASS: production cannot be written to without the unlock.\n");
    return;
  }

  for (const finding of findings) {
    console.log(`  FAIL ${finding.file}:${finding.line}`);
    console.log(`       ${finding.text}`);
    console.log(`       ${finding.why}\n`);
  }

  console.log("=".repeat(66));
  console.log(`FAIL: ${findings.length} scripts bypass the write-client factory.\n`);
  process.exit(1);
}

main();

export {};
