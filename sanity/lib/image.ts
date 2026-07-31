import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, projectId } from "../env";

const builder = createImageUrlBuilder({ projectId, dataset });

/**
 * Build a Sanity CDN URL for an image.
 *
 * Always pair the result with explicit width and height on next/image so the
 * page has no layout shift. CLAUDE.md Section 8.1 targets CLS under 0.05.
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format").fit("max");
}

/** Ready-made src for a fixed-width render. */
export function imageSrc(source: SanityImageSource, width: number, height?: number): string {
  const image = urlFor(source).width(width);
  return (height ? image.height(height) : image).url();
}

/**
 * Sanity stores the intrinsic dimensions in the asset _ref, e.g.
 * "image-abc123-1200x800-jpg". Reading them avoids a round trip just to learn
 * an aspect ratio.
 */
export function imageDimensions(ref: string | undefined): { width: number; height: number } | null {
  if (!ref) return null;
  const match = /-(\d+)x(\d+)-[a-z]+$/.exec(ref);
  if (!match) return null;

  const width = Number(match[1]);
  const height = Number(match[2]);
  if (!width || !height) return null;

  return { width, height };
}
