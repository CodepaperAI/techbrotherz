/**
 * The route registry: one typed list of every URL in the site plan.
 *
 * This is the source of truth for the header, the footer matrix, breadcrumbs,
 * the HTML sitemap in Phase 8 and the Phase 8 link audit. A route that has not
 * shipped yet is marked `pending`, and pending routes are rendered only in
 * development, visually flagged, so the live site never links to a 404.
 *
 * When a page lands, flip its `status` to "built". That is the whole change.
 */

export type RouteStatus = "built" | "pending";

export type RouteTier =
  | "core"
  | "service-hub"
  | "repair-type"
  | "brand"
  | "local"
  | "neighbourhood"
  | "guide"
  | "utility"
  | "internal";

export interface RouteDef {
  /** Absolute path, lowercase, no trailing slash. */
  path: string;
  /** Descriptive anchor text. Never "click here" or "read more". */
  label: string;
  /** Shorter form for the header, where space is tight. */
  navLabel?: string;
  tier: RouteTier;
  status: RouteStatus;
  /** Parent path, used to build breadcrumbs. */
  parent?: string;
}

const TIER_LABELS: Record<RouteTier, string> = {
  core: "Core pages",
  "service-hub": "Service hubs",
  "repair-type": "Repair-type pages",
  brand: "Brand and model pages",
  local: "Local landing pages",
  neighbourhood: "Neighbourhood pages",
  guide: "Guides",
  utility: "Utility endpoints",
  internal: "Internal",
};

export function tierLabel(tier: RouteTier): string {
  return TIER_LABELS[tier];
}

/* -------------------------------------------------------------- the registry */

