/**
 * Seeds the Sanity dataset from sanity/seed/*.json.
 *
 * Idempotent: every document has a deterministic _id and is written with
 * createOrReplace, so running the script twice produces an identical dataset.
 * Portable text keys are derived from the document id and the paragraph index
 * rather than randomly, which is what makes the second run a true no-op.
 *
 *   pnpm seed              import everything
 *   pnpm seed:reset        delete every seeded document first, with a prompt
 *
 * WARNING: because this uses createOrReplace, re-running it overwrites edits
 * made in the Studio to seeded documents. It is a setup tool, not a sync tool.
 *
 * Usage notes:
 *   --yes    skip the confirmation prompt on --reset
 *   --dry    build every document and report counts without writing
 */

import { readFileSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { createWriteClient } from "../sanity/lib/write-client";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SEED_DIR = join(__dirname, "..", "sanity", "seed");

const args = new Set(process.argv.slice(2));
const RESET = args.has("--reset");
const SKIP_PROMPT = args.has("--yes");
const DRY_RUN = args.has("--dry");

/* ----------------------------------------------------------------- helpers */

function readSeed<T>(file: string): T {
  return JSON.parse(readFileSync(join(SEED_DIR, file), "utf8")) as T;
}

/** Deterministic portable text, so a second run writes byte-identical data. */
function toPortableText(paragraphs: string[] | undefined, keyPrefix: string) {
  if (!paragraphs?.length) return undefined;

  return paragraphs.map((text, index) => ({
    _type: "block",
    _key: `${keyPrefix}-b${index}`,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `${keyPrefix}-s${index}`, text, marks: [] }],
  }));
}

function slugValue(current: string) {
  return { _type: "slug", current };
}

function ref(id: string) {
  return { _type: "reference", _ref: id };
}

function keyedRef(id: string) {
  return { _type: "reference", _ref: id, _key: id };
}

const brandId = (slug: string) => `brand.${slug}`;
const repairTypeId = (slug: string) => `repairType.${slug}`;
const modelId = (slug: string) => `model.${slug}`;
const priceId = (modelSlug: string, repairSlug: string) => `price.${modelSlug}.${repairSlug}`;
const priceGroupId = (slug: string) => `priceGroup.${slug}`;
const flatServiceId = (slug: string) => `flatService.${slug}`;
const locationId = (slug: string) => `location.${slug}`;
const faqId = (slug: string) => `faq.${slug}`;

/* ------------------------------------------------------------------- types */

interface SeedBrand {
  slug: string;
  name: string;
  type: string;
  order: number;
  intro?: string;
  seoTitle?: string;
  seoDescription?: string;
}

interface SeedRepairType {
  slug: string;
  name: string;
  order: number;
  icon?: string;
  estimatedMinutes: number;
  appliesTo: string[];
  shortDescription: string;
  longDescription: string;
  symptoms: string[];
}

interface SeedModel {
  slug: string;
  name: string;
  brand: string;
  deviceType: string;
  releaseYear?: number;
  popular?: boolean;
  aliases?: string[];
  commonIssues?: string[];
  intro?: string;
  published?: boolean;
}

/**
 * Per-model content, the thing that decides whether 84 model pages are 84
 * assets or 84 near-duplicates. Held in separate files from the model list
 * because it is prose, and prose is what has to differ.
 */
interface SeedModelContent {
  slug: string;
  intro?: string;
  commonIssues?: string[];
  verdict?: string;
  repairNotes?: string;
  lastSupportedOs?: string;
  stillReceivesUpdates?: boolean;
}

interface SeedModernFamily {
  key: string;
  brand: string;
  deviceType: string;
  familyIntro: string;
  commonIssues: string[];
  models: {
    slug: string;
    name: string;
    releaseYear: number;
    popular?: boolean;
    aliases?: string[];
  }[];
}

interface SeedPriceEntry {
  model: string;
  repair: string;
  price?: number;
  quoteOnly?: boolean;
  needsVerification?: boolean;
  note?: string;
  priceGroup?: string;
}

interface SeedPrices {
  groups: { slug: string; name: string; note?: string; models: string[] }[];
  entries: SeedPriceEntry[];
  groupedEntries: { group: string; prices: { repair: string; price: number }[] }[];
  quoteOnly: { models: string[]; repairs: string[] }[];
}

