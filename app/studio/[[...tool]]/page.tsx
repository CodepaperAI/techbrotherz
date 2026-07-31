import type { Metadata, Viewport } from "next";

import { Studio } from "./Studio";

/**
 * The embedded Sanity Studio.
 *
 * Sits outside the (site) route group so it loads without the marketing nav,
 * footer and sticky call bar. It is noindex here and disallowed in robots.txt,
 * so it can never appear in search results.
 */
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "TechBrotherz Studio",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function StudioPage() {
  return <Studio />;
}