export const ROUTES: RouteDef[] = [
  /* --- Core ------------------------------------------------------------ */
  { path: "/", label: "Home", tier: "core", status: "built" },
  {
    path: "/services",
    label: "All repair services",
    navLabel: "Services",
    tier: "core",
    status: "built",
    parent: "/",
  },
  {
    path: "/locations",
    label: "Areas we serve",
    navLabel: "Locations",
    tier: "core",
    status: "built",
    parent: "/",
  },
  {
    path: "/faq",
    label: "Frequently asked questions",
    navLabel: "FAQ",
    tier: "core",
    status: "built",
    parent: "/",
  },
  {
    path: "/about",
    label: "About TechBrotherz",
    navLabel: "About",
    tier: "core",
    status: "built",
    parent: "/",
  },
  {
    path: "/contact",
    label: "Contact and directions",
    navLabel: "Contact",
    tier: "core",
    status: "built",
    parent: "/",
  },
  {
    path: "/warranty",
    label: "Our 60-day warranty",
    navLabel: "Warranty",
    tier: "core",
    status: "built",
    parent: "/",
  },
  {
    path: "/accessories",
    label: "Phone, iPad and tablet accessories",
    navLabel: "Accessories",
    tier: "core",
    status: "built",
    parent: "/",
  },
  { path: "/privacy-policy", label: "Privacy policy", tier: "core", status: "built", parent: "/" },
  { path: "/terms", label: "Terms of service", tier: "core", status: "built", parent: "/" },

  // Phase 7 ships /guides with its articles. An index with no entries is worse
  // than no index.
  {
    path: "/guides",
    label: "Repair guides and answers",
    tier: "core",
    status: "pending",
    parent: "/",
  },
  // Phase 8.
  { path: "/sitemap", label: "Sitemap", tier: "core", status: "pending", parent: "/" },

  /* --- Tier 2, service hubs -------------------------------------------
   *
   * Device categories and non-device services only. Phase 5 removed the
   * brand-specific hubs (/services/iphone-repair and friends): the Tier 4
   * brand hub at /repair/apple-iphone already owns "which iPhone do you
   * have", and a second page on the same intent competes with it for
   * nothing. See CLAUDE.md Section 7 for the intent table.
   */
  {
    path: "/services/phone-repair",
    label: "Cell phone repair",
    tier: "service-hub",
    status: "built",
    parent: "/services",
  },
  {
    path: "/services/tablet-repair",
    label: "Tablet and iPad repair",
    navLabel: "Tablets",
    tier: "service-hub",
    status: "built",
    parent: "/services",
  },
  {
    path: "/services/laptop-repair",
    label: "Laptop repair",
    tier: "service-hub",
    status: "built",
    parent: "/services",
  },
  {
    path: "/services/computer-repair",
    label: "Computer repair",
    tier: "service-hub",
    status: "built",
    parent: "/services",
  },
  {
    path: "/services/phone-unlocking",
    label: "Phone unlocking",
    navLabel: "Unlocking",
    tier: "service-hub",
    status: "built",
    parent: "/services",
  },
  {
    path: "/services/password-reset",
    label: "Computer password reset",
    navLabel: "Password reset",
    tier: "service-hub",
    status: "built",
    parent: "/services",
  },
  {
    path: "/services/virus-removal",
    label: "Virus removal",
    tier: "service-hub",
    status: "built",
    parent: "/services",
  },
  {
    path: "/services/game-console-repair",
    label: "Game console repair",
    navLabel: "Consoles",
    tier: "service-hub",
    status: "built",
    parent: "/services",
  },

  /* --- Tier 3, repair-type pages ---------------------------------------
   *
   * A flat /repairs/ namespace, deliberately separate from /repair/ so the
   * repair slugs can never collide with the brand and model slugs. Each page
   * is one repair across every model we do it on, which is the cut of the
   * price data no other template presents.
   */
  {
    path: "/repairs/iphone-screen-replacement",
    label: "iPhone screen replacement",
    tier: "repair-type",
    status: "built",
    parent: "/services/phone-repair",
  },
  {
    path: "/repairs/iphone-battery-replacement",
    label: "iPhone battery replacement",
    tier: "repair-type",
    status: "built",
    parent: "/services/phone-repair",
  },
  {
    path: "/repairs/iphone-charging-port-repair",
    label: "iPhone charging port repair",
    tier: "repair-type",
    status: "built",
    parent: "/services/phone-repair",
  },
  {
    path: "/repairs/iphone-camera-repair",
    label: "iPhone camera repair",
    tier: "repair-type",
    status: "built",
    parent: "/services/phone-repair",
  },
  {
    path: "/repairs/iphone-back-glass-replacement",
    label: "iPhone back glass replacement",
    tier: "repair-type",
    status: "built",
    parent: "/services/phone-repair",
  },
  {
    path: "/repairs/samsung-screen-replacement",
    label: "Samsung screen replacement",
    tier: "repair-type",
    status: "built",
    parent: "/services/phone-repair",
  },
  {
    path: "/repairs/samsung-battery-replacement",
    label: "Samsung battery replacement",
    tier: "repair-type",
    status: "built",
    parent: "/services/phone-repair",
  },
  {
    path: "/repairs/samsung-back-glass-replacement",
    label: "Samsung back glass replacement",
    tier: "repair-type",
    status: "built",
    parent: "/services/phone-repair",
  },
  {
    path: "/repairs/samsung-charging-port-repair",
    label: "Samsung charging port repair",
    tier: "repair-type",
    status: "built",
    parent: "/services/phone-repair",
  },
  {
    path: "/repairs/ipad-screen-replacement",
    label: "iPad screen replacement",
    tier: "repair-type",
    status: "built",
    parent: "/services/tablet-repair",
  },
  {
    path: "/repairs/laptop-screen-replacement",
    label: "Laptop screen replacement",
    tier: "repair-type",
    status: "built",
    parent: "/services/laptop-repair",
  },
  {
    path: "/repairs/laptop-keyboard-replacement",
    label: "Laptop keyboard replacement",
    tier: "repair-type",
    status: "built",
    parent: "/services/laptop-repair",
  },
  {
    path: "/repairs/laptop-charging-port-repair",
    label: "Laptop charging port repair",
    tier: "repair-type",
    status: "built",
    parent: "/services/laptop-repair",
  },
  {
    path: "/repairs/windows-installation",
    label: "Windows installation",
    tier: "repair-type",
    status: "built",
    parent: "/services/computer-repair",
  },
  {
    path: "/repairs/computer-tune-up",
    label: "Computer tune-up",
    tier: "repair-type",
    status: "built",
    parent: "/services/computer-repair",
  },
  {
    path: "/repairs/computer-diagnostics",
    label: "Computer diagnostics",
    tier: "repair-type",
    status: "built",
    parent: "/services/computer-repair",
  },

  /* --- Tier 4, brand hubs. Model pages are dynamic, see isModelRoute. --- */
  {
    path: "/repair/apple-iphone",
    label: "iPhone repair",
    tier: "brand",
    status: "built",
    parent: "/services",
  },
  {
    path: "/repair/apple-ipad",
    label: "iPad repair",
    tier: "brand",
    status: "built",
    parent: "/services",
  },
  {
    path: "/repair/samsung-galaxy",
    label: "Samsung Galaxy repair",
    tier: "brand",
    status: "built",
    parent: "/services",
  },
  {
    path: "/repair/google-pixel",
    label: "Google Pixel repair",
    tier: "brand",
    status: "built",
    parent: "/services",
  },
  /*
   * LG, Motorola, HTC and Google Nexus were removed on the client's
   * instruction in 2026-08. Their hub and model URLs 301 to
   * /services/phone-repair in next.config.ts rather than 404, because all
   * fifteen model pages and four hubs were live.
   */
  {
    path: "/repair/laptops-desktops",
    label: "Laptop and desktop repair",
    tier: "brand",
    status: "built",
    parent: "/services",
  },

  /* --- Tier 5, service and place -------------------------------------
   *
   * These differentiate on service, which the Phase 5 repair tier showed
   * works. Phase 6 cut the two Airdrie pages, because Airdrie reached only
   * three verifiable distinct facts and two of them were reasons not to make
   * the trip, and merged the same-day page into the walk-in page, because
   * those differed by modifier rather than by service. See
   * content/local-inventory.md.
   */
  {
    path: "/phone-repair-calgary",
    label: "Phone repair in Calgary",
    tier: "local",
    status: "built",
    parent: "/locations",
  },
  {
    path: "/iphone-screen-repair-calgary",
    label: "iPhone screen repair in Calgary",
    tier: "local",
    status: "built",
    parent: "/locations",
  },
  {
    path: "/samsung-repair-calgary",
    label: "Samsung repair in Calgary",
    tier: "local",
    status: "built",
    parent: "/locations",
  },
  {
    path: "/ipad-repair-calgary",
    label: "iPad repair in Calgary",
    tier: "local",
    status: "built",
    parent: "/locations",
  },
  {
    path: "/tablet-repair-calgary",
    label: "Tablet repair in Calgary",
    tier: "local",
    status: "built",
    parent: "/locations",
  },
  {
    path: "/laptop-repair-calgary",
    label: "Laptop repair in Calgary",
    tier: "local",
    status: "built",
    parent: "/locations",
  },
  {
    path: "/computer-repair-calgary",
    label: "Computer repair in Calgary",
    tier: "local",
    status: "built",
    parent: "/locations",
  },
  {
    path: "/phone-unlocking-calgary",
    label: "Phone unlocking in Calgary",
    tier: "local",
    status: "built",
    parent: "/locations",
  },
  {
    path: "/walk-in-phone-repair-calgary",
    label: "Walk-in phone repair in Calgary",
    tier: "local",
    status: "built",
    parent: "/locations",
  },
  {
    path: "/cell-phone-repair-chestermere",
    label: "Cell phone repair in Chestermere",
    tier: "local",
    status: "built",
    parent: "/locations",
  },

  /* --- Tier 6, place --------------------------------------------------
   *
   * Four became three. The seven Calgary neighbourhoods are anchored
   * sections on /locations/calgary rather than URLs, because eleven pages
   * about one shop is a differentiation problem no template solves, and
   * Airdrie was cut on the four-fact rule.
   */
  {
    path: "/locations/calgary",
    label: "Calgary",
    tier: "neighbourhood",
    status: "built",
    parent: "/locations",
  },
  {
    path: "/locations/calgary/forest-lawn",
    label: "Forest Lawn",
    tier: "neighbourhood",
    status: "built",
    parent: "/locations/calgary",
  },
  {
    path: "/locations/chestermere",
    label: "Chestermere",
    tier: "neighbourhood",
    status: "built",
    parent: "/locations",
  },

  /* --- Tier 7, guides -------------------------------------------------- */
  {
    path: "/guides/how-to-unlock-a-cell-phone-in-canada",
    label: "How to unlock a cell phone in Canada",
    tier: "guide",
    status: "pending",
    parent: "/guides",
  },
  {
    path: "/guides/ipad-repair-vs-replacement-cost",
    label: "iPad repair vs replacement cost",
    tier: "guide",
    status: "pending",
    parent: "/guides",
  },
  {
    path: "/guides/signs-your-laptop-needs-repair",
    label: "Signs your laptop needs repair",
    tier: "guide",
    status: "pending",
    parent: "/guides",
  },
  {
    path: "/guides/walk-in-phone-repair-no-appointment",
    label: "Walk-in phone repair, no appointment",
    tier: "guide",
    status: "pending",
    parent: "/guides",
  },
  {
    path: "/guides/iphone-screen-repair-cost-calgary",
    label: "iPhone screen repair cost in Calgary",
    tier: "guide",
    status: "pending",
    parent: "/guides",
  },
  {
    path: "/guides/how-long-does-a-phone-screen-repair-take",
    label: "How long does a phone screen repair take",
    tier: "guide",
    status: "pending",
    parent: "/guides",
  },
  {
    path: "/guides/is-it-worth-repairing-an-older-iphone",
    label: "Is it worth repairing an older iPhone",
    tier: "guide",
    status: "pending",
    parent: "/guides",
  },
  {
    path: "/guides/how-to-choose-a-phone-repair-shop-in-calgary",
    label: "How to choose a phone repair shop in Calgary",
    tier: "guide",
    status: "pending",
    parent: "/guides",
  },
  {
    path: "/guides/phone-water-damage-what-to-do-first",
    label: "Phone water damage, what to do first",
    tier: "guide",
    status: "pending",
    parent: "/guides",
  },
  {
    path: "/guides/laptop-wont-turn-on-troubleshooting",
    label: "Laptop will not turn on, troubleshooting",
    tier: "guide",
    status: "pending",
    parent: "/guides",
  },
  {
    path: "/guides/iphone-battery-replacement-when-to-do-it",
    label: "iPhone battery replacement, when to do it",
    tier: "guide",
    status: "pending",
    parent: "/guides",
  },
  {
    path: "/guides/third-party-vs-apple-store-repair-canada",
    label: "Third-party vs Apple Store repair in Canada",
    tier: "guide",
    status: "pending",
    parent: "/guides",
  },
  {
    path: "/guides/how-to-back-up-your-phone-before-a-repair",
    label: "How to back up your phone before a repair",
    tier: "guide",
    status: "pending",
    parent: "/guides",
  },
  {
    path: "/guides/cracked-screen-vs-broken-lcd-difference",
    label: "Cracked screen vs broken LCD",
    tier: "guide",
    status: "pending",
    parent: "/guides",
  },

  /* --- Utility --------------------------------------------------------- */
  { path: "/robots.txt", label: "robots.txt", tier: "utility", status: "built" },
  { path: "/sitemap.xml", label: "XML sitemap", tier: "utility", status: "pending" },
  { path: "/llms.txt", label: "llms.txt", tier: "utility", status: "pending" },
  { path: "/llms-full.txt", label: "llms-full.txt", tier: "utility", status: "pending" },
  { path: "/api/revalidate", label: "Revalidation webhook", tier: "utility", status: "built" },

  /* --- Internal -------------------------------------------------------- */
  { path: "/studio", label: "Sanity Studio", tier: "internal", status: "built" },
  { path: "/styleguide", label: "Design system", tier: "internal", status: "built" },
  {
    path: "/styleguide/data",
    label: "Data layer proof",
    tier: "internal",
    status: "built",
    parent: "/styleguide",
  },
  {
    path: "/styleguide/images",
    label: "Image contact sheet",
    tier: "internal",
    status: "built",
    parent: "/styleguide",
  },
  {
    path: "/styleguide/routes",
    label: "Route registry",
    tier: "internal",
    status: "built",
    parent: "/styleguide",
  },
];

