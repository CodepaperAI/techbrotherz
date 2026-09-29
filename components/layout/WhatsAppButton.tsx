import { SITE, WHATSAPP_HREF } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The WhatsApp glyph, drawn inline.
 *
 * Same reasoning as the icons in SocialLinks: lucide removed its brand icons,
 * so a hand-rolled path keeps this consistent with the rest of the set. This
 * is a contact channel the store uses, identified by its own mark, which is
 * ordinary wayfinding rather than the manufacturer-endorsement problem
 * CLAUDE.md Section 8.9 exists for.
 */
export function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 1.67c2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.25 8.24a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.17 8.17 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24zm-3.6 4.1c-.17 0-.44.06-.68.31-.23.25-.89.87-.89 2.12 0 1.25.91 2.46 1.04 2.63.13.17 1.79 2.73 4.34 3.83.6.26 1.08.42 1.45.53.61.2 1.17.17 1.6.1.49-.07 1.5-.61 1.71-1.2.21-.6.21-1.1.15-1.21-.06-.1-.23-.17-.48-.29-.25-.13-1.5-.74-1.73-.82-.23-.09-.4-.13-.57.12-.17.25-.65.82-.8.99-.14.17-.29.19-.54.06-.25-.12-1.07-.39-2.03-1.25a7.6 7.6 0 0 1-1.41-1.75c-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.37-.77-1.87-.2-.49-.4-.42-.55-.43h-.47z" />
    </svg>
  );
}

/**
 * The floating WhatsApp action, on every public page. Client instruction,
 * 2026-09: "add WhatsApp to the website with store number, which shows on
 * each page."
 *
 * Mounted in the site layout rather than per page, so a new page cannot ship
 * without it. (`app/not-found.tsx` sits outside that route group and mounts it
 * by hand, which is the one place to remember.) It is a plain anchor in a
 * server component: no state, no JavaScript, and it works with scripting
 * disabled, which the sticky call bar's scroll listener does not.
 *
 * **Sits above the mobile sticky call bar rather than beside it.** That bar
 * already owns the bottom edge below `lg`, and two overlapping fixed elements
 * competing for the same 56px is how a thumb hits the wrong one.
 *
 * **The `<aside>` is load-bearing, not decoration.** A fixed anchor that is a
 * direct child of `<body>` is page content outside every landmark, which axe
 * reports as a `region` violation on all 156 pages. The site was at zero
 * violations before this button existed and is again with the wrapper.
 *
 * Colour is the site's own green with an ink glyph, not WhatsApp's brand
 * green. DESIGN.md forbids raw hex in components, and the contrast rule in
 * CLAUDE.md Section 10 puts ink on a green fill, never white. A green circle
 * carrying this glyph reads as WhatsApp regardless of the exact hue. The focus
 * ring is overridden to ink for the same reason: the global ring is
 * `--tb-green-deep`, which on a green fill is the one place that rule has
 * nothing to contrast against.
 */
export function WhatsAppButton({ className }: { className?: string }) {
  return (
    <aside
      aria-label="WhatsApp"
      data-print="hide"
      className={cn("fixed right-4 bottom-24 z-40 lg:right-6 lg:bottom-6", className)}
    >
      <a
        href={WHATSAPP_HREF}
        target="_blank"
        rel="noopener"
        /* The number is in the label because a bare "WhatsApp" tells a screen
           reader user nothing about which account they are about to message. */
        aria-label={`Message ${SITE.brandName} on WhatsApp at ${SITE.phone}`}
        title={`Message ${SITE.brandName} on WhatsApp`}
        className={cn(
          "rounded-chip bg-tb-green text-tb-ink shadow-lift",
          "inline-flex size-14 items-center justify-center",
          "transition-transform duration-[180ms] ease-out hover:scale-105",
          "focus-visible:outline-tb-ink",
        )}
      >
        <WhatsAppIcon size={28} />
      </a>
    </aside>
  );
}
