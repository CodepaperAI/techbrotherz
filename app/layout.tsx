import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";

import { fontVariables } from "@/app/fonts";
import { ROOT_METADATA } from "@/lib/seo/metadata";
import { SITE } from "@/lib/site";

import "@/app/globals.css";

export const metadata: Metadata = ROOT_METADATA;

export const viewport: Viewport = {
  themeColor: "#0B0C0B",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={SITE.locale} className={fontVariables}>
      <body className="bg-tb-paper text-tb-ink min-h-dvh font-sans antialiased">
        {children}
        {/* Vercel Analytics serves its script from the platform, so off Vercel
            it 404s on every page load and logs a console error. Rendered only
            where it can actually work. */}
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
