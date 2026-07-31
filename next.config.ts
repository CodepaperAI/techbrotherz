import type { NextConfig } from "next";

/**
 * From Phase 8, legacy Wix URL redirects are generated from the Sanity
 * `redirect` document type and merged into this array at build time.
 * See CLAUDE.md Section 8.1.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Clean URLs: lowercase, hyphenated, no trailing slash. CLAUDE.md Section 8.1.
  trailingSlash: false,

  images: {
    // AVIF first, WebP fallback. CLAUDE.md Section 8.1.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },

  eslint: {
    dirs: ["app", "components", "lib", "sanity", "scripts"],
  },

  typescript: {
    // Never ship a build that does not typecheck.
    ignoreBuildErrors: false,
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
