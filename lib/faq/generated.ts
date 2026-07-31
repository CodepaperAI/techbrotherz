/**
 * Page-specific FAQs generated from a page's own data.
 *
 * The FAQ scoping rule requires that at least half a page's questions are
 * unique to it, and there are 93 programmatic pages. Hand-writing four
 * questions for each is not the answer: the questions would be the same
 * questions, and the answers would drift out of sync with the prices.
 *
 * Generating them from the record instead produces answers that are genuinely
 * different per URL, because they carry that model's name, that model's repair
 * list, that model's prices and that model's age. A question whose answer is
 * "the iPhone 8 Plus screen is $109.99 and we also do the battery, charging
 * port and back camera" is not shared text, it is this page's data written out.
 *
 * This is also what let Phase 5 remove the shared global answers from model
 * pages entirely rather than trimming them further.
 */

import type { PageFaq } from "@/lib/faq/scoping";
import { formatPrice } from "@/lib/utils";

/** Joins a list into readable prose: "a, b and c". */
function list(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0] as string;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export interface ModelFaqInput {
  name: string;
  deviceType?: string | null;
  releaseYear?: number | null;
  brandName?: string | null;
  /** Current year, passed in so the function stays pure and testable. */
  currentYear: number;
  waitMinutes: number;
  warrantyDays: number;
  phone: string;
  stillReceivesUpdates?: boolean | null;
  lastSupportedOs?: string | null;
  prices: {
    repairName: string;
    price?: number | null;
    minutes?: number | null;
  }[];
}

/**
 * Four questions built from one model's own record.
 *
 * Every answer names the model and quotes at least one figure taken from that
 * model's data, so no two model pages produce the same text.
 */
export function modelFaqs(input: ModelFaqInput): PageFaq[] {
  const priced = input.prices.filter((entry) => typeof entry.price === "number");
  const cheapest = priced.length > 0 ? Math.min(...priced.map((e) => e.price as number)) : null;
  const cheapestEntry = priced.find((entry) => entry.price === cheapest);
  const quoted = input.prices.filter((entry) => typeof entry.price !== "number");

  const isTablet = input.deviceType === "tablet";
  const timing = isTablet
    ? "are usually ready the same day"
    : `take about ${input.waitMinutes} minutes while you wait`;

  const age = input.releaseYear ? input.currentYear - input.releaseYear : null;

  const faqs: PageFaq[] = [];

  /* 1. The headline price, or the honest absence of one. */
  faqs.push(
    cheapest !== null && cheapestEntry
      ? {
          question: `How much does a ${input.name} repair cost in Calgary?`,
          answer:
            `${input.name} repairs at TechBrotherz in Calgary start at ${formatPrice(cheapest)} for a ` +
            `${cheapestEntry.repairName.toLowerCase()}, including the part and the labour. ` +
            `TechBrotherz publishes ${priced.length} priced ${priced.length === 1 ? "repair" : "repairs"} ` +
            `for the ${input.name}, and every one carries a ${input.warrantyDays}-day warranty on the ` +
            `part and the workmanship.`,
        }
      : {
          question: `How much does a ${input.name} repair cost in Calgary?`,
          answer:
            `TechBrotherz quotes ${input.name} repairs at the counter rather than publishing a price, ` +
            `because the parts are ordered in and the cost depends on supply on the day. Phone ` +
            `${input.phone} with the model and TechBrotherz will give you a firm figure. Every repair ` +
            `includes the part and the labour and carries a ${input.warrantyDays}-day warranty.`,
        },
  );

  /* 2. The actual repair list for this model. */
  const repairNames = input.prices.map((entry) => entry.repairName.toLowerCase());
  if (repairNames.length > 0) {
    faqs.push({
      question: `What ${input.name} repairs does TechBrotherz do?`,
      answer:
        `TechBrotherz in Calgary carries out ${repairNames.length} ${repairNames.length === 1 ? "repair" : "different repairs"} ` +
        `on the ${input.name}: ${list(repairNames)}. ` +
        (quoted.length > 0 && priced.length > 0
          ? `${priced.length} of those carry a published price and ${quoted.length} are quoted at the counter.`
          : `Each one includes the part and the labour in a single price.`),
    });
  }

  /* 3. Timing, tied to this model's own repair durations. */
  const withMinutes = input.prices.filter((entry) => typeof entry.minutes === "number");
  const longest =
    withMinutes.length > 0 ? Math.max(...withMinutes.map((e) => e.minutes as number)) : null;

  faqs.push({
    question: `How long does a ${input.name} repair take?`,
    answer:
      `Most ${input.name} repairs at TechBrotherz in Calgary ${timing}, and no appointment is needed. ` +
      (longest !== null ? `The longest job on this model is around ${longest} minutes. ` : "") +
      `If the part for the ${input.name} is not in stock, TechBrotherz will tell you at the counter ` +
      `before you leave the device.`,
  });

  /* 4. Repair or replace, using this model's age and software status. */
  const softwareLine =
    input.stillReceivesUpdates === false
      ? `The ${input.name} no longer receives security updates${input.lastSupportedOs ? `, with ${input.lastSupportedOs} the last supported version` : ""}, so a repair buys a working device rather than a supported one.`
      : input.stillReceivesUpdates === true
        ? `The ${input.name} still receives security updates, which makes repairing it the straightforward choice.`
        : "";

  faqs.push({
    question: `Is it worth repairing a ${input.name}?`,
    answer:
      (age !== null
        ? `The ${input.name} is about ${age} ${age === 1 ? "year" : "years"} old. `
        : `The ${input.name} is an older model. `) +
      (cheapest !== null
        ? `With repairs from ${formatPrice(cheapest)}, it is worth repairing whenever the cost sits below roughly a third of what the ${input.name} is worth used. `
        : `Because the price is quoted rather than published, ask for the figure first and compare it against what the ${input.name} is worth used. `) +
      softwareLine,
  });

  return faqs;
}

