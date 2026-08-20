import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { SITE, type DayName } from "@/lib/site";
import { siteUrl } from "@/lib/site-url";

/** Merge conditional class names and resolve Tailwind conflicts. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

const CAD = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Format a CAD price. The one place currency formatting is decided.
 *
 * A null price is never rendered as a dash, an "N/A" or a guess. The caller
 * renders "Call for quote" linked to the phone number instead.
 * CLAUDE.md Section 3, rule 1.
 */
export function formatPrice(price: number | null | undefined): string | null {
  if (price === null || price === undefined || Number.isNaN(price)) return null;
  return CAD.format(price);
}

/** "from $120" and "$69.99 to $149.99" ranges, formatted consistently. */
export function formatPriceRange(
  price: number | null | undefined,
  options: { from?: boolean; to?: number | null } = {},
): string | null {
  const base = formatPrice(price);
  if (!base) return null;

  const upper = formatPrice(options.to);
  if (upper) return `${base} to ${upper}`;
  if (options.from) return `from ${base}`;
  return base;
}

/** "About 30 minutes", "About 1 hour 30 minutes". */
export function formatMinutes(minutes: number | null | undefined): string | null {
  if (!minutes || minutes <= 0) return null;
  if (minutes < 60) return `About ${minutes} minutes`;

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  const hourLabel = `${hours} hour${hours === 1 ? "" : "s"}`;
  return rest === 0 ? `About ${hourLabel}` : `About ${hourLabel} ${rest} minutes`;
}

/** Lowercase, hyphenated, no trailing separators. Matches the slug rules. */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Absolute URL for canonicals, JSON-LD and the sitemap. */
export function absoluteUrl(path: string): string {
  const base = siteUrl();
  if (!path || path === "/") return base;
  return `${base}/${path.replace(/^\//, "")}`;
}

const DAY_ORDER: DayName[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/**
 * Whether the shop is open at the given instant, evaluated in the shop's own
 * time zone rather than the visitor's.
 *
 * Call this on the client only. Rendering it on the server would bake the
 * build-time answer into static HTML and cause a hydration mismatch.
 */
export function isOpenNow(now: Date = new Date()): { open: boolean; day: DayName } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: SITE.timeZone,
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const weekday = parts.find((p) => p.type === "weekday")?.value as DayName | undefined;
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");

  const day = weekday && DAY_ORDER.includes(weekday) ? weekday : "Monday";
  const entry = SITE.hours.find((h) => h.day === day);

  if (!entry || entry.closed) return { open: false, day };

  const minutesNow = hour * 60 + minute;
  return { open: minutesNow >= toMinutes(entry.open) && minutesNow < toMinutes(entry.close), day };
}

function toMinutes(time24: string): number {
  const [h, m] = time24.split(":");
  return Number(h) * 60 + Number(m ?? 0);
}

/* ------------------------------------------------------------- title case */

/**
 * The heading capitalisation rule, 2026-08 on the client's instruction.
 *
 * Title Case for headings, card titles, nav labels, buttons and chips:
 * principal words capitalised, articles, conjunctions and short prepositions
 * left lowercase unless first or last. Two properties matter more than the
 * word list:
 *
 * 1. **It only ever raises case, never lowers it.** A word already carrying a
 *    capital anywhere (iPhone, MacBook, FRP, TechBrotherz, SE) passes through
 *    untouched, so brand and device casing can never be mangled.
 * 2. **It is applied at render, in the display components only.** AnswerBox
 *    copy, FAQ answers, plainAnswer, meta descriptions and JSON-LD never pass
 *    through it, so the prose surfaces answer engines read stay sentence
 *    case. CLAUDE.md Section 8.7.
 */
const TITLE_SMALL_WORDS = new Set([
  "a", "an", "and", "as", "at", "but", "by", "for", "in", "nor",
  "of", "on", "or", "so", "the", "to", "up", "via", "vs",
]);

export function titleCase(input: string): string {
  const words = input.split(" ");
  return words
    .map((word, index) => {
      if (!word) return word;
      // Already cased (iPhone, MacBook, SE, FRP, TechBrotherz): hands off.
      if (/[A-Z]/.test(word)) return word;
      const bare = word.replace(/[^a-z']/g, "");
      const isEdge = index === 0 || index === words.length - 1;
      if (!isEdge && TITLE_SMALL_WORDS.has(bare)) return word;
      // Capitalise the first letter of each hyphen segment, small words aside:
      // "walk-in" becomes "Walk-in", "tune-up" as the last word "Tune-Up".
      return word
        .split("-")
        .map((segment, segmentIndex) => {
          if (segmentIndex > 0 && TITLE_SMALL_WORDS.has(segment) && !isEdge) return segment;
          const at = segment.search(/[a-z]/);
          if (at === -1) return segment;
          return segment.slice(0, at) + segment.charAt(at).toUpperCase() + segment.slice(at + 1);
        })
        .join("-");
    })
    .join(" ");
}
