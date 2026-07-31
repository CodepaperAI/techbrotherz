import { defineField, defineType } from "sanity";
import { MobileDeviceIcon, TagIcon, WrenchIcon } from "@sanity/icons";

import {
  CONTENT_GROUPS,
  portableTextWordCount,
  publishedField,
  seoFields,
  slugField,
} from "../lib/fields";

const DEVICE_TYPES = [
  { title: "Phone", value: "phone" },
  { title: "Tablet", value: "tablet" },
  { title: "Laptop", value: "laptop" },
  { title: "Desktop", value: "desktop" },
] as const;

/* --------------------------------------------------------------------- brand */

export const brand = defineType({
  name: "brand",
  title: "Brand",
  type: "document",
  icon: TagIcon,
  groups: CONTENT_GROUPS,
  fields: [
    defineField({
      name: "name",
      title: "Brand name",
      type: "string",
      group: "content",
      description: 'As customers say it, for example "Apple iPhone" or "Samsung Galaxy".',
      validation: (Rule) => Rule.required(),
    }),
    slugField("name"),
    defineField({ name: "logo", title: "Logo", type: "image", group: "content" }),
    defineField({
      name: "type",
      title: "Kind of device",
      type: "string",
      group: "content",
      options: {
        list: [
          { title: "Phone", value: "phone" },
          { title: "Tablet", value: "tablet" },
          { title: "Computer", value: "computer" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Introduction",
      type: "richText",
      group: "content",
      description:
        "Two or three paragraphs shown at the top of the brand page. Name the shop, the city and a real price.",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      group: "settings",
      description: "Lower numbers show first in lists and menus.",
      initialValue: 100,
    }),
    defineField({
      name: "active",
      title: "Show on the site",
      type: "boolean",
      group: "settings",
      initialValue: true,
    }),
    publishedField(),
    ...seoFields(),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "name", subtitle: "type", media: "logo", published: "published" },
    prepare: ({ title, subtitle, media, published }) => ({
      title,
      subtitle: `${subtitle ?? ""}${published ? "" : "  /  DRAFT"}`,
      media,
    }),
  },
});

/* ---------------------------------------------------------------- repairType */

export const repairType = defineType({
  name: "repairType",
  title: "Repair type",
  type: "document",
  icon: WrenchIcon,
  groups: CONTENT_GROUPS,
  fields: [
    defineField({
      name: "name",
      title: "Repair name",
      type: "string",
      group: "content",
      description: 'What you would call it at the counter, for example "Screen / LCD replacement".',
      validation: (Rule) => Rule.required(),
    }),
    slugField("name"),
    defineField({
      name: "shortDescription",
      title: "One-line description",
      type: "string",
      group: "content",
      description: "Shown in lists and cards. One sentence.",
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: "longDescription",
      title: "Full description",
      type: "richText",
      group: "content",
      description: "What the repair involves and what is included. Two or three paragraphs.",
    }),
    defineField({
      name: "estimatedMinutes",
      title: "Typical time in minutes",
      type: "number",
      group: "content",
      description: "The honest typical time. Shown as, for example, About 30 minutes.",
      validation: (Rule) => Rule.integer().positive(),
    }),
    defineField({
      name: "appliesTo",
      title: "Applies to",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
      options: { list: DEVICE_TYPES.map((d) => ({ ...d })) },
      description: "Which kinds of device this repair can be done on.",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "symptoms",
      title: "Signs you need this repair",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
      description:
        "Real symptoms a customer would notice, for example: the screen shows lines or coloured patches. These are used on the page and in guides, so write them properly.",
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: "icon",
      title: "Icon name",
      type: "string",
      group: "settings",
      description: "A lucide-react icon name, for example smartphone or battery.",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      group: "settings",
      initialValue: 100,
      description: "Lower numbers appear higher in price tables. Screen repairs should be lowest.",
    }),
    publishedField(),
    ...seoFields(),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "name", subtitle: "shortDescription", published: "published" },
    prepare: ({ title, subtitle, published }) => ({
      title,
      subtitle: published ? subtitle : `DRAFT  /  ${subtitle ?? ""}`,
    }),
  },
});

/* --------------------------------------------------------------- deviceModel */

export const deviceModel = defineType({
  name: "deviceModel",
  title: "Device model",
  type: "document",
  icon: MobileDeviceIcon,
  groups: CONTENT_GROUPS,
  fields: [
    defineField({
      name: "name",
      title: "Model name",
      type: "string",
      group: "content",
      description: 'Exactly as customers say it, for example "iPhone 8 Plus" or "Galaxy S7 Edge".',
      validation: (Rule) => Rule.required(),
    }),
    slugField("name"),
    defineField({
      name: "brand",
      title: "Brand",
      type: "reference",
      group: "content",
      to: [{ type: "brand" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "deviceType",
      title: "Kind of device",
      type: "string",
      group: "content",
      options: { list: DEVICE_TYPES.map((d) => ({ ...d })) },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "releaseYear",
      title: "Year released",
      type: "number",
      group: "content",
      description: "Helps customers judge whether a repair is worth it, and orders related models.",
      validation: (Rule) => Rule.min(2005).max(new Date().getFullYear() + 1),
    }),
    defineField({ name: "image", title: "Photo", type: "image", group: "content" }),
    defineField({
      name: "aliases",
      title: "Other names customers use",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
      description:
        'Nicknames, shorthand and model numbers, for example "iphone 8+", "iphone8plus", "A1864". These power on-site search, the not-found page suggestions and internal linking. More is better.',
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: "commonIssues",
      title: "Common problems with this model",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
      description:
        "Real faults you see on this model. Three or more are needed before the page can be published without prices.",
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: "intro",
      title: "Introduction",
      type: "richText",
      group: "content",
      description:
        "Two paragraphs about repairing THIS model, not this kind of phone. Say something true about this handset specifically: what its screen is made of, what fails on it, what makes it cheaper or dearer to fix than the model beside it. Copying another model's introduction and changing the name is worse than leaving it empty, because Google treats near-identical pages as low quality and can hold back the whole site. 60 words or more, and the page cannot be published without prices until it has one.",
    }),
    defineField({
      name: "verdict",
      title: "Is this model still worth repairing?",
      type: "richText",
      group: "content",
      description:
        "An honest answer for THIS model, not this kind of phone. Weigh its age, the repair price against what the handset is worth now, and whether it still gets software updates. If the honest answer is no, say no. A page that tells someone not to spend money is the page they trust and quote. 40 words or more.",
    }),
    defineField({
      name: "repairNotes",
      title: "What is different about repairing this model",
      type: "richText",
      group: "content",
      description:
        "The repair facts that differ from the model beside it. Laminated or separate glass, whether the home button pairs to the logic board, whether Face ID survives a screen swap, whether the back glass is fused. Leave empty if there is genuinely nothing distinctive.",
    }),
    defineField({
      name: "lastSupportedOs",
      title: "Last operating system it can run",
      type: "string",
      group: "content",
      description:
        'For example "iOS 16" or "Android 11". Used in the worth-repairing verdict. Leave empty rather than guessing.',
    }),
    defineField({
      name: "stillReceivesUpdates",
      title: "Still receives software updates",
      type: "boolean",
      group: "content",
      description:
        "Turn off once the manufacturer has stopped shipping updates for this model. This drives the honest verdict on the page.",
      initialValue: false,
    }),
    defineField({
      name: "popular",
      title: "Popular model",
      type: "boolean",
      group: "settings",
      initialValue: false,
      description: "Popular models appear in the footer and in the models grid on service pages.",
    }),
    defineField({
      name: "discontinued",
      title: "No longer sold",
      type: "boolean",
      group: "settings",
      initialValue: false,
    }),

    /**
     * Thin-content guard.
     *
     * Raised in Phase 4. Until then a real price was enough, because a model
     * without its own page was only a row in a table. Now every published model
     * generates its own indexable page, so a price alone is no longer content:
     * three pages carrying identical prose and identical prices are a
     * duplicate-content problem we would be creating ourselves.
     *
     * Publishing therefore requires content that is true of THIS model:
     * a release year, three common problems, a 60 word introduction, and an
     * honest verdict on whether the model is still worth repairing.
     */
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      group: "settings",
      initialValue: false,
      description:
        "Off means the page is not on the live site. A model can only be published once it has a release year, three or more common problems, an introduction of 60 words or more, and a verdict of 40 words or more. Prices alone are not enough, because every published model now gets its own page.",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (!value) return true;

          const doc = context.document as
            | {
                releaseYear?: number;
                commonIssues?: string[];
                intro?: Parameters<typeof portableTextWordCount>[0];
                verdict?: Parameters<typeof portableTextWordCount>[0];
              }
            | undefined;

          const releaseYear = doc?.releaseYear;
          const issueCount = doc?.commonIssues?.length ?? 0;
          const introWords = portableTextWordCount(doc?.intro);
          const verdictWords = portableTextWordCount(doc?.verdict);

          const missing: string[] = [];
          if (!releaseYear) missing.push("a release year");
          if (issueCount < 3) missing.push(`three common problems (currently ${issueCount})`);
          if (introWords < 60) missing.push(`a 60 word introduction (currently ${introWords})`);
          if (verdictWords < 40) missing.push(`a 40 word verdict (currently ${verdictWords})`);

          if (missing.length === 0) return true;

          return `This model needs content of its own before its page can go live. Still missing: ${missing.join(", ")}. Copying another model's wording and changing the name does not count, because Google treats near-identical pages as low quality.`;
        }),
    }),
    ...seoFields(),
  ],
  orderings: [
    { title: "Name", name: "name", by: [{ field: "name", direction: "asc" }] },
    {
      title: "Newest first",
      name: "releaseYear",
      by: [{ field: "releaseYear", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      brandName: "brand.name",
      media: "image",
      published: "published",
      deviceType: "deviceType",
    },
    prepare: ({ title, brandName, media, published, deviceType }) => ({
      // "iPhone 8 Plus, Apple iPhone"
      title: `${title}${brandName ? `, ${brandName}` : ""}`,
      subtitle: `${deviceType ?? ""}${published ? "" : "  /  AWAITING PRICES"}`,
      media,
    }),
  },
});

/* ---------------------------------------------------------------- priceGroup */

export const priceGroup = defineType({
  name: "priceGroup",
  title: "Shared price group",
  type: "document",
  icon: TagIcon,
  description:
    "For families that share one printed price, such as iPhone 5, 5S and 5C. Each model still gets its own page, this just records that the price is shared.",
  fields: [
    defineField({
      name: "name",
      title: "Group name",
      type: "string",
      description: 'For example "iPhone 5, 5S and 5C".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "models",
      title: "Models in this group",
      type: "array",
      of: [{ type: "reference", to: [{ type: "deviceModel" }] }],
      validation: (Rule) => Rule.required().min(2).unique(),
    }),
    defineField({
      name: "note",
      title: "Note shown to customers",
      type: "string",
      description: 'For example "The iPhone 5, 5S and 5C share the same screen price."',
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "note" },
  },
});
