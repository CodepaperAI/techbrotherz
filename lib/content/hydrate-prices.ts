import { priceGroupFor, repairType, type RepairTypeDef } from "@/lib/content/repair-types";

/**
 * Rebuilds the old `prices` shape from a model's inline `repairs` array.
 *
 * Before Phase 6.9 a price was a document reached through two references, and
 * GROQ returned the repair's name, description, estimated minutes and sort
 * order joined in. Now the array holds a repair slug and, where one exists, a
 * number. Everything else lives in lib/content/repair-types.ts.
 *
 * This is the join, done in TypeScript. It exists so that pages consume the
 * exact shape they always did: the refactor is a move, and a move that changes
 * every consumer is a rewrite wearing a disguise.
 *
 * An entry with no `price` is a quoted repair. That is how the store has always
 * described them and how the page has always rendered them; the difference is
 * that an absent price is now an absent field rather than 531 documents.
 */

export interface RawRepair {
  repair?: string | null;
  partGrade?: string | null;
  turnaroundMinutes?: number | null;
  warrantyDays?: number | null;
  inStock?: boolean | null;
  note?: string | null;
  needsVerification?: boolean | null;
}

/** The shape every price table, Offer builder and model page already expects. */
export interface HydratedPrice {
  /**
   * A stable synthetic id. There is no price document to carry one now, and
   * pages use it as a React key, so it is derived from the model and repair
   * slugs, which are unique together by construction.
   */
  _id: string;
  partGrade: string | null;
  turnaroundMinutes: number | null;
  warrantyDays: number | null;
  inStock: boolean | null;
  note: string | null;
  needsVerification: boolean | null;
  repair: {
    name: string;
    slug: string;
    shortDescription: string | null;
    estimatedMinutes: number | null;
    order: number;
  } | null;
  sharedWith: { name: string; note: string | null } | null;
}

function repairFacet(def: RepairTypeDef | undefined) {
  if (!def) return null;
  return {
    name: def.name,
    slug: def.slug as string,
    shortDescription: def.shortDescription ?? null,
    estimatedMinutes: def.estimatedMinutes ?? null,
    order: def.order,
  };
}

/**
 * Hydrates and sorts one model's repairs.
 *
 * Ordering used to be `order(repairType->order asc, repairType->name asc)` in
 * GROQ. The field it sorted on is a code constant now, so the sort moved here
 * and reproduces the same sequence: screen first, battery second, then the
 * rest by their seeded order.
 */
export function hydrateRepairs(
  raw: readonly (RawRepair | null)[] | null | undefined,
  modelSlug?: string | null,
): HydratedPrice[] {
  const shared = modelSlug ? priceGroupFor(modelSlug) : undefined;

  return (raw ?? [])
    .filter((entry): entry is RawRepair => Boolean(entry?.repair))
    .map((entry) => {
      const def = repairType(entry.repair as string);
      return {
        _id: `price.${modelSlug ?? "model"}.${entry.repair}`,
        partGrade: entry.partGrade ?? null,
        turnaroundMinutes: entry.turnaroundMinutes ?? null,
        warrantyDays: entry.warrantyDays ?? null,
        inStock: entry.inStock ?? null,
        note: entry.note ?? null,
        needsVerification: entry.needsVerification ?? null,
        repair: repairFacet(def),
        sharedWith: shared ? { name: shared.name, note: shared.note ?? null } : null,
      } satisfies HydratedPrice;
    })
    .sort((a, b) => {
      const orderA = a.repair?.order ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.repair?.order ?? Number.MAX_SAFE_INTEGER;
      if (orderA !== orderB) return orderA - orderB;
      return (a.repair?.name ?? "").localeCompare(b.repair?.name ?? "");
    });
}


