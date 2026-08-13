/**
 * The service areas, from the client's Google Business Profile list, supplied
 * 2026-08 and authoritative for what the site publishes as served areas.
 *
 * One list drives all four surfaces: `areaServed` in the LocalBusiness schema,
 * the tile grid on the home page, the tile grid on /locations, and the footer
 * area column, so they cannot drift apart.
 *
 * The Phase 6 four-fact rule still decides which areas get their own PAGE.
 * Today that is Calgary, Forest Lawn and Chestermere; every other area anchors
 * to its honest section on /locations/calgary, and no tile is ever a dead
 * link. Strathmore, Bragg Creek and Mînî Thnî are outside Calgary and their
 * sections say so plainly: areas the Store serves customers from, not
 * neighbourhoods.
 *
 * "Forest Lawn and Forest Heights" arrives as one profile entry and is split
 * here, because they are two communities: Forest Lawn has its page and Forest
 * Heights its section. Ogden and Marlborough are not on the profile list but
 * keep their tiles: their sections were written at the client's request and
 * remain true.
 */

export interface ServiceArea {
  /** The name as it appears in areaServed and on the tile. */
  name: string;
  /** A real destination: a page, or an anchored section the link audit checks. */
  href: string;
  /** On the client's Google Business Profile list. */
  onProfile: boolean;
}

export const SERVICE_AREAS: ServiceArea[] = [
  { name: "Calgary", href: "/locations/calgary", onProfile: true },
  { name: "Southeast Calgary", href: "/locations/calgary", onProfile: true },
  { name: "Forest Lawn", href: "/locations/calgary/forest-lawn", onProfile: true },
  { name: "Forest Heights", href: "/locations/calgary#forest-heights", onProfile: true },
  {
    name: "Radisson Heights",
    href: "/locations/calgary#albert-park-radisson-heights",
    onProfile: true,
  },
  { name: "Albert Park", href: "/locations/calgary#albert-park-radisson-heights", onProfile: true },
  { name: "Penbrooke Meadows", href: "/locations/calgary#penbrooke-meadows", onProfile: true },
  { name: "Applewood Park", href: "/locations/calgary#applewood-park", onProfile: true },
  { name: "Erin Woods", href: "/locations/calgary#erin-woods", onProfile: true },
  { name: "Dover", href: "/locations/calgary#dover", onProfile: true },
  { name: "Southview", href: "/locations/calgary#southview", onProfile: true },
  { name: "Inglewood", href: "/locations/calgary#inglewood", onProfile: true },
  { name: "Ramsay", href: "/locations/calgary#ramsay", onProfile: true },
  { name: "Downtown Calgary", href: "/locations/calgary#downtown-calgary", onProfile: true },
  { name: "Chestermere", href: "/locations/chestermere", onProfile: true },
  { name: "Strathmore", href: "/locations/calgary#strathmore", onProfile: true },
  { name: "Bragg Creek", href: "/locations/calgary#bragg-creek", onProfile: true },
  { name: "Mînî Thnî", href: "/locations/calgary#mini-thni", onProfile: true },
  // Kept beyond the profile list: sections written at the client's request.
  { name: "Ogden", href: "/locations/calgary#ogden", onProfile: false },
  { name: "Marlborough", href: "/locations/calgary#marlborough", onProfile: false },
];

/**
 * The areaServed values for the LocalBusiness schema: every profile area, plus
 * Airdrie, which the site's prose has claimed as served since Phase 6 and
 * which not being on the profile list does not contradict. Flagged in
 * CLAUDE.md for the client to reconcile.
 */
export const AREA_SERVED: string[] = [
  ...SERVICE_AREAS.filter((area) => area.onProfile).map((area) => area.name),
  "Airdrie",
];
