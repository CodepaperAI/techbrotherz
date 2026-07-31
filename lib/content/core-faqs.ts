/**
 * Page-specific FAQs for the Tier 1 core pages.
 *
 * Before Phase 5 each of these pages filtered the site-wide FAQ set by
 * category and emitted the result as FAQPage structured data. The same
 * question and answer pair therefore appeared in the structured data of up to
 * six URLs at once, which asks Google to pick a canonical answer from six
 * identical candidates and gives it no reason to prefer any of them.
 *
 * Now the site-wide answers live in exactly one FAQPage graph, on /faq, and
 * every other page answers questions only it can answer, with its own numbers.
 * CLAUDE.md Section 8.8.
 */

import type { PageFaq } from "@/lib/faq/scoping";
import { formatPrice } from "@/lib/utils";

export interface CoreFaqCtx {
  warrantyDays: number;
  waitMinutes: number;
  /** Counts and figures read from Sanity at render time. */
  modelCount: number;
  brandCount: number;
  repairTypeCount: number;
  lowestPrice: number | null;
  highestPrice: number | null;
  unlockingPrice: number | null;
  diagnosticsPrice: number | null;
  phone: string;
  street: string;
  city: string;
  /** ISO date of the most recent catalogue change. */
  updatedAt?: string | null;
}

function updatedPhrase(iso?: string | null): string {
  if (!iso) return "The list is maintained in the shop's own system and updated as prices change.";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "The list is maintained in the shop's own system and updated as prices change.";
  }
  const formatted = date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return `This price list was last updated on ${formatted}.`;
}

export function homeFaqs(c: CoreFaqCtx): PageFaq[] {
  return [
    {
      question: "What does TechBrotherz repair in Calgary?",
      answer: `TechBrotherz at ${c.street} in ${c.city} repairs cell phones, iPads, Android and Windows tablets, laptops and desktop computers, and unlocks phones for any Canadian carrier. The published catalogue covers ${c.modelCount} device models across ${c.brandCount} brands, with ${c.repairTypeCount} kinds of repair.`,
    },
    {
      question: "How much do repairs at TechBrotherz cost?",
      answer:
        c.lowestPrice !== null && c.highestPrice !== null
          ? `Published repair prices at TechBrotherz in Calgary run from ${formatPrice(c.lowestPrice)} to ${formatPrice(c.highestPrice)} depending on the device and the repair, and every price includes the part and the labour together. Computer diagnostics cost ${formatPrice(c.diagnosticsPrice)} and come off the repair, and carrier unlocking is ${formatPrice(c.unlockingPrice)}.`
          : `TechBrotherz in Calgary publishes a price for every repair in its catalogue, with the part and the labour included together. Phone ${c.phone} with your device model for a firm figure.`,
    },
    {
      question: "Can TechBrotherz fix my phone the same day?",
      answer: `Most phone repairs at TechBrotherz in Calgary are finished in about ${c.waitMinutes} minutes at the counter while you wait, including screen and battery replacements on models with parts in stock. Tablet and computer work is usually same-day rather than while-you-wait. TechBrotherz will give you a realistic time before you leave the device.`,
    },
  ];
}

export function servicesFaqs(c: CoreFaqCtx): PageFaq[] {
  return [
    {
      question: "How many different repairs does TechBrotherz offer?",
      answer: `TechBrotherz in Calgary carries out ${c.repairTypeCount} kinds of device repair across phones, tablets and laptops, alongside flat-priced computer work: diagnostics at ${formatPrice(c.diagnosticsPrice)}, Windows installation, clean-ups, virus removal and password resets. Carrier unlocking is ${formatPrice(c.unlockingPrice)} for any Canadian carrier.`,
    },
    {
      question: "What is included in a TechBrotherz repair price?",
      answer: `Every repair price at TechBrotherz in Calgary covers four things: the replacement part, the labour to fit it, testing before the device is handed back, and a ${c.warrantyDays}-day warranty on both the part and the workmanship. There is no separate bench fee or diagnostic charge on a phone or tablet repair.`,
    },
    {
      question: "Which TechBrotherz service do I need for my device?",
      answer: `Choose by device: phone repair for handsets, tablet repair for iPads and Android tablets, laptop repair for screens, keyboards and charging sockets, and computer repair for desktops, Windows installation and tune-ups. If you are not sure, bring the device to ${c.street} in ${c.city} and TechBrotherz will diagnose it at the counter.`,
    },
  ];
}

export function pricesFaqs(c: CoreFaqCtx): PageFaq[] {
  return [
    {
      question: "How many devices does TechBrotherz publish repair prices for?",
      answer: `TechBrotherz in Calgary publishes repair prices for ${c.modelCount} device models across ${c.brandCount} brands, each listed with its own figures rather than a single blanket rate. Every published price includes the part and the labour together.`,
    },
    {
      question: "What is the cheapest repair on this price list?",
      answer:
        c.lowestPrice !== null
          ? `The lowest published repair price at TechBrotherz in Calgary is ${formatPrice(c.lowestPrice)}, and the highest is ${formatPrice(c.highestPrice)}. The spread is driven by what the replacement part costs, which is why an older handset is cheaper to repair than a current one.`
          : `TechBrotherz quotes repairs at the counter where no price is published, because the part is ordered in. Phone ${c.phone} with your model for a firm figure.`,
    },
    {
      question: "How current is this repair price list?",
      answer: `${updatedPhrase(c.updatedAt)} Prices on this page are read directly from the TechBrotherz catalogue rather than typed into the page, so a price change in the shop's system appears here without the page being rewritten.`,
    },
  ];
}