/* ------------------------------------------------------------------ lookups */

const BY_PATH = new Map(ROUTES.map((entry) => [entry.path, entry]));

export function route(path: string): RouteDef | undefined {
  return BY_PATH.get(path);
}

/**
 * Model pages are generated from Sanity in Phase 4, so they cannot be listed
 * individually here. They are treated as pending until that phase lands.
 */
export function isModelRoute(path: string): boolean {
  return /^\/repair\/[^/]+\/[^/]+$/.test(path);
}

export const MODEL_ROUTES_BUILT = true;

/** Whether a link to this path resolves to a real page today. */
export function isBuilt(path: string): boolean {
  if (isModelRoute(path)) return MODEL_ROUTES_BUILT;
  return route(path)?.status === "built";
}

/**
 * Should this link be rendered at all?
 *
 * Production hides pending links entirely, so the live site never emits an
 * internal 404. Development shows them, flagged, so the plan stays visible
 * while it is being built.
 */
export function shouldRenderLink(path: string): boolean {
  return isBuilt(path) || process.env.NODE_ENV !== "production";
}

export function routesByTier(tier: RouteTier): RouteDef[] {
  return ROUTES.filter((entry) => entry.tier === tier);
}

export interface TierStats {
  tier: RouteTier;
  label: string;
  built: number;
  pending: number;
  total: number;
}

