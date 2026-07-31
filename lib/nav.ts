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

const HEADER_PATHS = [
  "/services",
  "/repair-prices",
  "/services/phone-unlocking",
  "/locations",
  "/guides",
  "/about",
  "/contact",
];

export function headerLinks(): NavLink[] {
  return toLinks(HEADER_PATHS);
}

/* -------------------------------------------------------------------- footer */

/**
 * Every column mixes the pages of its tier with at least one page that is
 * already built, so no column collapses to nothing in production while the
 * later tiers are still being built.
 */
const FOOTER_MATRIX: { heading: string; paths: string[] }[] = [
  {
    heading: "Repairs",
    paths: [
      "/services/iphone-repair",
      "/services/samsung-repair",
      "/services/ipad-repair",
      "/services/tablet-repair",
      "/services/laptop-repair",
      "/services/computer-repair",
      "/services/phone-unlocking",
      "/services/password-reset",
      "/services",
    ],
  },
  {
    heading: "Prices",
    paths: [
      "/repair/apple-iphone",
      "/repair/samsung-galaxy",
      "/repair/apple-ipad",
      "/repair/lg",
      "/repair/motorola",
      "/repair/htc",
      "/repair/laptops-desktops",
      "/repair-prices",
    ],
  },
  {
    heading: "Areas we serve",
    paths: [
      "/locations/calgary",
      "/locations/calgary/forest-lawn",
      "/locations/calgary/southeast-calgary",
      "/locations/calgary/inglewood",
      "/locations/calgary/dover",
      "/locations/calgary/marlborough",
      "/locations/calgary/ogden",
      "/locations/chestermere",
      "/locations/airdrie",
      "/locations",
    ],
  },
  {
    heading: "Learn",
    paths: [
      "/guides/iphone-screen-repair-cost-calgary",
      "/guides/how-to-unlock-a-cell-phone-in-canada",
      "/guides/ipad-repair-vs-replacement-cost",
      "/guides/signs-your-laptop-needs-repair",
      "/faq",
      "/warranty",
      "/about",
      "/contact",
    ],
  },
];

export function footerColumns(): FooterColumn[] {
  return FOOTER_MATRIX.map((column) => ({
    heading: column.heading,
    links: toLinks(column.paths),
  })).filter((column) => column.links.length > 0);
}

export function footerLegalLinks(): NavLink[] {
  return toLinks(["/privacy-policy", "/terms", "/sitemap"]);
}

/** Used by the Phase 8 link audit and the /styleguide/routes page. */
export function allRegisteredRoutes(): RouteDef[] {
  return ROUTES;
}
