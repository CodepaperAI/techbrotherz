import { createClient, type SanityClient } from "@sanity/client";

/**
 * The only way a script may obtain a Sanity client that can write.
 *
 * Phase 6.9 Part 2 put a guard on the migration script. It worked. Then a
 * throwaway permission probe wrote a document into production, because the
 * probe was not the migration script, and it was caught by a FAQ count that
 * happened to look one too high. Catching it was luck of the right shape.
 *
 * So the guard moved down a level, to the thing every writer must go through.
 * A script cannot reach production with write access without passing an
 * unlock, and no script in the repo passes one. Granting it at cutover is a
 * reviewed one-line change in exactly one place.
 *
 * `pnpm test:write-guard` fails the build if any script under scripts/ builds
 * a client with a write token some other way.
 */

/**
 * The unlock. Deliberately awkward to type and impossible to pass by accident.
 * Supplying it is the cutover decision, made once, in a reviewed diff.
 */
export const PRODUCTION_WRITE_UNLOCK = "I have read the cutover checklist and approved step 8";

export type ProductionUnlock = typeof PRODUCTION_WRITE_UNLOCK;

const PROTECTED = new Set(["production"]);

export interface WriteClientOptions {
  dataset: string;
  /** Required, and only accepted, when the target is a protected dataset. */
  unlock?: ProductionUnlock;
  /** Defaults to SANITY_API_WRITE_TOKEN, which is the token that can write. */
  token?: string;
}

export function createWriteClient(options: WriteClientOptions): SanityClient {
  const { dataset, unlock } = options;

  if (PROTECTED.has(dataset) && unlock !== PRODUCTION_WRITE_UNLOCK) {
    throw new Error(
      `Refusing to build a write client for "${dataset}".\n\n` +
        `Phase 6.9 works against staging. Production is written to exactly once, at cutover,\n` +
        `and only by passing the unlock from sanity/lib/write-client.ts.\n\n` +
        `If you are doing the cutover: pass { unlock: PRODUCTION_WRITE_UNLOCK } and expect\n` +
        `that line to be reviewed.`,
    );
  }

  const token = options.token ?? process.env.SANITY_API_WRITE_TOKEN;
  if (!token) {
    throw new Error("No write token. Set SANITY_API_WRITE_TOKEN in .env.local.");
  }

  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
    dataset,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-10-01",
    token,
    useCdn: false,
  });
}

/**
 * A read-only client. Unrestricted: reading production is what the census and
 * the derivation check do, and neither can damage anything.
 */
export function createReadClient(dataset: string): SanityClient {
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
    dataset,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-10-01",
    token: process.env.SANITY_API_READ_TOKEN,
    useCdn: false,
  });
}
