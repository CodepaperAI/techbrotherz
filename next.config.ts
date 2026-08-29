import type { NextConfig } from "next";

/**
 * The hosts next/image may optimise blog images from.
 *
 * Kept in step by hand with OPTIMISED_IMAGE_HOSTS in lib/uplift/image-hosts.ts,
 * which is the runtime half of the same rule. Importing that module here is
 * what it should be, and it is not possible: pulling a file out of the app
 * graph into next.config crashes Next's page-data worker with a
 * "Cannot find module for page: /_document" that names nothing useful. Two
 * short lists with a comment beats a build that fails opaquely.
 *
 * Deliberately not a wildcard. An open remotePattern turns the optimiser into
 * an image proxy for anyone who can guess the URL format.
 */
const OPTIMISED_IMAGE_HOSTS = [
  ...new Set([
    "res.cloudinary.com",
    ...(process.env.UPLIFT_IMAGE_HOSTS ?? "")
      .split(",")
      .map((host) => host.trim().toLowerCase())
      .filter(Boolean),
  ]),
];

/**
 * Legacy Wix URL redirects land here in Phase 8, written directly into this
 * array. Client question 17 is the blocker: the current site's URL list has not
 * been supplied, so there is nothing to map yet. See CLAUDE.md Section 8.1.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Clean URLs: lowercase, hyphenated, no trailing slash. CLAUDE.md Section 8.1.
  trailingSlash: false,

  images: {
    /*
     * AVIF first, WebP fallback. CLAUDE.md Section 8.1.
     *
     * Every image on the site is a local file under public/, with one
     * exception: blog featured images and in-article images come from the
     * Uplift CMS and are served from its CDN. Those hosts are named in
     * lib/uplift/image-hosts.ts rather than wildcarded, because an open
     * remotePattern turns the optimiser into an image proxy for anyone who
     * can guess the URL format.
     */
    formats: ["image/avif", "image/webp"],
    remotePatterns: OPTIMISED_IMAGE_HOSTS.map((hostname) => ({
      protocol: "https" as const,
      hostname,
    })),
  },

  eslint: {
    dirs: ["app", "components", "content", "lib", "scripts"],
  },

  typescript: {
    // Never ship a build that does not typecheck.
    ignoreBuildErrors: false,
  },

  async redirects() {
    return [
      {
        /*
         * /repair-prices carried the whole price list and is deleted. It goes to
         * /contact, which since 2026-08 carries both the contact and the quote
         * intent (the planned /get-a-quote page was merged into it).
         */
        source: "/repair-prices",
        destination: "/contact",
        permanent: true,
      },
      {
        /*
         * /get-a-quote was planned and never built; 2026-08 the client chose
         * one page rather than two, so the URL 301s to the merged /contact.
         * Protective: nothing internal links to it, but the URL appeared in
         * planning documents and this stops it ever 404ing.
         */
        source: "/get-a-quote",
        destination: "/contact",
        permanent: true,
      },
      {
        /*
         * LG, Motorola, HTC and Google Nexus were removed from the catalogue on
         * the client's instruction, 2026-08. All four hubs and their fifteen
         * model pages were live, so every URL 301s to the phone repair hub
         * rather than the home page: it is the page that answers the same
         * intent. :path* matches zero segments, so one rule covers the hub and
         * its model pages.
         */
        source: "/repair/:brand(lg|motorola|htc|google-nexus)/:path*",
        destination: "/services/phone-repair",
        permanent: true,
      },
      {
        /*
         * The iPad rename, client instruction 2026-08: iPad leads everywhere.
         * Both tablet URLs were live, so both 301 to their iPad equivalents.
         */
        source: "/services/tablet-repair",
        destination: "/services/ipad-repair",
        permanent: true,
      },
      {
        source: "/tablet-repair-calgary",
        destination: "/ipad-repair-calgary",
        permanent: true,
      },
      {
        /*
         * The six hand-written blog articles were replaced by the Uplift CMS
         * in 2026-08. Their slugs are gone and none of them is a slug Uplift
         * uses, so each one 301s to the blog index rather than 404ing.
         * Protective: the site has never been live on the real domain, but
         * these URLs were published in the keyword map and on the staging
         * host, and a 301 costs nothing.
         */
        source:
          "/blog/:slug(how-to-unlock-a-cell-phone-in-canada|signs-your-laptop-needs-repair|how-long-does-a-phone-screen-repair-take|why-is-my-computer-running-slow|common-xbox-and-playstation-faults|phone-water-damage-what-to-do-first)",
        destination: "/blog",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        // llms.txt and llms-full.txt are served as plain text so answer
        // engines can read them without a content-type guess.
        source: "/:path(llms.txt|llms-full.txt)",
        headers: [{ key: "Content-Type", value: "text/plain; charset=utf-8" }],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
