/**
 * Header and footer link matrices, derived from the route registry.
 *
 * Nothing here hardcodes a URL. Every entry is a lookup into lib/routes.ts, so
 * a link cannot exist in the footer without existing in the registry, and a
 * pending route is filtered out of the production build automatically.
 *
 * The footer matrix is what gives every important page a site-wide inbound
 * link, so it is an internal-linking requirement rather than decoration.
 * CLAUDE.md Section 9, rule 8.
 */

import { ROUTES, route, shouldRenderLink, type RouteDef } from "@/lib/routes";

export interface NavLink {
  label: string;
  href: string;
  /** True when the target page has not shipped yet. Dev only. */
  pending: boolean;
}

export interface FooterColumn {
  heading: string;
  links: NavLink[];
}

function toLink(path: string, labelOverride?: string): NavLink | null {
  const entry = route(path);
  if (!entry) {
    // A typo in a path is a build-time mistake, not a silent missing link.
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[nav] "${path}" is not in the route registry, so it was dropped.`);
    }
    return null;
  }
  if (!shouldRenderLink(path)) return null;

  return {
    label: labelOverride ?? entry.navLabel ?? entry.label,
    href: entry.path,
    pending: entry.status === "pending",
  };
}

function toLinks(paths: string[]): NavLink[] {
  return paths.map((path) => toLink(path)).filter((link): link is NavLink => link !== null);
}

/* -------------------------------------------------------------------- header */

/**
 * Built pages only.
 *
 * /guides was here as "Repair guides and answers", flagged "soon". Renaming a
 * link to a page that does not exist does not make it a link worth having, and
 * the flag only hides it in production, so in development the header pointed at
 * a 404 for the sake of a label. It comes back when Phase 7 builds the guides.
 * /repair-prices went with the price list itself.
 */
/**
 * Reworked 2026-08 to mirror the reference site's single-page shape: Services,
 * Reviews and Hours are anchors into the home page sections (real ids the link
 * audit verifies), and the rest are pages. "/#section" works from any page.
 */
export function headerLinks(): NavLink[] {
  const anchors: NavLink[] = [
    { label: "Services", href: "/#services", pending: false },
    { label: "Reviews", href: "/#reviews", pending: false },
    { label: "Hours", href: "/#hours", pending: false },
  ];
  return [...anchors, ...toLinks(["/locations", "/blog", "/about", "/contact"])];
}

/* -------------------------------------------------------------------- footer */

/**
 * Every path here is a built route.
 *
 * The matrix used to carry eleven paths that are not in the registry at all:
 * the pre-Phase-5 service hubs, /repair-prices, the seven Calgary
 * neighbourhoods and Airdrie cut by the Phase 6 four-fact rule, and four Phase 7
 * guides. `toLink` dropped every one of them, so production was never wrong,
 * but the columns were shorter than they read here and development logged a
 * warning per path on every render. The Phase 6 cuts are replaced by the Tier 5
 * pages that actually carry that intent.
 */
const FOOTER_MATRIX: { heading: string; paths: string[] }[] = [
  {
    heading: "Repairs",
    paths: [
      "/services/phone-repair",
      "/services/ipad-repair",
      "/services/laptop-repair",
      "/services/computer-repair",
      "/services/phone-unlocking",
      "/services/password-reset",
      "/services/virus-removal",
      "/services/game-console-repair",
      "/services/frp-removal",
      "/services",
    ],
  },
  {
    // LG, Motorola and HTC were removed with their brands in 2026-08; toLink
    // was silently dropping them, so the paths went too.
    heading: "Devices",
    paths: [
      "/repair/apple-iphone",
      "/repair/samsung-galaxy",
      "/repair/apple-ipad",
      "/repair/google-pixel",
      "/repair/laptops-desktops",
      "/accessories",
    ],
  },
  /*
   * The "Areas we serve" column is rendered by Footer.tsx directly from the
   * Google Business Profile list in lib/content/service-areas.ts (2026-08),
   * because its entries are anchored sections rather than registry paths. The
   * Tier 5 service-area pages that used to sit in it moved here so they keep
   * their site-wide inbound link.
   */
  {
    heading: "Repair near you",
    paths: [
      "/phone-repair-calgary",
      "/iphone-screen-repair-calgary",
      "/samsung-repair-calgary",
      "/ipad-repair-calgary",
      "/laptop-repair-calgary",
      "/computer-repair-calgary",
      "/phone-unlocking-calgary",
      "/walk-in-phone-repair-calgary",
      "/cell-phone-repair-chestermere",
      "/locations",
    ],
  },
  {
    heading: "Learn",
    paths: ["/blog", "/buy-sell-trade", "/faq", "/warranty", "/about", "/contact"],
  },
];

export function footerColumns(): FooterColumn[] {
  return FOOTER_MATRIX.map((column) => ({
    heading: column.heading,
    links: toLinks(column.paths),
  })).filter((column) => column.links.length > 0);
}

/**
 * The legal row renders no "soon" flag, so a pending route here reads as an
 * ordinary link straight to a 404 in development. /sitemap comes back when
 * Phase 8 builds the HTML sitemap.
 */
export function footerLegalLinks(): NavLink[] {
  return toLinks(["/privacy-policy", "/terms"]);
}

/** Used by the Phase 8 link audit and the /styleguide/routes page. */
export function allRegisteredRoutes(): RouteDef[] {
  return ROUTES;
}
