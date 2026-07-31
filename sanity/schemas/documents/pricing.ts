import { defineField, defineType } from "sanity";
import { CreditCardIcon, LockIcon, TagIcon } from "@sanity/icons";

import { CONTENT_GROUPS, publishedField, seoFields, slugField } from "../lib/fields";

const PART_GRADES = ["OEM", "Premium", "Standard", "Aftermarket"] as const;

/**
 * A price row must carry either a price or the quote-only switch, never both
 * and never neither, or the page would have nothing to put in the cell.
 *
 * This is checked on both fields rather than at the document root, because
 * field-level rules are what the Studio surfaces next to the input and what
 * `sanity documents validate` actually executes.
 */
function pricePairRule(doc: unknown): true | string {
  const entry = doc as { price?: number; quoteOnly?: boolean } | undefined;
  const hasPrice = typeof entry?.price === "number";
  const isQuoteOnly = entry?.quoteOnly === true;

  if (hasPrice && isQuoteOnly) {
    return 'This has both a price and "Quote in person" turned on. Pick one: either enter the price, or turn on quote in person.';
  }
  if (!hasPrice && !isQuoteOnly) {
    return 'Enter a price in CAD, or turn on "Quote in person". A price row can never be left blank, because the page would have nothing to show.';
  }
  return true;
}

const needsVerificationField = defineField({
  name: "needsVerification",
  title: "Needs checking",
  type: "boolean",
  initialValue: false,
  description:
    "Turn on when a price came from the old price list and has not been confirmed. Flagged prices still show on the site, they just appear in the Needs verification list here.",
});

/* ---------------------------------------------------------------- priceEntry */

