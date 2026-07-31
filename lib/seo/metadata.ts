import type { Metadata } from "next";

import { SITE, SITE_URL } from "@/lib/site";
import { absoluteUrl } from "@/lib/utils";

export type PageType = "website" | "article" | "profile";

export interface PageMetaInput {
  /** Unique, 60 characters or fewer. The brand suffix is added by the template. */
  title: string;
  /** Unique, 155 characters or fewer. */
  description: string;
  /** Route path with a leading slash, e.g. "/repair-prices". */
  path: string;
  /** Per-page OG image. Defaults to the route's opengraph-image.tsx output. */
  ogImage?: string;
  noIndex?: boolean;
  type?: PageType;
  /** Guides only. Feeds article:published_time and article:modified_time. */
  publishedTime?: string;
  modifiedTime?: string;
}

const TITLE_LIMIT = 60;
const DESCRIPTION_LIMIT = 155;

/**
 * The one place page metadata is assembled.
 *
 * Every page calls this. No page hand-rolls a Metadata export, so canonical,
 * hreflang, Open Graph and Twitter cards can never be forgotten on a new page.
 * CLAUDE.md Section 8.1.
 */
export function buildMetadata({
  title,
  description,
  path,
  ogImage,
  noIndex = false,
  type = "website",
  publishedTime,
  modifiedTime,
}: PageMetaInput): Metadata {
  if (process.env.NODE_ENV !== "production") {
    if (title.length > TITLE_LIMIT) {
      console.warn(`[seo] Title is ${title.length} chars, the limit is ${TITLE_LIMIT}: "${title}"`);
    }
    if (description.length > DESCRIPTION_LIMIT) {
      console.warn(
        `[seo] Description is ${description.length} chars, the limit is ${DESCRIPTION_LIMIT}: "${description}"`,
      );
    }
    if (/[—–]/.test(title) || /[—–]/.test(description)) {
      console.warn(`[seo] Long dash in metadata for ${path}. Use a comma or a full stop.`);
    }
  }

  const url = absoluteUrl(path);

  /**
   * The social card is referenced explicitly rather than left to Next's
   * file-convention merge. A page that sets `openGraph` itself does not
   * reliably pick up the root opengraph-image, and a missing card is invisible
   * until someone shares a link, so it is stated here where it can be tested.
   */
  const images = [
    {
      url: ogImage ?? "/opengraph-image",
      width: 1200,
      height: 630,
      alt: `${SITE.brandName}, ${SITE.descriptor} in ${SITE.city}`,
    },
  ];

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { "en-CA": url },
    },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-snippet": -1,
            "max-image-preview": "large",
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type: type === "article" ? "article" : "website",
      url,
      title,
      description,
      siteName: SITE.brandName,
      locale: "en_CA",
      images,
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((image) => image.url),
    },
  };
}

/** Root metadata shared by every route. */
export const ROOT_METADATA: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE.brandName} | ${SITE.descriptor} in Calgary`,
    template: `%s | ${SITE.brandName} Calgary`,
  },
  description:
    "Walk-in cell phone, tablet and computer repair at 3317 17 Ave SE in Calgary. Most repairs take about 30 minutes. Parts and labour included, 60-day warranty.",
  applicationName: SITE.brandName,
  authors: [{ name: SITE.legalName }],
  creator: SITE.legalName,
  publisher: SITE.legalName,
  formatDetection: { telephone: true, address: true, email: false },
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } }
    : {}),
};
