import type { NextConfig } from "next";

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
     * No remotePatterns: every image is a local file under public/. The site
     * fetches nothing from a third-party CDN at render time, which is what
     * keeps LCP under our control.
     */
    formats: ["image/avif", "image/webp"],
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
         * /contact rather than /get-a-quote, because /get-a-quote does not exist
         * yet and a 301 into a 404 is worse than the page it replaced.
         */
        source: "/repair-prices",
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
