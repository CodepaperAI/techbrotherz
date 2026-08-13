import { ImageResponse } from "next/og";

import { SITE } from "@/lib/site";

export const runtime = "edge";
export const alt = `${SITE.brandName}, ${SITE.descriptor} in ${SITE.city}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The site-wide social card.
 *
 * Brand green field, the TechBrotherz wordmark, the page proposition, and the
 * standing trust line. Drawn with ImageResponse rather than a static file so it
 * stays in step with the brand tokens, and so per-route cards can override it
 * with the same layout.
 *
 * Colours are literal here because ImageResponse renders outside the browser
 * and cannot read the CSS custom properties. They mirror DESIGN.md Section 2.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#0A0D0C",
        padding: "72px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* The Z mark from components/layout/Logo.tsx, dark colourway since
            the card is on ink. Colours literal because ImageResponse cannot
            read CSS custom properties. */}
        <svg viewBox="0 0 64 64" width="44" height="44">
          <rect width="64" height="64" rx="16" fill="#21B24B" />
          <path
            d="M18 20h28L18 44h28"
            fill="none"
            stroke="#0A0D0C"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div style={{ display: "flex", fontSize: 34, fontWeight: 800, letterSpacing: "-0.02em" }}>
          <span style={{ color: "#21B24B" }}>Tech</span>
          <span style={{ color: "#FFFFFF" }}>BrotherZ</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
        <div
          style={{
            fontSize: 76,
            fontWeight: 700,
            color: "#FFFFFF",
            letterSpacing: "-0.035em",
            lineHeight: 1.02,
            maxWidth: "960px",
            display: "flex",
          }}
        >
          Phone and computer repairs, done while you wait
        </div>

        <div style={{ fontSize: 30, color: "#A9B0AC", display: "flex" }}>
          {SITE.street}, {SITE.city}, {SITE.region}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "18px",
          borderTop: "1px solid #232B27",
          paddingTop: "28px",
          fontSize: 26,
          color: "#C4CBD2",
        }}
      >
        <span>Walk in</span>
        <span style={{ color: "#21B24B" }}>·</span>
        <span>No appointment</span>
        <span style={{ color: "#21B24B" }}>·</span>
        <span>60-day warranty</span>
        <span style={{ color: "#21B24B" }}>·</span>
        <span>Calgary</span>
      </div>
    </div>,
    size,
  );
}
