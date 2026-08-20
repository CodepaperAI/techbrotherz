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

export interface CoreFaqCtx {
  warrantyDays: number;
  waitMinutes: number;
  /** Counts and figures read from Sanity at render time. */
  modelCount: number;
  brandCount: number;
  repairTypeCount: number;
  phone: string;
  street: string;
  city: string;
  /** ISO date of the most recent catalogue change. */
  updatedAt?: string | null;
}

/* pricesFaqs and updatedPhrase were removed 2026-08: /repair-prices 301s to
   /contact and nothing imported them, and dead copy describing a price list
   that no longer exists is a wrong page waiting to be re-wired. */

export function homeFaqs(c: CoreFaqCtx): PageFaq[] {
  return [
    {
      question: "What does TechBrotherz repair in Calgary?",
      answer: `TechBrotherz at ${c.street} in ${c.city} repairs cell phones, iPads, Android and Windows tablets, laptops and desktop computers, and unlocks phones for any Canadian carrier. The published catalogue covers ${c.modelCount} device models across ${c.brandCount} brands, with ${c.repairTypeCount} kinds of repair.`,
    },
    {
      question: "How much do repairs at TechBrotherz cost?",
      answer: `Every repair at TechBrotherz in Calgary is quoted at the Store, free of charge, before any work starts, and the quote covers the part and the labour together. What a repair costs depends on the part the device takes, which is why an older handset and a current one are not the same job. Phone ${c.phone} with your device model for a firm figure.`,
    },
    {
      question: "Can TechBrotherz fix my phone the same day?",
      answer: `Most phone repairs at TechBrotherz in Calgary are finished in about ${c.waitMinutes} minutes at the Store while you wait, including screen and battery replacements on models with parts in stock. Tablet and computer work is usually same-day rather than while-you-wait. TechBrotherz will give you a realistic time before you leave the device.`,
    },
  ];
}

export function servicesFaqs(c: CoreFaqCtx): PageFaq[] {
  return [
    {
      question: "How many different repairs does TechBrotherz offer?",
      answer: `TechBrotherz in Calgary carries out ${c.repairTypeCount} kinds of device repair across phones, tablets and laptops, alongside computer work quoted per job: diagnostics, Windows installation, clean-ups, virus removal and password resets. Carrier unlocking covers any Canadian carrier.`,
    },
    {
      question: "What is included in a TechBrotherz repair price?",
      answer: `Every repair price at TechBrotherz in Calgary covers four things: the replacement part, the labour to fit it, testing before the device is handed back, and a ${c.warrantyDays}-day warranty on both the part and the workmanship. There is no separate bench fee or diagnostic charge on a phone or tablet repair.`,
    },
    {
      question: "Which TechBrotherz service do I need for my device?",
      answer: `Choose by device: phone repair for handsets, tablet repair for iPads and Android tablets, laptop repair for screens, keyboards and charging sockets, and computer repair for desktops, Windows installation and tune-ups. If you are not sure, bring the device to ${c.street} in ${c.city} and TechBrotherz will diagnose it at the Store.`,
    },
  ];
}

export function locationsFaqs(c: CoreFaqCtx): PageFaq[] {
  return [
    {
      question: "Which areas does TechBrotherz serve?",
      answer: `TechBrotherz repairs devices for customers across Calgary, Chestermere, Airdrie and the surrounding Calgary communities, from a single store at ${c.street} in ${c.city}. There is no mail-in or callout service: repairs are carried out at the Store.`,
    },
    {
      question: "Does TechBrotherz have more than one location?",
      answer: `No. TechBrotherz operates one store, at ${c.street} in ${c.city}, Alberta. Every repair is carried out there, which is why the same technicians see the device from diagnosis to hand-back. Phone ${c.phone} to check stock before travelling from outside Calgary.`,
    },
    {
      question: "Is it worth driving to TechBrotherz from Chestermere or Airdrie?",
      answer: `TechBrotherz is on 17 Avenue SE in Calgary, which is a direct route from Chestermere and reachable from Airdrie via Deerfoot Trail. Most phone repairs take about ${c.waitMinutes} minutes at the Store, so a single trip is usually enough. Phone ${c.phone} first to confirm the part for your model is in stock.`,
    },
  ];
}

export function aboutFaqs(c: CoreFaqCtx): PageFaq[] {
  return [
    {
      question: "What is TechBrotherz?",
      answer: `TechBrotherz is a walk-in cell phone, tablet and computer repair store at ${c.street} in ${c.city}, Alberta. It repairs ${c.modelCount} published device models across ${c.brandCount} brands, unlocks phones for Canadian carriers, and carries out computer work at flat prices agreed before the job starts.`,
    },
    {
      question: "What does TechBrotherz not do?",
      answer: `TechBrotherz does not carry out board-level microsoldering, does not run a data recovery lab, and does not warranty repairs on water-damaged devices, because corrosion continues after a device is cleaned. TechBrotherz will say which of these applies at the Store rather than taking a repair it cannot stand behind.`,
    },
    {
      question: "How does TechBrotherz price its repairs?",
      answer: `TechBrotherz quotes repairs per device model rather than at a flat rate, because the replacement part is the largest part of the cost and it differs sharply between an older handset and a current one. Every quote includes the part and the labour, and it is given at the Store before any work starts.`,
    },
  ];
}

export function contactFaqs(c: CoreFaqCtx): PageFaq[] {
  return [
    {
      question: "What is the fastest way to reach TechBrotherz?",
      answer: `Phone ${c.phone} during opening hours. That reaches the Store directly, which is the quickest way to confirm a price, check whether a part is in stock, or ask whether a repair is one TechBrotherz carries out. The contact form on this page reaches the same store and is answered during opening hours.`,
    },
    {
      question: "What should I bring when I come in for a repair?",
      answer: `Bring the device and, for a laptop or desktop, its charger, because a failed adapter produces the same symptoms as a dead machine and takes two minutes to rule out. For a password reset, bring photo identification and proof the computer is yours. Knowing your device model helps, and TechBrotherz can identify it at the Store.`,
    },
    {
      question: "Can I get a price from TechBrotherz before coming in?",
      answer: `Yes. Phoning ${c.phone} with your exact model gets a firm figure before you travel, free of charge. For less common models the part is ordered in, and TechBrotherz quotes it once the cost is known, so the figure you agree to is one the store can stand behind.`,
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