export const priceEntry = defineType({
  name: "priceEntry",
  title: "Price",
  type: "document",
  icon: TagIcon,
  fieldsets: [{ name: "amount", title: "Price", options: { columns: 2 } }],
  fields: [
    defineField({
      name: "model",
      title: "Model",
      type: "reference",
      to: [{ type: "deviceModel" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "repairType",
      title: "Repair",
      type: "reference",
      to: [{ type: "repairType" }],
      description: "Each model can only have one price per repair.",
      validation: (Rule) =>
        Rule.required().custom(async (value, context) => {
          const doc = context.document as { _id?: string; model?: { _ref?: string } } | undefined;

          const modelRef = doc?.model?._ref;
          const repairRef = (value as { _ref?: string } | undefined)?._ref;
          if (!modelRef || !repairRef) return true;

          const id = (doc?._id ?? "").replace(/^drafts\./, "");
          const client = context.getClient({ apiVersion: "2024-10-01" });
          const duplicate = await client.fetch<string | null>(
            `*[_type == "priceEntry" && model._ref == $model && repairType._ref == $repair && !(_id in [$id, "drafts." + $id])][0]._id`,
            { model: modelRef, repair: repairRef, id },
          );

          return duplicate
            ? "There is already a price for this model and repair. Edit that one instead of adding a second."
            : true;
        }),
    }),
    defineField({
      name: "price",
      title: "Price in CAD",
      type: "number",
      fieldset: "amount",
      description: "Including the part and the labour. Leave empty if you quote in person.",
      validation: (Rule) =>
        Rule.positive()
          .precision(2)
          .custom((_value, context) => pricePairRule(context.document)),
    }),
    defineField({
      name: "quoteOnly",
      title: "Quote in person",
      type: "boolean",
      fieldset: "amount",
      initialValue: false,
      description:
        'Turn on when the price varies. The page shows "Call for quote" linked to your phone number, never a blank or a dash.',
      validation: (Rule) => Rule.custom((_value, context) => pricePairRule(context.document)),
    }),
    defineField({
      name: "partGrade",
      title: "Part grade",
      type: "string",
      options: { list: PART_GRADES.map((value) => ({ title: value, value })) },
      description:
        "Optional. Only set this when you know it. Left empty, part quality is left out of the page rather than claimed.",
    }),
    defineField({
      name: "turnaroundMinutes",
      title: "Time in minutes",
      type: "number",
      description: "Leave empty to use the typical time set on the repair type.",
      validation: (Rule) => Rule.integer().positive(),
    }),
    defineField({
      name: "warrantyDays",
      title: "Warranty in days",
      type: "number",
      description:
        "Leave empty to use the site-wide warranty from Site settings, currently 60 days. Only set this when a specific repair differs.",
      validation: (Rule) => Rule.integer().positive(),
    }),
    defineField({
      name: "inStock",
      title: "Part usually in stock",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "priceGroup",
      title: "Shared price group",
      type: "reference",
      to: [{ type: "priceGroup" }],
      description:
        "Optional. Set when this price is printed once for several models, so the page can say so.",
    }),
    defineField({
      name: "note",
      title: "Note",
      type: "string",
      description: 'A short qualifier, for example "Includes fitting the metal LCD shield".',
    }),
    needsVerificationField,
  ],

  preview: {
    select: {
      modelName: "model.name",
      repairName: "repairType.name",
      price: "price",
      quoteOnly: "quoteOnly",
      needsVerification: "needsVerification",
    },
    prepare: ({ modelName, repairName, price, quoteOnly, needsVerification }) => {
      const amount = quoteOnly
        ? "Call for quote"
        : typeof price === "number"
          ? `$${price.toFixed(2)}`
          : "No price set";

      return {
        title: `${modelName ?? "No model"}  /  ${repairName ?? "No repair"}`,
        subtitle: `${amount}${needsVerification ? "   NEEDS CHECKING" : ""}`,
      };
    },
  },
});

/* --------------------------------------------------------------- flatService */

export const flatService = defineType({
  name: "flatService",
  title: "Shop service",
  type: "document",
  icon: CreditCardIcon,
  description: "Computer and software services with a single price, not tied to a device model.",
  groups: CONTENT_GROUPS,
  fieldsets: [{ name: "amount", title: "Price", options: { columns: 3 } }],
  fields: [
    defineField({
      name: "name",
      title: "Service name",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    slugField("name"),
    defineField({
      name: "price",
      title: "Price in CAD",
      type: "number",
      group: "content",
      fieldset: "amount",
      validation: (Rule) =>
        Rule.positive()
          .precision(2)
          .custom((_value, context) => pricePairRule(context.document)),
    }),
    defineField({
      name: "priceFrom",
      title: 'Show as "from"',
      type: "boolean",
      group: "content",
      fieldset: "amount",
      initialValue: false,
      description: 'Shows as "from $120" when the final price depends on the part.',
    }),
    defineField({
      name: "priceTo",
      title: "Up to",
      type: "number",
      group: "content",
      fieldset: "amount",
      description: 'Set for a real range, shows as "$69.99 to $149.99".',
      validation: (Rule) =>
        Rule.positive()
          .precision(2)
          .custom((value, context) => {
            const parent = context.document as { price?: number } | undefined;
            if (value === undefined || value === null) return true;
            if (typeof parent?.price === "number" && value <= parent.price) {
              return "The upper price must be higher than the price.";
            }
            return true;
          }),
    }),
    defineField({
      name: "quoteOnly",
      title: "Quote in person",
      type: "boolean",
      group: "content",
      initialValue: false,
      validation: (Rule) => Rule.custom((_value, context) => pricePairRule(context.document)),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      group: "content",
      options: {
        list: [
          { title: "Computer", value: "computer" },
          { title: "Software", value: "software" },
          { title: "Other", value: "other" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      group: "content",
      description: "What the customer gets. One or two sentences, with a number in it.",
    }),
    defineField({
      name: "includes",
      title: "What is included",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
      description: 'For example "Microsoft Office", "Security software", "All drivers installed".',
    }),
    defineField({
      name: "turnaroundMinutes",
      title: "Time in minutes",
      type: "number",
      group: "content",
      validation: (Rule) => Rule.integer().positive(),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      group: "settings",
      initialValue: 100,
    }),
    { ...needsVerificationField, group: "settings" },
    publishedField(),
    ...seoFields(),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: {
      title: "name",
      price: "price",
      priceFrom: "priceFrom",
      priceTo: "priceTo",
      quoteOnly: "quoteOnly",
      needsVerification: "needsVerification",
    },
    prepare: ({ title, price, priceFrom, priceTo, quoteOnly, needsVerification }) => {
      let amount = "Call for quote";
      if (!quoteOnly && typeof price === "number") {
        amount = priceTo
          ? `$${price.toFixed(2)} to $${priceTo.toFixed(2)}`
          : `${priceFrom ? "from " : ""}$${price.toFixed(2)}`;
      }
      return {
        title,
        subtitle: `${amount}${needsVerification ? "   NEEDS CHECKING" : ""}`,
      };
    },
  },
});

/* ---------------------------------------------------------- unlockingService */

export const unlockingService = defineType({
  name: "unlockingService",
  title: "Unlocking",
  type: "document",
  icon: LockIcon,
  fields: [
    defineField({
      name: "carrier",
      title: "Carrier",
      type: "string",
      description: 'For example "Any Canadian carrier", "Rogers", "Telus".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "deviceType",
      title: "Kind of device",
      type: "string",
      options: {
        list: [
          { title: "Phone", value: "phone" },
          { title: "Tablet", value: "tablet" },
        ],
      },
      initialValue: "phone",
    }),
    defineField({
      name: "price",
      title: "Price in CAD",
      type: "number",
      validation: (Rule) => Rule.required().positive().precision(2),
    }),
    defineField({
      name: "turnaround",
      title: "How long it takes",
      type: "string",
      description: 'In plain words, for example "Usually the same day".',
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "text",
      rows: 3,
      description:
        "Anything a customer should know, for example that a blacklisted phone cannot be unlocked.",
    }),
    defineField({ name: "order", title: "Order", type: "number", initialValue: 100 }),
    publishedField({ group: null }),
  ],
  preview: {
    select: { title: "carrier", price: "price", turnaround: "turnaround" },
    prepare: ({ title, price, turnaround }) => ({
      title,
      subtitle: `$${typeof price === "number" ? price.toFixed(2) : "?"}${turnaround ? `  /  ${turnaround}` : ""}`,
    }),
  },
});
