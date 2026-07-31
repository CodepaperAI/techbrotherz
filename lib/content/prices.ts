/**
 * Builds the price context the Tier 2 and Tier 3 copy reads from.
 *
 * The copy modules never contain a number. They ask this for one by key, and
 * this reads it from Sanity, so a price change in the Studio moves every
 * sentence on the site that quotes it. A key with no real price behind it
 * returns a phrase that still reads as a sentence rather than an empty string
 * or a fabricated figure. CLAUDE.md Section 3, ground rule 1.
 */

import type { ServiceCtx } from "@/lib/content/services";
import { formatPrice } from "@/lib/utils";

/** What a price reads as when Sanity has no real figure for it. */
const NO_PRICE = "a price quoted at the counter";

export interface PriceSources {
  models: {
    brandSlug?: string | null;
    deviceType?: string | null;
    prices?: ({ price?: number | null; repair?: { slug?: string | null } | null } | null)[] | null;
  }[];
  flatServices: { slug?: string | null; price?: number | null; priceTo?: number | null }[];
  unlocking: { price?: number | null }[];
  warrantyDays: number;
  waitMinutes: number;
}

/** Cheapest real price for a repair type, optionally inside one brand. */
function cheapest(
  models: PriceSources["models"],
  repairSlugs: string[],
  brandSlug?: string,
): number | null {
  const found = models
    .filter((model) => !brandSlug || model.brandSlug === brandSlug)
    .flatMap((model) =>
      (model.prices ?? [])
        .filter(
          (entry) =>
            entry &&
            entry.repair?.slug &&
            repairSlugs.includes(entry.repair.slug) &&
            typeof entry.price === "number",
        )
        .map((entry) => entry?.price as number),
    );

  return found.length > 0 ? Math.min(...found) : null;
}

export function buildPriceContext(sources: PriceSources): ServiceCtx {
  const flat = new Map(sources.flatServices.map((entry) => [entry.slug ?? "", entry]));
  const m = sources.models;

  const raw: Record<string, number | null> = {
    "phone-screen": cheapest(m, ["screen-replacement"]),
    "phone-battery": cheapest(m, ["battery-replacement"]),

    "iphone-screen": cheapest(m, ["screen-replacement"], "apple-iphone"),
    "iphone-battery": cheapest(m, ["battery-replacement"], "apple-iphone"),
    "iphone-port": cheapest(m, ["charging-port-repair"], "apple-iphone"),
    "iphone-camera": cheapest(m, ["back-camera-repair", "front-camera-repair"], "apple-iphone"),
    "iphone-back-glass": cheapest(
      m,
      ["back-glass-replacement", "back-housing-replacement"],
      "apple-iphone",
    ),

    "samsung-screen": cheapest(m, ["screen-replacement"], "samsung-galaxy"),
    "samsung-battery": cheapest(m, ["battery-replacement"], "samsung-galaxy"),
    "samsung-port": cheapest(m, ["charging-port-repair"], "samsung-galaxy"),
    "samsung-back-glass": cheapest(
      m,
      ["back-glass-replacement", "back-housing-replacement"],
      "samsung-galaxy",
    ),

    "ipad-glass": cheapest(m, ["glass-digitizer", "screen-replacement"], "apple-ipad"),

    "laptop-screen": flat.get("laptop-screen-replacement")?.price ?? null,
    "laptop-keyboard": flat.get("laptop-keyboard-replacement")?.price ?? null,
    "laptop-keyboard-max": flat.get("laptop-keyboard-replacement")?.priceTo ?? null,
    "laptop-dc": flat.get("dc-charging-port-replacement")?.price ?? null,

    diagnostics: flat.get("diagnostics")?.price ?? null,
    "windows-installation": flat.get("windows-installation")?.price ?? null,
    "tune-up": flat.get("tune-up")?.price ?? null,
    "program-installation": flat.get("program-installation")?.price ?? null,
    "hardware-installation": flat.get("hardware-installation")?.price ?? null,
    "virus-removal": flat.get("virus-removal")?.price ?? null,
    "password-reset": flat.get("password-reset")?.price ?? null,

    unlocking: sources.unlocking[0]?.price ?? null,
  };

  function price(key: string): string {
    // A range, where the catalogue carries both ends of one.
    if (key === "laptop-keyboard-range") {
      const from = raw["laptop-keyboard"];
      const to = raw["laptop-keyboard-max"];
      if (typeof from === "number" && typeof to === "number") {
        return `${formatPrice(from)} to ${formatPrice(to)}`;
      }
      return typeof from === "number" ? `from ${formatPrice(from)}` : NO_PRICE;
    }

    const value = raw[key];
    return typeof value === "number" ? (formatPrice(value) ?? NO_PRICE) : NO_PRICE;
  }

  return {
    warrantyDays: sources.warrantyDays,
    waitMinutes: sources.waitMinutes,
    price,
    has: (key: string) => typeof raw[key] === "number",
  };
}