interface SeedFlatService {
  slug: string;
  name: string;
  price?: number;
  priceFrom?: boolean;
  priceTo?: number;
  quoteOnly?: boolean;
  category: string;
  order: number;
  turnaroundMinutes?: number;
  description?: string;
  includes?: string[];
  needsVerification?: boolean;
}

interface SeedUnlocking {
  _id: string;
  carrier: string;
  deviceType: string;
  price: number;
  turnaround?: string;
  notes?: string;
  order: number;
}

interface SeedLocation {
  slug: string;
  city: string;
  kind: string;
  parent?: string;
  province?: string;
  isPrimary?: boolean;
  order: number;
  published?: boolean;
  distanceKm?: number;
  driveTimeMinutes?: number;
  neighbourhoods?: string[];
  landmarks?: string[];
  commonRepairs?: string[];
  routeDescription?: string;
  transitDescription?: string;
  seoTitle?: string;
  seoDescription?: string;
}

interface SeedFaq {
  slug: string;
  question: string;
  category: string;
  featured?: boolean;
  order: number;
  plainAnswer: string;
  answerParagraphs: string[];
}

type SanityDoc = Record<string, unknown> & { _id: string; _type: string };

/* -------------------------------------------------------------- build docs */

function buildDocuments() {
  const stages: { label: string; docs: SanityDoc[] }[] = [];

  /* --- Stage 1: site singletons, brands, repair types (no references) --- */

  const siteSettings = readSeed<Record<string, unknown>>("siteSettings.json");

  const brands = readSeed<SeedBrand[]>("brands.json").map<SanityDoc>((brand) => ({
    _id: brandId(brand.slug),
    _type: "brand",
    name: brand.name,
    slug: slugValue(brand.slug),
    type: brand.type,
    order: brand.order,
    active: true,
    published: true,
    intro: toPortableText(brand.intro ? [brand.intro] : undefined, brandId(brand.slug)),
    seoTitle: brand.seoTitle,
    seoDescription: brand.seoDescription,
    noIndex: false,
  }));

  const repairTypes = readSeed<SeedRepairType[]>("repairTypes.json").map<SanityDoc>((repair) => ({
    _id: repairTypeId(repair.slug),
    _type: "repairType",
    name: repair.name,
    slug: slugValue(repair.slug),
    order: repair.order,
    icon: repair.icon,
    estimatedMinutes: repair.estimatedMinutes,
    appliesTo: repair.appliesTo,
    shortDescription: repair.shortDescription,
    longDescription: toPortableText([repair.longDescription], repairTypeId(repair.slug)),
    symptoms: repair.symptoms,
    published: true,
    noIndex: false,
  }));

  const flatServices = readSeed<SeedFlatService[]>("flatServices.json").map<SanityDoc>(
    (service) => ({
      _id: flatServiceId(service.slug),
      _type: "flatService",
      name: service.name,
      slug: slugValue(service.slug),
      price: service.price,
      priceFrom: service.priceFrom ?? false,
      priceTo: service.priceTo,
      quoteOnly: service.quoteOnly ?? false,
      category: service.category,
      order: service.order,
      turnaroundMinutes: service.turnaroundMinutes,
      description: service.description,
      includes: service.includes,
      needsVerification: service.needsVerification ?? false,
      published: true,
      noIndex: false,
    }),
  );

  const unlocking = readSeed<SeedUnlocking[]>("unlocking.json").map<SanityDoc>((entry) => ({
    _id: entry._id,
    _type: "unlockingService",
    carrier: entry.carrier,
    deviceType: entry.deviceType,
    price: entry.price,
    turnaround: entry.turnaround,
    notes: entry.notes,
    order: entry.order,
    published: true,
  }));

  const faqs = readSeed<SeedFaq[]>("faqs.json").map<SanityDoc>((faq) => ({
    _id: faqId(faq.slug),
    _type: "faq",
    question: faq.question,
    plainAnswer: faq.plainAnswer,
    answer: toPortableText(faq.answerParagraphs, faqId(faq.slug)),
    category: faq.category,
    featured: faq.featured ?? false,
    order: faq.order,
    published: true,
  }));

  /**
   * Dormant by design. No rating is emitted anywhere until the client supplies
   * verified Google review data and turns this on. CLAUDE.md Section 3, rule 3.
   */
  const reviewSummary: SanityDoc = {
    _id: "reviewSummary",
    _type: "reviewSummary",
    enabled: false,
    source: "Google",
  };

  stages.push({
    label: "site, brands, repairs, services, questions",
    docs: [
      { ...(siteSettings as SanityDoc) },
      reviewSummary,
      ...brands,
      ...repairTypes,
      ...flatServices,
      ...unlocking,
      ...faqs,
    ],
  });

  /* --- Stage 2: models, which reference brands ------------------------- */

  /**
   * Per-model prose, merged from the three content files. A model without an
   * entry here cannot be published, because the thin-content guard now requires
   * an introduction, three common issues and a verdict that are true of that
   * specific handset. A price is no longer enough, since every published model
   * generates its own indexable page.
   */
  const modelContent = new Map<string, SeedModelContent>();
  for (const file of [
    "models-content-apple.json",
    "models-content-android.json",
    "models-content-modern.json",
  ]) {
    for (const entry of readSeed<{ models: SeedModelContent[] }>(file).models) {
      modelContent.set(entry.slug, entry);
    }
  }

  /** Shared between the legacy and modern branches so the rules cannot diverge. */
  function contentFields(slug: string, introOverride?: string) {
    const content = modelContent.get(slug);
    const intro = introOverride ?? content?.intro;
    const id = modelId(slug);

    const publishable =
      Boolean(intro) && (content?.commonIssues?.length ?? 0) >= 3 && Boolean(content?.verdict);

    return {
      publishable,
      fields: {
        commonIssues: content?.commonIssues,
        intro: toPortableText(intro ? [intro] : undefined, `${id}-intro`),
        verdict: toPortableText(content?.verdict ? [content.verdict] : undefined, `${id}-verdict`),
        repairNotes: toPortableText(
          content?.repairNotes ? [content.repairNotes] : undefined,
          `${id}-notes`,
        ),
        lastSupportedOs: content?.lastSupportedOs,
        stillReceivesUpdates: content?.stillReceivesUpdates ?? false,
      },
    };
  }

  const legacyModels = readSeed<SeedModel[]>("models.json").map<SanityDoc>((model) => {
    const { publishable, fields } = contentFields(model.slug, model.intro);

    return {
      _id: modelId(model.slug),
      _type: "deviceModel",
      name: model.name,
      slug: slugValue(model.slug),
      brand: ref(brandId(model.brand)),
      deviceType: model.deviceType,
      releaseYear: model.releaseYear,
      popular: model.popular ?? false,
      discontinued: true,
      aliases: model.aliases,
      ...fields,
      published: publishable,
      noIndex: false,
    };
  });

  const modernSeed = readSeed<{
    quoteOnlyRepairs: string[];
    families: SeedModernFamily[];
  }>("models-modern.json");

  /**
   * The 30 modern models we publish, each with a hand-written introduction that
   * says something true about that specific model. A modern model is only
   * published once someone has written it one: a family-level intro that
   * differs only by model name is template spinning, and the thin-content guard
   * cannot detect that, so the rule is enforced by the seed instead.
   */
  const publishedIntros = new Map(
    readSeed<{ models: { slug: string; intro: string }[] }>(
      "models-modern-published.json",
    ).models.map((entry) => [entry.slug, entry.intro]),
  );

  const modernModels: SanityDoc[] = [];
  for (const family of modernSeed.families) {
    for (const model of family.models) {
      const handWritten = publishedIntros.get(model.slug);
      const { publishable, fields } = contentFields(model.slug, handWritten);

      modernModels.push({
        _id: modelId(model.slug),
        _type: "deviceModel",
        name: model.name,
        slug: slugValue(model.slug),
        brand: ref(brandId(family.brand)),
        deviceType: family.deviceType,
        releaseYear: model.releaseYear,
        popular: model.popular ?? false,
        discontinued: false,
        aliases: model.aliases,
        ...fields,
        // Family-level issues are the fallback for the models held back. They
        // never reach the live site, because a model without its own written
        // content cannot be published.
        commonIssues: fields.commonIssues ?? family.commonIssues,
        intro:
          fields.intro ??
          toPortableText(
            [family.familyIntro.replace(/\{name\}/g, model.name)],
            `${modelId(model.slug)}-intro`,
          ),
        published: publishable,
        noIndex: false,
      });
    }
  }

  const publishedModern = modernModels.filter((doc) => doc.published === true).length;
  const publishedLegacy = legacyModels.filter((doc) => doc.published === true).length;

  console.log(
    `\n  models: ${publishedLegacy} of ${legacyModels.length} legacy and ${publishedModern} of ${modernModels.length} modern have per-model content and will publish.`,
  );

  const unwritten = [...legacyModels, ...modernModels]
    .filter((doc) => doc.published !== true)
    .map((doc) => String(doc._id).replace("model.", ""));
  if (unwritten.length > 0) {
    console.log(`  held back for want of written content: ${unwritten.length}`);
  }

  stages.push({ label: "device models", docs: [...legacyModels, ...modernModels] });

  /* --- Stage 3: locations, which reference their parent city ----------- */

  const locationSeed = readSeed<SeedLocation[]>("locations.json");

  // Cities first so a neighbourhood's parent reference always resolves.
  const orderedLocations = [
    ...locationSeed.filter((entry) => !entry.parent),
    ...locationSeed.filter((entry) => entry.parent),
  ];

  const locations = orderedLocations.map<SanityDoc>((entry) => ({
    _id: locationId(entry.slug),
    _type: "location",
    city: entry.city,
    slug: slugValue(entry.slug),
    kind: entry.kind,
    province: entry.province ?? "Alberta",
    isPrimary: entry.isPrimary ?? false,
    parent: entry.parent ? ref(locationId(entry.parent)) : undefined,
    order: entry.order,
    distanceKm: entry.distanceKm,
    driveTimeMinutes: entry.driveTimeMinutes,
    neighbourhoods: entry.neighbourhoods,
    landmarks: entry.landmarks,
    commonRepairs: entry.commonRepairs,
    routeDescription: entry.routeDescription,
    transitDescription: entry.transitDescription,
    seoTitle: entry.seoTitle,
    seoDescription: entry.seoDescription,
    published: entry.published ?? false,
    noIndex: false,
  }));

  stages.push({ label: "locations", docs: locations });

  /* --- Stage 4: price groups, which reference models ------------------- */

  const prices = readSeed<SeedPrices>("prices.json");

  const priceGroups = prices.groups.map<SanityDoc>((group) => ({
    _id: priceGroupId(group.slug),
    _type: "priceGroup",
    name: group.name,
    note: group.note,
    models: group.models.map((slug) => keyedRef(modelId(slug))),
  }));

  stages.push({ label: "shared price groups", docs: priceGroups });

  /* --- Stage 5: prices, which reference models, repairs and groups ----- */

  const priceDocs = new Map<string, SanityDoc>();

  function addPrice(entry: SeedPriceEntry) {
    const id = priceId(entry.model, entry.repair);
    if (priceDocs.has(id)) {
      throw new Error(
        `Duplicate seed price for ${entry.model} / ${entry.repair}. The schema enforces one price per model and repair, so the seed data must too.`,
      );
    }

    priceDocs.set(id, {
      _id: id,
      _type: "priceEntry",
      model: ref(modelId(entry.model)),
      repairType: ref(repairTypeId(entry.repair)),
      price: entry.quoteOnly ? undefined : entry.price,
      quoteOnly: entry.quoteOnly ?? false,
      note: entry.note,
      needsVerification: entry.needsVerification ?? false,
      inStock: true,
      priceGroup: entry.priceGroup ? ref(priceGroupId(entry.priceGroup)) : undefined,
    });
  }

  for (const entry of prices.entries) addPrice(entry);

  // Rows printed once for several models become one entry per model, joined by
  // the shared price group. Shared pricing is not a reason to share a URL.
  for (const grouped of prices.groupedEntries) {
    const group = prices.groups.find((candidate) => candidate.slug === grouped.group);
    if (!group) throw new Error(`Unknown price group "${grouped.group}" in prices.json.`);

    for (const model of group.models) {
      for (const row of grouped.prices) {
        addPrice({
          model,
          repair: row.repair,
          price: row.price,
          priceGroup: group.slug,
        });
      }
    }
  }

  // "Call" rows on the printed list become explicit quote-only entries, so the
  // page shows "Call for quote" rather than an empty cell.
  for (const block of prices.quoteOnly) {
    for (const model of block.models) {
      for (const repair of block.repairs) {
        addPrice({ model, repair, quoteOnly: true });
      }
    }
  }

  // Modern models get quote-only rows for the repairs people actually ask about.
  for (const family of modernSeed.families) {
    for (const model of family.models) {
      for (const repair of modernSeed.quoteOnlyRepairs) {
        // Tablets have no rear glass to replace, so skip that row for them.
        if (family.deviceType === "tablet" && repair === "back-glass-replacement") continue;
        addPrice({ model: model.slug, repair, quoteOnly: true });
      }
    }
  }

  stages.push({ label: "prices", docs: [...priceDocs.values()] });

  return { stages, counts: countByType(stages) };
}

