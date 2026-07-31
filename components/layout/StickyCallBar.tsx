"use client";

import { useEffect, useState } from "react";
import { MapPin, Phone } from "lucide-react";

import { SITE, TEL_HREF } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Mobile only. Appears after 400px of scroll so the walk-in actions, call and
 * directions, are always one tap away. DESIGN.md Section 6.19.
 *
 * The site layout reserves bottom padding on mobile so this bar never covers
 * the last row of the footer.
 */
export function StickyCallBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      data-surface="dark"
      data-print="hide"
      aria-hidden={!visible}
      className={cn(
        "border-tb-border-dark bg-tb-ink fixed inset-x-0 bottom-0 z-40 border-t lg:hidden",
        "px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]",
        "transition-transform duration-[220ms] ease-out",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="flex gap-3">
        <a
          href={TEL_HREF}
          tabIndex={visible ? undefined : -1}
          className="rounded-chip bg-tb-green text-tb-ink inline-flex h-12 flex-1 items-center justify-center gap-2 font-medium"
        >
          <Phone aria-hidden="true" size={18} strokeWidth={1.5} />
          Call {SITE.phone}
        </a>

        <a
          href={SITE.googleMapsUrl}
          target="_blank"
          rel="noopener"
          tabIndex={visible ? undefined : -1}
          className="rounded-chip border-tb-border-dark text-tb-white inline-flex h-12 items-center justify-center gap-2 border px-5 font-medium"
        >
          <MapPin aria-hidden="true" size={18} strokeWidth={1.5} />
          Directions
        </a>
      </div>
    </div>
  );
}