export interface BrandFaqInput {
  brandName: string;
  modelCount: number;
  awaitingCount: number;
  lowest: number | null;
  highest: number | null;
  repairNames: string[];
  warrantyDays: number;
  waitMinutes: number;
  phone: string;
  oldestYear: number | null;
  newestYear: number | null;
}

/** Four questions built from one brand hub's own catalogue. */
export function brandFaqs(input: BrandFaqInput): PageFaq[] {
  const faqs: PageFaq[] = [];

  faqs.push({
    question: `How much does ${input.brandName} repair cost in Calgary?`,
    answer:
      input.lowest !== null && input.highest !== null && input.lowest !== input.highest
        ? `${input.brandName} repairs at TechBrotherz in Calgary run from ${formatPrice(input.lowest)} to ${formatPrice(input.highest)} depending on the model, and every price includes the part and the labour. TechBrotherz publishes prices for ${input.modelCount} ${input.brandName} models, each listed individually.`
        : input.lowest !== null
          ? `${input.brandName} repairs at TechBrotherz in Calgary start at ${formatPrice(input.lowest)}, including the part and the labour, across ${input.modelCount} published models.`
          : `${input.brandName} repairs at TechBrotherz in Calgary are quoted at the counter, because the parts are ordered in. Phone ${input.phone} with your model for a firm figure.`,
  });

  if (input.repairNames.length > 0) {
    faqs.push({
      question: `Which ${input.brandName} repairs does TechBrotherz carry out?`,
      answer: `TechBrotherz in Calgary carries out ${input.repairNames.length} kinds of repair across the ${input.brandName} range: ${list(input.repairNames.map((name) => name.toLowerCase()))}. Each is priced per model, because the part cost is what drives the difference between an older handset and a current one.`,
    });
  }

  if (input.oldestYear && input.newestYear) {
    faqs.push({
      question: `Which ${input.brandName} models does TechBrotherz repair?`,
      answer:
        `TechBrotherz in Calgary repairs ${input.modelCount} ${input.brandName} models with published prices, spanning releases from ${input.oldestYear} to ${input.newestYear}. ` +
        (input.awaitingCount > 0
          ? `A further ${input.awaitingCount} ${input.awaitingCount === 1 ? "model is" : "models are"} repaired without a published price, quoted at the counter instead.`
          : `Every model in the range carries its own published price list.`),
    });
  }

  faqs.push({
    question: `Do I need an appointment to get a ${input.brandName} device repaired?`,
    answer: `No. TechBrotherz at 3317 17 Ave SE in Calgary takes ${input.brandName} repairs as walk-ins during opening hours, and most phone repairs are finished in about ${input.waitMinutes} minutes at the counter. Every repair carries a ${input.warrantyDays}-day warranty on the part and the workmanship.`,
  });

  return faqs;
}
