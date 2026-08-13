/**
 * The shared local facts, and the rule that stops them becoming boilerplate.
 *
 * Phase 5 established that any block repeated across many pages is a
 * duplication engine. The local tier is where that bites hardest, because the
 * best facts the site has are true of every page at once: there is one Store,
 * one street, one transit station.
 *
 * So each shared fact gets exactly one page that carries it in full, and every
 * other page that needs it gets a single sentence written for that page, plus
 * a link to the page that explains it. The sentences are authored per page
 * rather than templated, because a templated sentence repeated eleven times is
 * the thing we are avoiding.
 *
 * `pnpm audit:local-facts` reads this and reports which page carries what, so
 * the concentration rule is provable rather than asserted.
 */

export type FactId = "transitway" | "international-avenue" | "chestermere-road";

export type Treatment = "full" | "mention";

export interface SharedFact {
  id: FactId;
  label: string;
  /** The one page that explains this fact properly. */
  homePath: string;
  /** Why it is worth concentrating rather than repeating. */
  note: string;
}

export const SHARED_FACTS: Record<FactId, SharedFact> = {
  transitway: {
    id: "transitway",
    label: "33 Street SE Station and the 17 Avenue Transitway",
    homePath: "/locations/calgary",
    note: "The strongest local fact on the site. A MAX Purple station on a dedicated bus-only transitway at the door. Spread across eleven pages it reads as boilerplate; concentrated it reads as a reason to choose this Store.",
  },
  "international-avenue": {
    id: "international-avenue",
    label: "International Avenue, the BRZ and where the Store actually sits",
    homePath: "/locations/calgary",
    note: "Also the accuracy anchor: 33 Street SE, Albert Park/Radisson Heights to the north, Southview to the south. This is what the Google Business Profile gets reconciled against in Phase 9.",
  },
  "chestermere-road": {
    id: "chestermere-road",
    label: "17 Avenue SE continuing east as Chestermere Boulevard",
    homePath: "/locations/chestermere",
    note: "Chestermere's four facts are one strong fact stated four ways, so it gets one page in full and one sentence elsewhere.",
  },
};

/** How one page uses one shared fact. */
export interface FactUse {
  fact: FactId;
  treatment: Treatment;
  /**
   * The one-sentence form. Required for a mention, written for this page, and
   * never reused. Omitted where the page carries the fact in full.
   */
  sentence?: string;
}

/**
 * Guards the rule at render time, the way lib/faq/scoping.ts guards the FAQ
 * rule. A page that claims a full treatment of a fact it does not own, or a
 * mention with no sentence, fails the build rather than shipping.
 */
export function checkFactUse(path: string, uses: FactUse[]): FactUse[] {
  for (const use of uses) {
    const fact = SHARED_FACTS[use.fact];

    if (use.treatment === "full" && fact.homePath !== path) {
      throw new Error(
        `Local fact concentration violated on ${path}: it carries "${fact.label}" in full, ` +
          `but that fact belongs to ${fact.homePath}. Use a one-sentence mention and link there.`,
      );
    }

    if (use.treatment === "mention" && !use.sentence?.trim()) {
      throw new Error(
        `Local fact concentration violated on ${path}: a mention of "${fact.label}" needs a ` +
          `sentence written for this page. A shared sentence repeated across pages is the ` +
          `duplication this rule exists to prevent.`,
      );
    }
  }

  const seen = new Set<FactId>();
  for (const use of uses) {
    if (seen.has(use.fact)) {
      throw new Error(`Local fact ${use.fact} is used twice on ${path}.`);
    }
    seen.add(use.fact);
  }

  return uses;
}

/** Where a mention should link, so the reader can get the full version. */
export function factHref(id: FactId): string {
  return SHARED_FACTS[id].homePath;
}
