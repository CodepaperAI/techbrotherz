import { Inter, Plus_Jakarta_Sans } from "next/font/google";

/**
 * Display face.
 *
 * The reference template's headline face is closest to Satoshi (Fontshare).
 * Satoshi is not on Google Fonts and needs a self-hosted file plus a licence
 * confirmation from the client, tracked as open question 16 in CLAUDE.md.
 * Plus Jakarta Sans is the same geometric-grotesque character and is served
 * self-hosted by next/font/google.
 *
 * To swap to Satoshi later: drop Satoshi-Variable.woff2 into app/fonts/,
 * replace this export with next/font/local, and keep the same variable name.
 * Nothing else in the codebase changes.
 */
export const displayFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  // Only the weights the display face actually renders: 700 for headings,
  // 800 for the wordmark. Every extra weight is another file preloaded on the
  // critical path, competing with the LCP text it is meant to render.
  weight: ["700", "800"],
  variable: "--font-display-family",
  // Generates a size-adjusted local fallback so the swap causes no layout
  // shift. CLAUDE.md Section 8.1 targets CLS under 0.05.
  adjustFontFallback: true,
  preload: true,
});

/** Body and UI face. */
export const bodyFont = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
  variable: "--font-sans-family",
  adjustFontFallback: true,
  preload: true,
});

export const fontVariables = `${displayFont.variable} ${bodyFont.variable}`;
