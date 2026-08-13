/**
 * The Store-wide numbers the Tier 2, 3, 5 and 6 copy reads from.
 *
 * This used to build a price lookup: the copy modules asked for a figure by key
 * and a change in the catalogue moved every sentence that quoted it. Phase 8
 * removed every price from the site, and 7a-i rewrote all 183 sentences that
 * used one, so the price function has no callers and no data behind it.
 *
 * What survives is the warranty and the typical wait, which are the numbers the
 * copy still interpolates and the ones that must not be typed into prose.
 */

import type { ServiceCtx } from "@/lib/content/services";

export interface PriceSources {
  warrantyDays: number;
  waitMinutes: number;
}

export function buildPriceContext(sources: PriceSources): ServiceCtx {
  return {
    warrantyDays: sources.warrantyDays,
    waitMinutes: sources.waitMinutes,
  };
}