export function locationsFaqs(c: CoreFaqCtx): PageFaq[] {
  return [
    {
      question: "Which areas does TechBrotherz serve?",
      answer: `TechBrotherz repairs devices for customers across Calgary, Chestermere, Airdrie and the surrounding Alberta communities, from a single shop at ${c.street} in ${c.city}. There is no mail-in or callout service: repairs are carried out at the counter.`,
    },
    {
      question: "Does TechBrotherz have more than one location?",
      answer: `No. TechBrotherz operates one shop, at ${c.street} in ${c.city}, Alberta. Every repair is carried out there, which is why the same technicians see the device from diagnosis to hand-back. Phone ${c.phone} to check stock before travelling from outside Calgary.`,
    },
    {
      question: "Is it worth driving to TechBrotherz from Chestermere or Airdrie?",
      answer: `TechBrotherz is on 17 Avenue SE in Calgary, which is a direct route from Chestermere and reachable from Airdrie via Deerfoot Trail. Most phone repairs take about ${c.waitMinutes} minutes at the counter, so a single trip is usually enough. Phone ${c.phone} first to confirm the part for your model is in stock.`,
    },
  ];
}

export function aboutFaqs(c: CoreFaqCtx): PageFaq[] {
  return [
    {
      question: "What is TechBrotherz?",
      answer: `TechBrotherz is a walk-in cell phone, tablet and computer repair shop at ${c.street} in ${c.city}, Alberta. It repairs ${c.modelCount} published device models across ${c.brandCount} brands, unlocks phones for Canadian carriers, and carries out computer work at flat prices agreed before the job starts.`,
    },
    {
      question: "What does TechBrotherz not do?",
      answer: `TechBrotherz does not carry out board-level microsoldering, does not run a data recovery lab, and does not warranty repairs on water-damaged devices, because corrosion continues after a device is cleaned. TechBrotherz will say which of these applies at the counter rather than taking a repair it cannot stand behind.`,
    },
    {
      question: "How does TechBrotherz price its repairs?",
      answer: `TechBrotherz prices repairs per device model rather than at a flat rate, because the replacement part is the largest part of the cost and it differs sharply between an older handset and a current one. Published prices run from ${formatPrice(c.lowestPrice)} upward, and every one includes the part and the labour.`,
    },
  ];
}

export function contactFaqs(c: CoreFaqCtx): PageFaq[] {
  return [
    {
      question: "What is the fastest way to reach TechBrotherz?",
      answer: `Phone ${c.phone} during opening hours. That reaches the counter directly, which is the quickest way to confirm a price, check whether a part is in stock, or ask whether a repair is one TechBrotherz carries out. The contact form on this page reaches the same shop and is answered during opening hours.`,
    },
    {
      question: "What should I bring when I come in for a repair?",
      answer: `Bring the device and, for a laptop or desktop, its charger, because a failed adapter produces the same symptoms as a dead machine and takes two minutes to rule out. For a password reset, bring photo identification and proof the computer is yours. Knowing your device model helps, and TechBrotherz can identify it at the counter.`,
    },
    {
      question: "Can I get a price from TechBrotherz before coming in?",
      answer: `Yes. Published prices for ${c.modelCount} device models are on the TechBrotherz repair price list, and phoning ${c.phone} with your model gets a firm figure before you travel. Where a price is not published, the part is ordered in and TechBrotherz will quote it once the cost is known.`,
    },
  ];
}

export function warrantyFaqs(c: CoreFaqCtx): PageFaq[] {
  return [
    {
      question: `What does the TechBrotherz ${c.warrantyDays}-day warranty cover?`,
      answer: `The TechBrotherz warranty covers the replacement part fitted and the workmanship of the repair for ${c.warrantyDays} days. A screen that develops dead touch areas, a battery that will not hold the charge it should, or a charging port that comes loose are all covered. Bring the device back with the receipt.`,
    },
    {
      question: "What is not covered by the TechBrotherz warranty?",
      answer: `New accidental damage is not covered, because a device that has been dropped again is a fresh repair rather than a failure of the last one. Liquid damage after a repair is not covered, and repairs carried out on devices that already had water damage carry no warranty at all, because corrosion keeps spreading.`,
    },
    {
      question: "How do I make a warranty claim at TechBrotherz?",
      answer: `Bring the device and the receipt to ${c.street} in ${c.city} during opening hours. No appointment or claim form is needed. TechBrotherz will inspect the repair, and where the part or the workmanship has failed within ${c.warrantyDays} days it is put right at no charge.`,
    },
  ];
}
