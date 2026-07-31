import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

/**
 * Phase 8 extends this with the full sitemap set. For now it does the two jobs
 * that matter from Phase 2: everything public is crawlable, and the Studio and
 * API routes are not.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio", "/studio/", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
