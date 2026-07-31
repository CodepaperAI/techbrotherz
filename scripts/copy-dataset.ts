/**
 * Copies one dataset's documents into another, via the client API.
 *
 * `sanity dataset copy` and `sanity dataset import` both call
 * `datasets.list()` first, which needs the `sanity.project.datasets/read`
 * grant. The token available here can read and write documents but cannot
 * enumerate datasets, so both CLI paths fail before they start. Reading and
 * writing documents directly needs neither grant.
 *
 *   pnpm exec tsx --env-file=.env.local scripts/copy-dataset.ts production staging
 */

import { createReadClient, createWriteClient } from "../sanity/lib/write-client";

const [, , FROM, TO] = process.argv;

if (!FROM || !TO) {
  console.error("Usage: copy-dataset.ts <from> <to>");
  process.exit(1);
}

if (TO === "production") {
  console.error("Refusing to write into production.");
  process.exit(1);
}

/*
 * The three tokens on this project have different grants, and the differences
 * are not what the names suggest. The read token reads production. The write
 * token writes to both datasets. The admin token can neither read production
 * documents nor create in staging, despite the name. Using one token for both
 * ends silently returns zero rows or fails on the first create.
 */

async function main() {
  const source = createReadClient(FROM as string);
  const target = createWriteClient({ dataset: TO as string });

  console.log(`\nCopying ${FROM} -> ${TO}\n`);

  /* System documents are managed by Sanity and cannot be created. */
  const docs = await source.fetch<Record<string, unknown>[]>(
    `*[!(_id in path("drafts.**")) && !(_type match "system.*")]`,
  );
  console.log(`  read ${docs.length} documents from ${FROM}`);

  const existing = await target.fetch<number>(`count(*[!(_type match "system.*")])`);
  if (existing > 0) {
    console.log(`  ${TO} already holds ${existing} documents, clearing first`);
    await target.delete({ query: `*[!(_type match "system.*")]` });
  }

  /*
   * Strong references mean creation order matters: a priceEntry cannot be
   * written before the repairType it points at exists. This ordering is
   * itself an argument for the phase, since it is the same coupling that
   * makes the Catalogue unusable.
   */
  const ORDER = [
    "siteSettings",
    "reviewSummary",
    "faq",
    "location",
    "unlockingService",
    "flatService",
    "brand",
    "repairType",
    "deviceModel",
    "priceGroup",
    "priceEntry",
  ];
  const rank = (doc: Record<string, unknown>): number => {
    const index = ORDER.indexOf(doc._type as string);
    return index === -1 ? ORDER.length : index;
  };
  docs.sort((a: Record<string, unknown>, b: Record<string, unknown>) => rank(a) - rank(b));

  let written = 0;
  let tx = target.transaction();

  for (const doc of docs) {
    tx = tx.createOrReplace(doc as { _id: string; _type: string });
    written += 1;
    if (written % 100 === 0) {
      await tx.commit({ visibility: "async" });
      tx = target.transaction();
      console.log(`  ${written}/${docs.length}`);
    }
  }
  await tx.commit({ visibility: "async" });

  const after = await target.fetch<number>(`count(*[!(_id in path("drafts.**"))])`);
  console.log(`\n  ${TO} now holds ${after} documents\n`);
}

main().catch((error) => {
  console.error("copy-dataset failed:", error);
  process.exit(1);
});

export {};