function countByType(stages: { docs: SanityDoc[] }[]) {
  const counts = new Map<string, number>();
  for (const stage of stages) {
    for (const doc of stage.docs) {
      counts.set(doc._type, (counts.get(doc._type) ?? 0) + 1);
    }
  }
  return counts;
}

/** Strip undefined so a replaced document never carries an explicit null. */
function clean(doc: SanityDoc): SanityDoc {
  return JSON.parse(JSON.stringify(doc)) as SanityDoc;
}

/* --------------------------------------------------------------------- run */

const SEEDED_TYPES = [
  "priceEntry",
  "priceGroup",
  "deviceModel",
  "brand",
  "repairType",
  "flatService",
  "unlockingService",
  "location",
  "faq",
  "reviewSummary",
  "siteSettings",
];

async function confirmReset(): Promise<boolean> {
  if (SKIP_PROMPT) return true;
  if (!process.stdin.isTTY) {
    console.error(
      "Refusing to reset without a terminal to confirm from. Re-run with --yes if you are certain.",
    );
    return false;
  }

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(
    `This deletes every seeded document in the "${process.env.NEXT_PUBLIC_SANITY_DATASET}" dataset. Type DELETE to continue: `,
  );
  rl.close();
  return answer.trim() === "DELETE";
}

async function main() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!projectId || !dataset) {
    throw new Error("Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET first.");
  }
  if (!token && !DRY_RUN) {
    throw new Error("SANITY_API_WRITE_TOKEN is required to write to the dataset.");
  }

  const { stages, counts } = buildDocuments();

  console.log(`\nTechBrotherz seed, project ${projectId}, dataset ${dataset}`);
  console.log("Documents to write:");
  for (const [type, count] of [...counts].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(count).padStart(4)}  ${type}`);
  }
  const total = [...counts.values()].reduce((sum, count) => sum + count, 0);
  console.log(`  ${String(total).padStart(4)}  total\n`);

  if (DRY_RUN) {
    console.log("Dry run, nothing written.");
    return;
  }

  const client = createWriteClient({
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  });

  if (RESET) {
    if (!(await confirmReset())) {
      console.log("Reset cancelled, nothing deleted.");
      return;
    }
    console.log("Deleting seeded documents...");
    // Delete prices before the models they point at, so no strong reference
    // is ever left dangling mid-delete.
    for (const type of SEEDED_TYPES) {
      await client.delete({ query: `*[_type == $type]`, params: { type } });
      console.log(`  cleared ${type}`);
    }
    console.log();
  }

  for (const stage of stages) {
    if (stage.docs.length === 0) continue;

    // Batched so one oversized transaction cannot fail the whole run.
    const BATCH = 50;
    for (let index = 0; index < stage.docs.length; index += BATCH) {
      const batch = stage.docs.slice(index, index + BATCH);
      const transaction = client.transaction();
      for (const doc of batch) transaction.createOrReplace(clean(doc));
      await transaction.commit({ visibility: "async" });
    }

    console.log(`  wrote ${String(stage.docs.length).padStart(4)}  ${stage.label}`);
  }

  console.log("\nSeed complete.\n");
}

main().catch((error) => {
  console.error("\nSeed failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
