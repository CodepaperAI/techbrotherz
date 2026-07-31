"use client";

import { useState } from "react";
import { MapPin, Play } from "lucide-react";

import { cn } from "@/lib/utils";

export interface MapRevealProps {
  src: string;
  title: string;
  addressLine: string;
  className?: string;
}

/**
 * Click-to-reveal Google Maps embed.
 *
 * The iframe is not loaded until the visitor asks for it. A third-party iframe
 * on every page load costs several hundred kilobytes and is a common cause of a
 * poor LCP, and the map carries no SEO value: the address text and the
 * LocalBusiness structured data are what search engines read. So the default
 * state is a styled placeholder with the address in real text, and the map
 * loads on demand.
 */
export function MapReveal({ src, title, addressLine, className }: MapRevealProps) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <div className={cn("bg-tb-green-soft rounded-image relative overflow-hidden", className)}>
        <iframe
          src={src}
          title={title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 size-full border-0"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      aria-label={`Load the map showing ${addressLine}`}
      className={cn(
        "bg-tb-green-soft rounded-image group relative block w-full overflow-hidden text-left",
        className,
      )}
    >
      {/* A quiet street-grid motif, drawn in CSS so it costs nothing. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(15,122,48,.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,122,48,.18) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <span className="relative flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <span className="bg-tb-green text-tb-ink inline-flex size-12 items-center justify-center rounded-full">
          <MapPin aria-hidden="true" size={22} strokeWidth={1.5} />
        </span>
        <span className="text-tb-text font-medium">{addressLine}</span>
        <span className="type-caption text-tb-green-deep inline-flex items-center gap-1.5 font-medium">
          <Play aria-hidden="true" size={14} strokeWidth={1.5} />
          Load the interactive map
        </span>
      </span>
    </button>
  );
}
