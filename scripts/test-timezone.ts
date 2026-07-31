/**
 * Proves the open or closed state is computed in the shop's time zone, not the
 * server's and not the visitor's.
 *
 * This is the bug the Phase 3 brief called out: a visitor in Toronto or Mumbai
 * must still be told whether the Calgary shop is open right now, and a server
 * running in UTC must not bake the wrong answer into static HTML.
 *
 * Each case is run in a child process with TZ forced, because Node reads TZ
 * once at start.
 *
 *   pnpm exec tsx scripts/test-timezone.ts
 */

import { execFileSync } from "node:child_process";

const ZONES = ["UTC", "Asia/Kolkata", "America/Toronto", "Australia/Sydney", "America/Edmonton"];

/**
 * Fixed instants, with the answer worked out from the shop's hours:
 * Monday to Saturday 10:00 to 19:00, Sunday 11:00 to 17:00, America/Edmonton.
 */
const CASES = [
  {
    // Thursday 30 July 2026, 18:00 UTC = 12:00 MDT. Inside 10:00 to 19:00.
    iso: "2026-07-30T18:00:00.000Z",
    label: "Thursday noon in Calgary",
    expectOpen: true,
    expectDay: "Thursday",
  },
  {
    // Thursday 30 July 2026, 04:00 UTC = Wednesday 22:00 MDT. After closing.
    iso: "2026-07-30T04:00:00.000Z",
    label: "Wednesday 10pm in Calgary",
    expectOpen: false,
    expectDay: "Wednesday",
  },
  {
    // Sunday 2 August 2026, 23:30 UTC = 17:30 MDT. Sunday closes at 17:00.
    iso: "2026-08-02T23:30:00.000Z",
    label: "Sunday 5:30pm in Calgary, after Sunday closing",
    expectOpen: false,
    expectDay: "Sunday",
  },
  {
    // Sunday 2 August 2026, 20:00 UTC = 14:00 MDT. Inside 11:00 to 17:00.
    iso: "2026-08-02T20:00:00.000Z",
    label: "Sunday 2pm in Calgary",
    expectOpen: true,
    expectDay: "Sunday",
  },
  {
    // Saturday 17 January 2026, 17:30 UTC = 10:30 MST, winter offset UTC-7.
    iso: "2026-01-17T17:30:00.000Z",
    label: "Saturday 10:30am in Calgary, winter time",
    expectOpen: true,
    expectDay: "Saturday",
  },
];

const CHILD = `
import { isOpenNow } from "./lib/utils";
const instant = new Date(process.argv[2]);
const result = isOpenNow(instant);
process.stdout.write(JSON.stringify(result));
`;

import { writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";

const childPath = join(process.cwd(), ".timezone-probe.ts");

function run(zone: string, iso: string): { open: boolean; day: string } {
  const output = execFileSync(process.execPath, ["--import", "tsx", childPath, iso], {
    env: { ...process.env, TZ: zone },
    encoding: "utf8",
    cwd: process.cwd(),
  });
  return JSON.parse(output) as { open: boolean; day: string };
}

function main() {
  writeFileSync(childPath, CHILD, "utf8");

  let failures = 0;

  try {
    console.log("\nOpenNowBadge, computed against America/Edmonton\n");
    console.log(
      "case".padEnd(46) +
        ZONES.map((zone) => zone.split("/").pop()?.slice(0, 8).padEnd(10)).join(""),
    );
    console.log("-".repeat(46 + ZONES.length * 10));

    for (const testCase of CASES) {
      const results = ZONES.map((zone) => run(zone, testCase.iso));
      const cells = results.map((result) => (result.open ? "open" : "closed").padEnd(10)).join("");

      console.log(testCase.label.padEnd(46) + cells);

      for (let index = 0; index < ZONES.length; index += 1) {
        const result = results[index] as { open: boolean; day: string };
        if (result.open !== testCase.expectOpen) {
          failures += 1;
          console.log(
            `  FAIL under TZ=${ZONES[index]}: expected ${testCase.expectOpen ? "open" : "closed"}, got ${
              result.open ? "open" : "closed"
            }`,
          );
        }
        if (result.day !== testCase.expectDay) {
          failures += 1;
          console.log(
            `  FAIL under TZ=${ZONES[index]}: expected day ${testCase.expectDay}, got ${result.day}`,
          );
        }
      }
    }
  } finally {
    try {
      unlinkSync(childPath);
    } catch {
      // already gone
    }
  }

  console.log();
  if (failures === 0) {
    console.log(
      `PASS: identical answers across ${ZONES.length} system time zones, including both sides of the daylight saving change.\n`,
    );
    return;
  }
  console.log(`FAIL: ${failures} mismatches.\n`);
  process.exit(1);
}

main();
