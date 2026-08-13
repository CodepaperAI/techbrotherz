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
 * list, that model's own repair timings and that model's age. A question whose
 * answer is "we do four repairs on the iPhone 8 Plus, from about 30 minutes to
 * about 60" is not shared text, it is this page's data written out.
 *
 * This is also what let Phase 5 remove the shared global answers from model
 * pages entirely rather than trimming them further.
 */

import type { PageFaq } from "@/lib/faq/scoping";

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
 * Every answer names the model and draws at least one detail from that model's
 * own record, so no two model pages produce the same text.
 */
export function modelFaqs(input: ModelFaqInput): PageFaq[] {
  /*
   * Phase 7a-ii: the price left, and with it the only thing that made two of
   * these four answers differ per model. They are re-grounded on what the
   * model's own record still holds: which repairs the Store does on it, how long
   * the shortest and longest of those take, its age, and its software support.
   * Those vary by model in the same way a price did, which is what keeps 84
   * model pages from carrying one identical FAQ answer and one identical
   * FAQPage node. See CLAUDE.md Section 8.8.
   */
  const withMinutes = input.prices.filter((entry) => typeof entry.minutes === "number");
  const quickest =
    withMinutes.length > 0 ? Math.min(...withMinutes.map((e) => e.minutes as number)) : null;
  const longest =
    withMinutes.length > 0 ? Math.max(...withMinutes.map((e) => e.minutes as number)) : null;

  const isTablet = input.deviceType === "tablet";
  const timing = isTablet
    ? "are usually ready the same day"
    : `take about ${input.waitMinutes} minutes while you wait`;

  const age = input.releaseYear ? input.currentYear - input.releaseYear : null;

  const faqs: PageFaq[] = [];

  /* 1. How a repair on this model is quoted, and what shapes the figure. */
  faqs.push({
    question: `How much does a ${input.name} repair cost in Calgary?`,
    answer:
      `A ${input.name} repair at TechBrotherz in Calgary is quoted at the counter, free of charge, ` +
      `before any work starts. ` +
      (input.prices.length > 0
        ? `TechBrotherz carries out ${input.prices.length} ${input.prices.length === 1 ? "repair" : "different repairs"} ` +
          `on the ${input.name}, and what each one comes to follows the part that model takes. `
        : "") +
      (quickest !== null && longest !== null && quickest !== longest
        ? `They range from about ${quickest} minutes of work to about ${longest} minutes. `
        : quickest !== null
          ? `Most take about ${quickest} minutes. `
          : "") +
      `Every quote covers the part and the labour together and carries a ${input.warrantyDays}-day ` +
      `warranty. Phone ${input.phone} with the model for a firm figure.`,
  });

  /* 2. The actual repair list for this model. */
  const repairNames = input.prices.map((entry) => entry.repairName.toLowerCase());
  if (repairNames.length > 0) {
    faqs.push({
      question: `What ${input.name} repairs does TechBrotherz do?`,
      answer:
        `TechBrotherz in Calgary carries out ${repairNames.length} ${repairNames.length === 1 ? "repair" : "different repairs"} ` +
        `on the ${input.name}: ${list(repairNames)}. ` +
        `Each one is quoted individually and includes the part and the labour in a single figure.`,
    });
  }

  /* 3. Timing, tied to this model's own repair durations. */
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
      softwareLine +
      ` Ask for the quote first and set it against what the ${input.name} is worth used, and against ` +
      `whether the repair buys another year or another month: on a device this age it is common for ` +
      `the battery and the ${isTablet ? "charging port" : "charging port and buttons"} to be near the ` +
      `end of their life at the same time.`,
  });

  return faqs;
}

export interface BrandFaqInput {
  brandName: string;
  modelCount: number;
  awaitingCount: number;
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
      `${input.brandName} repairs at TechBrotherz in Calgary are quoted per model at the counter, ` +
      `free of charge, before any work starts. ` +
      // Year spans went 2026-08 on the client's no-years instruction; the span
      // is stated as a duration rather than as release years.
      (input.oldestYear && input.newestYear && input.newestYear > input.oldestYear
        ? `The ${input.brandName} range TechBrotherz repairs spans ${input.newestYear - input.oldestYear} years of releases, and the figure follows the part a given model takes rather than a flat rate across the range. `
        : `The figure follows the part a given model takes rather than a flat rate across the range. `) +
      `Phone ${input.phone} with your model for a firm figure.`,
  });

  if (input.repairNames.length > 0) {
    faqs.push({
      question: `Which ${input.brandName} repairs does TechBrotherz carry out?`,
      answer: `TechBrotherz in Calgary carries out ${input.repairNames.length} kinds of repair across the ${input.brandName} range: ${list(input.repairNames.map((name) => name.toLowerCase()))}. Each is quoted per model, because the part is what drives the difference between an older handset and a current one.`,
    });
  }

  if (input.oldestYear && input.newestYear) {
    faqs.push({
      question: `Which ${input.brandName} models does TechBrotherz repair?`,
      answer:
        `TechBrotherz in Calgary repairs ${input.modelCount} ${input.brandName} models, from the oldest models still worth fixing to the newest in the catalogue. ` +
        (input.awaitingCount > 0
          ? `A further ${input.awaitingCount} ${input.awaitingCount === 1 ? "model is" : "models are"} repaired to order, quoted at the counter once the part is confirmed.`
          : `Every model in the range is quoted individually at the counter.`),
    });
  }

  faqs.push({
    question: `Do I need an appointment to get a ${input.brandName} device repaired?`,
    answer: `No. TechBrotherz at 3317 17 Ave SE in Calgary takes ${input.brandName} repairs as walk-ins during opening hours, and most phone repairs are finished in about ${input.waitMinutes} minutes at the counter. Every repair carries a ${input.warrantyDays}-day warranty on the part and the workmanship.`,
  });

  return faqs;
}
