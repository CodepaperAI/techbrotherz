import { defineCliConfig } from "sanity/cli";

/**
 * Used by the `sanity` CLI for schema extraction, type generation and dataset
 * commands. The embedded Studio at /studio is the primary editor, so this file
 * exists for tooling rather than for hosting.
 *
 * This reads process.env directly rather than importing sanity/env.ts. The CLI
 * evaluates this file before it loads .env.local, so a hard throw here would
 * fail every CLI command even when the variables are present.
 */
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  },
  autoUpdates: false,
});
