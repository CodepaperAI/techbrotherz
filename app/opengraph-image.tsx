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
        {/* The client's original mark, inlined as a data URL because the
            edge runtime cannot read files at request time. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          width={52}
          height={52}
          alt=""
          src="data:image/png;base64,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"
        />
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
