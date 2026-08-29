/**
 * The hosts Uplift serves blog images from.
 *
 * This is the runtime half. ArticleImage checks a URL against it at render, so
 * an image from a host that is not on the list falls back to `unoptimized`
 * instead of throwing: Next's optimiser rejects an unlisted host at render
 * time, and on a prerendered page that is a failed build rather than a broken
 * picture. The fallback is what stops the whole site going down the day Uplift
 * changes CDN.
 *
 * The build half is `images.remotePatterns` in next.config.ts, which repeats
 * the same default and the same env var. **Change one, change both.** It is a
 * copy rather than an import because pulling a file out of the app graph into
 * next.config crashes Next's page-data worker.
 *
 * Deliberately not a wildcard. Pointing the optimiser at any host on the
 * internet turns it into an open image proxy, which is somebody else's
 * bandwidth bill and our IP address making the requests.
 *
 * `UPLIFT_IMAGE_HOSTS` extends it without a code change, comma separated.
 */

/** Every image in the payload as of 2026-08 comes from Uplift's Cloudinary. */
const DEFAULT_HOSTS = ["res.cloudinary.com"];

export const OPTIMISED_IMAGE_HOSTS: string[] = [
  ...new Set([
    ...DEFAULT_HOSTS,
    ...(process.env.UPLIFT_IMAGE_HOSTS ?? "")
      .split(",")
      .map((host) => host.trim().toLowerCase())
      .filter(Boolean),
  ]),
];

/** Whether next/image may run this URL through the optimiser. */
export function isOptimisableImage(src: string): boolean {
  try {
    const url = new URL(src);
    return url.protocol === "https:" && OPTIMISED_IMAGE_HOSTS.includes(url.hostname.toLowerCase());
  } catch {
    // A relative path is a local file under public/, which is always fine.
    return src.startsWith("/");
  }
}
