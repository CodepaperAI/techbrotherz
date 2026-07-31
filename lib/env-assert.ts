import "server-only";

/**
 * Fails the build loudly rather than shipping a site that renders empty.
 *
 * This Sanity project rejects anonymous reads, so without SANITY_API_READ_TOKEN
 * every GROQ query returns zero rows and the build still succeeds. The result is
 * a complete site with no prices, no models and no questions on it, which is a
 * far worse failure than a build error. That happened once in Phase 2, so the
 * check is now part of the build.
 */
export function assertServerEnv(): void {
  const missing: string[] = [];

  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) missing.push("NEXT_PUBLIC_SANITY_PROJECT_ID");
  if (!process.env.NEXT_PUBLIC_SANITY_DATASET) missing.push("NEXT_PUBLIC_SANITY_DATASET");
  if (!process.env.SANITY_API_READ_TOKEN) missing.push("SANITY_API_READ_TOKEN");

  if (missing.length === 0) return;

  throw new Error(
    [
      "",
      "  Missing required environment variables:",
      ...missing.map((name) => `    - ${name}`),
      "",
      "  SANITY_API_READ_TOKEN is required in every environment, including production.",
      "  This Sanity project rejects anonymous reads, so without it every page would",
      "  build successfully and render with no content at all.",
      "",
      "  Create a Viewer token at sanity.io/manage, then set it locally in .env.local",
      "  and in the hosting project's environment variables.",
      "",
    ].join("\n"),
  );
}
