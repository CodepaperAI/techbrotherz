import "server-only";

import type { CoreFaqCtx } from "@/lib/content/core-faqs";
import { SITE } from "@/lib/site";
import {
  getAllPricedModels,
  getBrands,
  getRepairTypes,
  getSiteSettings,
  } from "@/lib/data";

/**
 * The counts and figures the core-page FAQs quote.
 *
 * Every number here is read from the content constants rather than written into
 * the copy, so
 * a model added in the Studio changes the sentence on the home page that says
 * how many models TechBrotherz repairs. The queries are the same ones the
 * pages already run, and Next dedupes them within a render.
 */
export async function getCoreFaqContext(): Promise<CoreFaqCtx> {
  const [settings, models, brands, repairTypes] = await Promise.all([
    getSiteSettings(),
    getAllPricedModels(),
    getBrands(),
    getRepairTypes(),
  ]);

  return {
    warrantyDays: settings?.warrantyDays ?? 60,
    waitMinutes: settings?.typicalWaitMinutes ?? 30,
    modelCount: models.length,
    brandCount: brands.length,
    repairTypeCount: repairTypes.length,
    phone: settings?.phone ?? SITE.phone,
    street: settings?.street ?? SITE.street,
    city: settings?.city ?? SITE.city,
    updatedAt: settings?._updatedAt,
  };
}
