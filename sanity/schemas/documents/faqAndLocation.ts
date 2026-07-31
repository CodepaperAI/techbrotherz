import { defineField, defineType } from "sanity";
import { HelpCircleIcon, PinIcon } from "@sanity/icons";

import { CONTENT_GROUPS, publishedField, seoFields, slugField } from "../lib/fields";

// Long dash characters are banned in customer-facing copy. CLAUDE.md Section 3.
const LONG_DASH = /[—–]/;

const FAQ_CATEGORIES = [
  { title: "Pricing and payment", value: "pricing" },
  { title: "Warranty", value: "warranty" },
  { title: "Turnaround time", value: "turnaround" },
  { title: "Walk-in policy", value: "walkin" },
  { title: "Parts quality", value: "parts" },
  { title: "Data and privacy", value: "data" },
  { title: "Unlocking", value: "unlocking" },
  { title: "iPhone", value: "iphone" },
  { title: "Samsung", value: "samsung" },
  { title: "iPad and tablets", value: "ipad" },
  { title: "Laptops and computers", value: "computer" },
  { title: "Location and parking", value: "location" },
  { title: "Business services", value: "business" },
] as const;

/* ----------------------------------------------------------------------- faq */

export const faq = defineType({
  name: "faq",
  title: "Question",
  type: "document",
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      description:
        'Write it the way a customer would ask it out loud, for example "How much does an iPhone screen repair cost in Calgary?"',
      validation: (Rule) => Rule.required().max(140),
    }),

    /**
     * plainAnswer is what goes into FAQPage structured data, which cannot carry
     * formatting. The rich `answer` is what renders on the page. They must say
     * the same thing.
     */
    defineField({
      name: "plainAnswer",
      title: "Plain answer, for Google and AI assistants",
      type: "text",
      rows: 4,
      description:
        "The same answer as below but as plain text, no formatting and no links. This is the version Google and AI assistants read out. Maximum 320 characters, so make every word count. Use a number rather than an adjective.",
      validation: (Rule) =>
        Rule.required()
          .max(320)
          .custom((value) => {
            if (!value) return true;
            if (LONG_DASH.test(value)) {
              return "No long dashes. Use a comma, a colon or a full stop.";
            }
            return true;
          }),
    }),
    defineField({
      name: "answer",
      title: "Answer shown on the page",
      type: "richText",
      description:
        "The version customers read. It can include links to your other pages. It must say the same thing as the plain answer above.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: FAQ_CATEGORIES.map((c) => ({ ...c })) },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "appliesToServices",
      title: "Show on these services",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Service page slugs this question belongs on, for example iphone-repair. Leave empty for a question that suits any page.",
    }),
    defineField({
      name: "appliesToModels",
      title: "Show on these models",
      type: "array",
      of: [{ type: "reference", to: [{ type: "deviceModel" }] }],
    }),
    defineField({
      name: "appliesToLocations",
      title: "Show on these locations",
      type: "array",
      of: [{ type: "reference", to: [{ type: "location" }] }],
    }),
    defineField({
      name: "featured",
      title: "Site-wide question",
      type: "boolean",
      initialValue: false,
      description: "Featured questions can appear on the home page and the main questions page.",
    }),
    defineField({ name: "order", title: "Order", type: "number", initialValue: 100 }),
    publishedField({
      description: "Off means this question does not appear anywhere on the live site.",
      group: null,
    }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: {
      title: "question",
      subtitle: "plainAnswer",
      category: "category",
      published: "published",
    },
    prepare: ({ title, subtitle, category, published }) => ({
      title,
      subtitle: `${category ?? ""}${published ? "" : "  /  DRAFT"}  /  ${subtitle ?? ""}`,
    }),
  },
});

/* ------------------------------------------------------------------ location */

export const location = defineType({
  name: "location",
  title: "Location",
  type: "document",
  icon: PinIcon,
  groups: CONTENT_GROUPS,
  fields: [
    defineField({
      name: "city",
      title: "Place name",
      type: "string",
      description: 'A city such as "Airdrie", or a Calgary neighbourhood such as "Forest Lawn".',
      validation: (Rule) => Rule.required(),
    }),
    slugField("city"),
    defineField({
      name: "kind",
      title: "Kind of place",
      type: "string",
      group: "content",
      options: {
        list: [
          { title: "City", value: "city" },
          { title: "Calgary neighbourhood", value: "neighbourhood" },
        ],
      },
      initialValue: "neighbourhood",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "province",
      title: "Province",
      type: "string",
      group: "content",
      initialValue: "Alberta",
    }),
    defineField({
      name: "isPrimary",
      title: "This is where the shop is",
      type: "boolean",
      group: "content",
      initialValue: false,
    }),
    defineField({
      name: "neighbourhoods",
      title: "Nearby areas",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
      description: "Named areas people would say they are coming from.",
    }),
    defineField({
      name: "distanceKm",
      title: "Distance to the shop in km",
      type: "number",
      group: "content",
      description: "Real driving distance to 3317 17 Ave SE, not straight-line distance.",
      validation: (Rule) => Rule.positive(),
    }),
    defineField({
      name: "driveTimeMinutes",
      title: "Typical drive time in minutes",
      type: "number",
      group: "content",
      validation: (Rule) => Rule.integer().positive(),
    }),
    defineField({
      name: "landmarks",
      title: "Landmarks",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
      description:
        "Real places locals know. These make the page genuinely local rather than a template.",
    }),
    defineField({
      name: "routeDescription",
      title: "How to get here from there",
      type: "text",
      rows: 4,
      group: "content",
      description:
        "Real directions naming real roads. If you cannot write something specific and true, leave this page unpublished rather than filling it with generic text.",
    }),
    defineField({
      name: "transitDescription",
      title: "Getting here by transit",
      type: "text",
      rows: 3,
      group: "content",
      description: "Named routes and stops only. Leave empty if you are not sure.",
    }),
    defineField({
      name: "commonRepairs",
      title: "What locals bring in most",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "intro",
      title: "Introduction",
      type: "richText",
      group: "content",
    }),
    defineField({
      name: "mapEmbedUrl",
      title: "Map embed address",
      type: "url",
      group: "settings",
    }),
    defineField({
      name: "parent",
      title: "Parent city",
      type: "reference",
      group: "settings",
      to: [{ type: "location" }],
      description: "For a Calgary neighbourhood, set this to Calgary.",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      group: "settings",
      initialValue: 100,
    }),
    publishedField({
      description:
        "Off means this page is not on the live site. Do not publish a location page without real local detail: a real route, a real drive time and real landmarks.",
    }),
    ...seoFields(),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "city", kind: "kind", published: "published", drive: "driveTimeMinutes" },
    prepare: ({ title, kind, published, drive }) => ({
      title,
      subtitle: `${kind === "city" ? "City" : "Neighbourhood"}${drive ? `  /  ${drive} min drive` : ""}${published ? "" : "  /  DRAFT"}`,
    }),
  },
});
