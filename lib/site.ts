import { siteUrl } from "./site-url";

/**
 * TechBrotherz business facts, the single source of truth in code.
 *
 * `content/data/site-settings.ts` is primary and this module is the typed
 * fallback and default. Values here must stay identical to
 * the table in CLAUDE.md Section 2, character for character.
 *
 * NAP consistency is absolute: name, address and phone must match everywhere,
 * on the page, in JSON-LD and in llms.txt.
 *
 * Never invent a value. Fields the client has not confirmed are `null` and
 * render as nothing, not as a guess. See CLAUDE.md Section 12.
 */

export type DayName =
  "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export interface OpeningHours {
  day: DayName;
  /** 24-hour "HH:mm" in the shop's local time, America/Edmonton. */
  open: string;
  close: string;
  closed: boolean;
}

const WEEKDAY_HOURS = { open: "10:00", close: "19:00", closed: false } as const;

export const SITE = {
  brandName: "TechBrotherz",
  legalName: "TechBrotherz",
  descriptor: "Cell Phone / Computer Repair",
  tagline: "Phone and computer repairs, done while you wait",
  domain: "techbrotherz.com",

  /** Address. Postal code is unconfirmed, see CLAUDE.md open question 10. */
  street: "3317 17 Ave SE",
  city: "Calgary",
  region: "Alberta",
  regionCode: "AB",
  postalCode: null as string | null,
  country: "Canada",
  countryCode: "CA",

  /** Coordinates unconfirmed, see CLAUDE.md open question 12. */
  geo: null as { lat: number; lng: number } | null,

  /** Display form. Use this in every piece of visible copy. */
  phone: "(403) 273-8324",
  /** E.164 form. Use this for tel: links and JSON-LD only. */
  phoneRaw: "+14032738324",
  email: null as string | null,

  locale: "en-CA",
  timeZone: "America/Edmonton",
  currency: "CAD",

  hours: [
    { day: "Monday", ...WEEKDAY_HOURS },
    { day: "Tuesday", ...WEEKDAY_HOURS },
    { day: "Wednesday", ...WEEKDAY_HOURS },
    { day: "Thursday", ...WEEKDAY_HOURS },
    { day: "Friday", ...WEEKDAY_HOURS },
    { day: "Saturday", ...WEEKDAY_HOURS },
    { day: "Sunday", open: "11:00", close: "17:00", closed: false },
  ] satisfies OpeningHours[],

  warrantyDays: 60,
  appointmentPolicy: "No appointment needed, walk-ins welcome",
  typicalWaitMinutes: 30,
  priceDisclaimer:
    "All prices include the part and labour, and every repair is covered by a 60-day warranty.",

  serviceArea: ["Calgary", "Chestermere", "Airdrie", "and surrounding Alberta communities"],
  /** Used verbatim in JSON-LD areaServed. */
  areaServed: ["Calgary", "Chestermere", "Airdrie"],

  /** Google Maps link. Replaced with the Business Profile URL once claimed. */
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=3317+17+Ave+SE+Calgary+Alberta",
  /** The listing with the reviews tab open. Supplied by the client 2026-08. */
  googleReviewsUrl:
    "https://www.google.com/maps/place/TechBrotherz/@51.0366821,-113.9869842,17z/data=!3m1!5s0x53717ae7a5d4f8d7:0xb018a331a11900ca!4m8!3m7!1s0x53717ae777fa04f7:0xe21ea3f908974600!8m2!3d51.0366821!4d-113.9869842!9m1!1b1!16s%2Fg%2F1ptx_hp3y!18m1!1e1",
  /** Unconfirmed, see CLAUDE.md open question 8. */
  googleBusinessUrl: null as string | null,

  /**
   * Real, verifiable trust signals only. This list replaces the reference
   * template's fake rating badge and logo cloud.
   * Never add a star rating, an avatar stack or a customer count here unless
   * the client supplies verified Google review data.
   */
  trustFacts: [
    "60-day warranty on every repair",
    "No appointment needed",
    "Most repairs take about 30 minutes",
    "Parts and labour included in every price",
  ],
} as const;

/** Canonical origin, no trailing slash. See lib/site-url.ts. */
export const SITE_URL = siteUrl();

/** `tel:` href built from the E.164 number. */
export const TEL_HREF = `tel:${SITE.phoneRaw}`;

/**
 * The entity string that must open the first paragraph of every important
 * page. Repeating it verbatim across the site is what builds the entity in an
 * answer engine's index. CLAUDE.md Section 8.4.
 */
export const ENTITY_SENTENCE = `TechBrotherz, a walk-in cell phone and computer repair shop at ${SITE.street} in ${SITE.city}, ${SITE.region}`;

/** Single-line address used in the footer, contact card and JSON-LD. */
export const ADDRESS_LINE = [SITE.street, SITE.city, SITE.regionCode, SITE.postalCode]
  .filter(Boolean)
  .join(", ");

/** Grouped hours for display, so identical consecutive days collapse. */
export function groupedHours(): { label: string; value: string }[] {
  const groups: { days: DayName[]; open: string; close: string; closed: boolean }[] = [];

  for (const entry of SITE.hours) {
    const last = groups[groups.length - 1];
    if (
      last &&
      last.open === entry.open &&
      last.close === entry.close &&
      last.closed === entry.closed
    ) {
      last.days.push(entry.day);
    } else {
      groups.push({
        days: [entry.day],
        open: entry.open,
        close: entry.close,
        closed: entry.closed,
      });
    }
  }

  return groups.map((group) => {
    const first = group.days[0];
    const last = group.days[group.days.length - 1];
    const label =
      group.days.length === 1
        ? String(first)
        : `${String(first).slice(0, 3)} to ${String(last).slice(0, 3)}`;

    return {
      label,
      value: group.closed ? "Closed" : `${to12Hour(group.open)} to ${to12Hour(group.close)}`,
    };
  });
}

/** "19:00" becomes "7:00 PM". */
export function to12Hour(time24: string): string {
  const [rawHours, rawMinutes] = time24.split(":");
  const hours = Number(rawHours);
  const minutes = rawMinutes ?? "00";
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${minutes} ${period}`;
}
