import { Archivo, Inter } from "next/font/google";

/**
 * Display face: Archivo.
 *
 * Phase 8 replaced Plus Jakarta Sans, and this is the single change that does
 * most of the work. Plus Jakarta Sans is a friendly geometric sans at 700; it
 * reads like a SaaS template because that is what it is used for. Archivo is a
 * grotesque with a variable width axis, so it can be set heavy and slightly
 * condensed, which is what every local repair shop headline in the reference
 * set actually is.
 *
 * Weights 700 to 900 and width 87.5% to 100% are both variable axes, so the
 * whole range costs one file rather than one file per weight. Headlines are set
 * at 900 with a condensed width and tight tracking; card headings at 800.
 *
 * This also closes open question 16. Satoshi needed a licence confirmation from
 * the client and a self-hosted file. Archivo is on Google Fonts under the SIL
 * Open Font License, self-hosted by next/font, so nothing is pending.
 */
export const displayFont = Archivo({
  subsets: ["latin"],
  display: "swap",
  // `axes` requires the variable weight range rather than a fixed list, so the
  // whole 100 to 900 range and the width axis arrive in one file. Headings pick
  // 800 and 900 out of it in globals.css.
  weight: "variable",
  axes: ["wdth"],
  variable: "--font-display-family",
  // Size-adjusted local fallback, so the swap causes no layout shift. The
  // build has held CLS at 0.000 since Phase 6.5 and this must not regress it.
  adjustFontFallback: true,
  preload: true,
});

/** Body and UI face. Unchanged: Inter was never the problem. */
export const bodyFont = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
  variable: "--font-sans-family",
  adjustFontFallback: true,
  preload: true,
});

export const fontVariables = `${displayFont.variable} ${bodyFont.variable}`;
