import "server-only";

import type { CoreFaqCtx } from "@/lib/content/core-faqs";
import { SITE } from "@/lib/site";
import {
  getAllPricedModels,
  getBrands,
  getFlatServices,
  getRepairTypes,
  getSiteSettings,
  getUnlocking,
} from "@/sanity/queries";

/**
 * The counts and figures the core-page FAQs quote.
 *
 * Every number here is read from Sanity rather than written into the copy, so
 * a model added in the Studio changes the sentence on the home page that says
 * how many models TechBrotherz repairs. The queries are the same ones the
 * pages already run, and Next dedupes them within a render.
 */
export async function getCoreFaqContext(): Promise<CoreFaqCtx> {
  const [settings, models, brands, repairTypes, flatServices, unlocking] = await Promise.all([
    getSiteSettings(),
    getAllPricedModels(),
    getBrands(),
    getRepairTypes(),
    getFlatServices(),
    getUnlocking(),
  ]);

  const allPrices = models.flatMap((model) =>
    (model.prices ?? [])
      .map((entry) => entry.price)
      .filter((price): price is number => typeof price === "number"),
  );

  const flat = new Map(flatServices.map((entry) => [entry.slug ?? "", entry]));

  return {
    warrantyDays: settings?.warrantyDays ?? 60,
    waitMinutes: settings?.typicalWaitMinutes ?? 30,
    modelCount: models.length,
    brandCount: brands.length,
    repairTypeCount: repairTypes.length,
    lowestPrice: allPrices.length > 0 ? Math.min(...allPrices) : null,
    highestPrice: allPrices.length > 0 ? Math.max(...allPrices) : null,
    unlockingPrice: unlocking[0]?.price ?? null,
    diagnosticsPrice: flat.get("diagnostics")?.price ?? null,
    phone: settings?.phone ?? SITE.phone,
    street: settings?.street ?? SITE.street,
    city: settings?.city ?? SITE.city,
    updatedAt: settings?._updatedAt,
  };
}
