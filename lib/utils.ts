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