export function routeStats(): TierStats[] {
  const tiers: RouteTier[] = [
    "core",
    "service-hub",
    "repair-type",
    "brand",
    "local",
    "neighbourhood",
    "guide",
    "utility",
    "internal",
  ];

  return tiers.map((tier) => {
    const entries = routesByTier(tier);
    const built = entries.filter((entry) => entry.status === "built").length;
    return {
      tier,
      label: TIER_LABELS[tier],
      built,
      pending: entries.length - built,
      total: entries.length,
    };
  });
}

/* -------------------------------------------------------------- breadcrumbs */

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * Walks the parent chain to build a breadcrumb trail. Home is prepended by the
 * Breadcrumbs component, and the final crumb is rendered as plain text, so this
 * returns the ancestors plus the current page without a link on the last one.
 */
export function breadcrumbsFor(path: string, overrideLabel?: string): Crumb[] {
  const chain: RouteDef[] = [];

  let current = route(path);
  while (current) {
    chain.unshift(current);
    current = current.parent ? route(current.parent) : undefined;
  }

  // Drop home, the Breadcrumbs component adds it.
  const withoutHome = chain.filter((entry) => entry.path !== "/");

  return withoutHome.map((entry, index) => {
    const isLast = index === withoutHome.length - 1;
    const label = isLast && overrideLabel ? overrideLabel : entry.label;
    return isLast ? { label } : { label, href: entry.path };
  });
}
