/**
 * Does a build actually reflect the current content?
 *
 * Phase 4 shipped a build that silently produced a site from stale data.
 * Next persists fetch results in .next/cache/fetch-cache between builds, and a
 * rebuild after reseeding Sanity served the old content while reporting
 * success. Every other check in this suite was then reading a site that did
 * not match the database, including the similarity scores, which came back
 * byte-identical after a content rewrite.
 *
 * That is the worst failure mode in this project so far, because it makes
 * every other green check meaningless. This test closes it:
 *
 *   1. Read a known field from the live site.
 *   2. Change that field in Sanity.
 *   3. Rebuild.
 *   4. Assert the rendered output changed.
 *   5. Put the field back, whatever happened.
 *
 * It needs a write token, so it is skipped rather than failed when one is
 * absent, and it says so loudly rather than passing quietly.
 *
 *   pnpm exec tsx scripts/test-build-determinism.ts http://localhost:3100
 */

import { spawnSync } from "node:child_process";

import { createWriteClient } from "../sanity/lib/write-client";

const BASE = process.argv[2] ?? "http://localhost:3100";
const MARKER = "DETERMINISM-PROBE";
/** A published model whose intro is rendered verbatim on its own page. */
const PROBE_MODEL = "iphone-8-plus";
const PROBE_PATH = "/repair/apple-iphone/iphone-8-plus";

function run(command: string, args: string[]) {
  return spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
  });
}

async function main() {
  console.log(`\nBuild determinism, ${BASE}\n`);

  const token = process.env.SANITY_API_WRITE_TOKEN;
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

  if (!token || !projectId) {
    console.log("SKIPPED: SANITY_API_WRITE_TOKEN and NEXT_PUBLIC_SANITY_PROJECT_ID are required.");
    console.log("This check mutates a field, rebuilds, and asserts the output changed.");
    console.log("Without it, a stale fetch cache can serve old content and report success.\n");
    return;
  }

  const client = createWriteClient({
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  });

  /*
   * The probe field has to be a plain string that is rendered verbatim.
   *
   * Two earlier versions of this test failed for reasons that were the test's
   * fault rather than the build's, and both are worth recording because they
   * are easy to repeat. siteSettings.priceDisclaimer looked ideal but every
   * page renders it from the lib/site.ts constant, so a Studio edit correctly
   * changed nothing. deviceModel.intro is a richText field, so writing a
   * string into it produced something the renderer could not display.
   *
   * commonIssues is an array of plain strings rendered as a list, which makes
   * an appended entry visible in the HTML and trivial to restore.
   */
  const model = await client.fetch<{ _id: string; name?: string; commonIssues?: string[] } | null>(
    `*[_type == "deviceModel" && slug.current == $slug][0]{ _id, name, commonIssues }`,
    { slug: PROBE_MODEL },
  );

  if (!model?._id || !model.commonIssues?.length) {
    console.log(`SKIPPED: no published ${PROBE_MODEL} with commonIssues in this dataset.`);
    return;
  }

  const original = model.commonIssues;
  const probe = [...original, `Probe entry ${MARKER}`];

  /* --- 1. what does the site say now? -------------------------------- */
  const before = await (await fetch(`${BASE}${PROBE_PATH}`)).text();
  if (before.includes(MARKER)) {
    console.log("FAIL: the probe marker is already on the live site from an earlier aborted run.");
    console.log(`Reset the ${PROBE_MODEL} common issues in the Studio, removing "${MARKER}".`);
    process.exit(1);
  }

  let failed = false;

  try {
    /* --- 2. change it -------------------------------------------------- */
    console.log(`Adding a ${MARKER} entry to the ${model.name} common issues ...`);
    await client.patch(model._id).set({ commonIssues: probe }).commit();

    /* --- 3. rebuild, clearing the fetch cache the way pnpm build:clean does */
    console.log("Rebuilding with a cleared fetch cache ...\n");
    const build = run("pnpm", ["run", "build:clean"]);
    if (build.status !== 0) {
      console.log("\nFAIL: the rebuild did not succeed.");
      failed = true;
    } else {
      /* --- 4. did the output change? ---------------------------------- */
      // The running server serves the previous build, so the assertion reads
      // the build output on disk rather than the socket.
      const { readFileSync } = await import("node:fs");
      let rendered = "";
      for (const candidate of [
        `.next/server/app${PROBE_PATH}.html`,
        `.next/server/app/(site)${PROBE_PATH}.html`,
      ]) {
        try {
          rendered = readFileSync(candidate, "utf8");
          break;
        } catch {
          // next candidate
        }
      }

      if (!rendered) {
        console.log(`FAIL: could not find the prerendered ${PROBE_PATH} output to inspect.`);
        failed = true;
      } else if (!rendered.includes(MARKER)) {
        console.log(
          `FAIL: the rebuild did not pick up the change to the ${model.name} common issues.`,
        );
        console.log("This is the stale fetch cache bug from Phase 4. The build reported success");
        console.log("while rendering the previous content. Check that build:clean removes");
        console.log(".next/cache/fetch-cache and that the Sanity client has useCdn: false.");
        failed = true;
      } else {
        console.log(`\nThe rebuilt ${PROBE_PATH} carries ${MARKER}: the build read live content.`);
      }
    }
  } finally {
    /* --- 5. always put it back ---------------------------------------- */
    console.log(`
Restoring the ${model.name} common issues ...`);
    await client.patch(model._id).set({ commonIssues: original }).commit();
    console.log("Restored. Rebuild once more so the served site matches the database.");
  }

  console.log("\n" + "=".repeat(70));
  if (failed) {
    console.log("FAIL: the build did not reflect current content.\n");
    process.exit(1);
  }
  console.log("PASS: a content change reached the rendered output.\n");
}

main().catch((error) => {
  console.error("test-build-determinism failed:", error);
  process.exit(1);
});

export {};
