import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { StickyCallBar } from "@/components/layout/StickyCallBar";

/**
 * Site chrome for every public marketing page. /studio and /api sit outside
 * this route group so the Studio loads without the nav and footer.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="focus:rounded-chip focus:bg-tb-ink focus:text-tb-white sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-5 focus:py-3"
      >
        Skip to content
      </a>

      <Nav />

      {/* Bottom padding reserves room for the mobile sticky call bar. */}
      <main id="main" className="pb-24 lg:pb-0">
        {children}
      </main>

      <Footer />
      <StickyCallBar />
    </>
  );
}
