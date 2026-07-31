/**
 * Maps a Sanity document to the page address it will live at on the site.
 *
 * These are the canonical URLs from CLAUDE.md Section 7. Several of them are
 * built in later phases, so a preview pane for those types shows the site's
 * not-found page until the phase that creates the route lands.
 */

export interface PreviewableDoc {
  _type?: string;
  slug?: { current?: string } | string;
  brandSlug?: string;
  parentSlug?: string;
  kind?: string;
  serviceType?: string;
  parentServiceSlug?: string;
}

function slugOf(slug: PreviewableDoc["slug"]): string | null {
  if (!slug) return null;
  return typeof slug === "string" ? slug : (slug.current ?? null);
}

export function resolvePreviewPath(doc: PreviewableDoc): string | null {
  const slug = slugOf(doc.slug);
  if (!slug) return null;

  switch (doc._type) {
    case "deviceModel":
      // Phase 4 builds this route.
      return doc.brandSlug ? `/repair/${doc.brandSlug}/${slug}` : null;

    case "brand":
      return `/repair/${slug}`;

    case "guide":
      // Phase 7 builds this route.
      return `/guides/${slug}`;

    case "servicePage":
      // Phases 5 builds these routes. A repair-type page nests under its hub.
      return doc.parentServiceSlug
        ? `/services/${doc.parentServiceSlug}/${slug}`
        : `/services/${slug}`;

    case "location":
      // Phase 6 builds these routes.
      return doc.kind === "city" ? `/locations/${slug}` : `/locations/calgary/${slug}`;

    default:
      return null;
  }
}

/**
 * Wraps the path in the draft-mode handshake, so the pane shows unpublished
 * edits rather than the last published version.
 */
export function resolvePreviewUrl(
  doc: PreviewableDoc,
  origin: string,
  secret: string,
): string | null {
  const path = resolvePreviewPath(doc);
  if (!path) return null;

  const url = new URL("/api/draft-mode/enable", origin);
  url.searchParams.set("secret", secret);
  url.searchParams.set("redirect", path);
  return url.toString();
}
