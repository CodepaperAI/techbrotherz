import { defineField, defineType } from "sanity";
import { BookIcon, DocumentTextIcon, StarIcon, UserIcon } from "@sanity/icons";

import { CONTENT_GROUPS, faqsField, publishedField, seoFields, slugField } from "../lib/fields";

// Long dash characters are banned in customer-facing copy. CLAUDE.md Section 3.
const LONG_DASH = /[—–]/;

/* -------------------------------------------------------------------- author */

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  icon: UserIcon,
  description:
    "Named authors are how Google and AI assistants judge whether a guide is written by someone who knows the trade. Only enter things that are true.",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    slugField("name", { group: null }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description: 'For example "Lead technician".',
    }),
    defineField({
      name: "bio",
      title: "Short biography",
      type: "text",
      rows: 4,
      description: "Two or three sentences. What they repair and how long they have done it.",
    }),
    defineField({ name: "photo", title: "Photo", type: "image", options: { hotspot: true } }),
    defineField({
      name: "credentials",
      title: "Credentials",
      type: "array",
      of: [{ type: "string" }],
      description:
        "REQUIRED FOR LAUNCH if any exist. Real certifications or manufacturer training only. Leave empty rather than inventing one.",
    }),
    defineField({
      name: "yearsExperience",
      title: "Years of experience",
      type: "number",
      description: "Leave empty rather than estimating.",
      validation: (Rule) => Rule.integer().positive().max(60),
    }),
    publishedField({ group: null }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "photo" } },
});

/* --------------------------------------------------------------------- guide */

export const guide = defineType({
  name: "guide",
  title: "Guide",
  type: "document",
  icon: BookIcon,
  groups: CONTENT_GROUPS,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      description: "Phrase it as the question a customer would ask.",
      validation: (Rule) => Rule.required(),
    }),
    slugField("title"),
    defineField({
      name: "excerpt",
      title: "Summary",
      type: "text",
      rows: 2,
      group: "content",
      description: "One or two sentences shown in the guides list.",
      validation: (Rule) => Rule.max(200),
    }),

    /**
     * The quick answer is what an answer engine lifts and quotes. 40 to 60 words
     * is the window where it is complete enough to stand alone and short enough
     * to be quoted whole.
     */
    defineField({
      name: "quickAnswer",
      title: "Quick answer",
      type: "text",
      rows: 4,
      group: "content",
      description:
        "40 to 60 words that fully answer the title on their own, naming TechBrotherz and Calgary. This is the part AI assistants quote, so put the price, the time and the warranty in it.",
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value) return true;
          const words = value.trim().split(/\s+/).length;
          if (words < 40)
            return `Currently ${words} words. Aim for 40 to 60 so it can stand alone.`;
          if (words > 60) {
            return `Currently ${words} words. Aim for 40 to 60 so it can be quoted whole.`;
          }
          if (LONG_DASH.test(value)) return "No long dashes. Use a comma or a full stop.";
          return true;
        }),
    }),
    defineField({
      name: "heroImage",
      title: "Main photo",
      type: "image",
      group: "content",
      options: { hotspot: true },
    }),
    defineField({
      name: "body",
      title: "Article",
      type: "richText",
      group: "content",
      description:
        "Minimum 1,200 words. Every heading should be a real question. Every paragraph should make sense on its own.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Written by",
      type: "reference",
      group: "content",
      to: [{ type: "author" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "First published",
      type: "datetime",
      group: "settings",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Last reviewed",
      type: "datetime",
      group: "settings",
      description: "Update this whenever you revise the article. It is shown on the page.",
    }),
    defineField({
      name: "schemaType",
      title: "Article kind",
      type: "string",
      group: "settings",
      options: {
        list: [
          { title: "Article", value: "Article" },
          { title: "Step by step guide", value: "HowTo" },
          { title: "Questions and answers", value: "FAQPage" },
        ],
      },
      initialValue: "Article",
    }),
    defineField({
      name: "howToSteps",
      title: "Steps",
      type: "array",
      group: "content",
      of: [{ type: "howToStep" }],
      hidden: ({ document }) => document?.schemaType !== "HowTo",
    }),
    defineField({
      name: "readingMinutes",
      title: "Reading time in minutes",
      type: "number",
      group: "settings",
      validation: (Rule) => Rule.integer().positive(),
    }),
    faqsField(),
    defineField({
      name: "relatedServices",
      title: "Related service pages",
      type: "array",
      group: "content",
      of: [{ type: "reference", to: [{ type: "servicePage" }] }],
      description: "At least two. Guides must link out to the pages that sell the repair.",
    }),
    defineField({
      name: "relatedModels",
      title: "Related models",
      type: "array",
      group: "content",
      of: [{ type: "reference", to: [{ type: "deviceModel" }] }],
    }),
    defineField({
      name: "relatedLocations",
      title: "Related locations",
      type: "array",
      group: "content",
      of: [{ type: "reference", to: [{ type: "location" }] }],
    }),
    defineField({
      name: "relatedGuides",
      title: "Related guides",
      type: "array",
      group: "content",
      of: [{ type: "reference", to: [{ type: "guide" }] }],
      description: "Two sibling guides.",
    }),
    publishedField(),
    ...seoFields(),
  ],
  orderings: [
    { title: "Newest", name: "publishedAt", by: [{ field: "publishedAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", author: "author.name", media: "heroImage", published: "published" },
    prepare: ({ title, author: authorName, media, published }) => ({
      title,
      subtitle: `${authorName ?? "No author"}${published ? "" : "  /  DRAFT"}`,
      media,
    }),
  },
});

/* --------------------------------------------------------------- servicePage */

export const servicePage = defineType({
  name: "servicePage",
  title: "Service page",
  type: "document",
  icon: DocumentTextIcon,
  groups: CONTENT_GROUPS,
  fields: [
    defineField({
      name: "title",
      title: "Page title",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    slugField("title", {
      description:
        "The last part of the page address. Service hubs live under /services/, so iphone-repair becomes /services/iphone-repair.",
    }),
    defineField({
      name: "serviceType",
      title: "Kind of service",
      type: "string",
      group: "content",
      options: {
        list: [
          "phone-repair",
          "iphone-repair",
          "samsung-repair",
          "ipad-repair",
          "tablet-repair",
          "laptop-repair",
          "computer-repair",
          "phone-unlocking",
          "password-reset",
          "virus-removal",
        ].map((value) => ({ title: value, value })),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "parentService",
      title: "Parent service",
      type: "reference",
      group: "settings",
      to: [{ type: "servicePage" }],
      description:
        "Set for a repair-type page, so /services/iphone-repair/screen-replacement knows its hub.",
    }),
    defineField({
      name: "quickAnswer",
      title: "Quick answer",
      type: "text",
      rows: 4,
      group: "content",
      description:
        "40 to 60 words directly under the heading, naming TechBrotherz and Calgary, with the price, the time and the warranty in it.",
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true;
          const words = value.trim().split(/\s+/).length;
          if (words < 40 || words > 60) return `Currently ${words} words. Aim for 40 to 60.`;
          return true;
        }),
    }),
    defineField({ name: "heroHeadline", title: "Main heading", type: "string", group: "content" }),
    defineField({
      name: "heroSubcopy",
      title: "Sub-heading",
      type: "text",
      rows: 3,
      group: "content",
    }),
    defineField({ name: "body", title: "Body", type: "richText", group: "content" }),
    defineField({
      name: "benefits",
      title: "What is included",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "processSteps",
      title: "How it works",
      type: "array",
      group: "content",
      of: [{ type: "processStep" }],
    }),
    faqsField(),
    defineField({
      name: "relatedModels",
      title: "Models to show",
      type: "array",
      group: "content",
      of: [{ type: "reference", to: [{ type: "deviceModel" }] }],
    }),
    defineField({
      name: "relatedGuides",
      title: "Related guides",
      type: "array",
      group: "content",
      of: [{ type: "reference", to: [{ type: "guide" }] }],
    }),
    defineField({
      name: "localPagePath",
      title: "Matching Calgary page",
      type: "string",
      group: "settings",
      description:
        "The place-based page this links to, for example /iphone-screen-repair-calgary. Keeps the two from competing for the same search.",
    }),
    publishedField(),
    ...seoFields(),
  ],
  preview: {
    select: { title: "title", subtitle: "serviceType", published: "published" },
    prepare: ({ title, subtitle, published }) => ({
      title,
      subtitle: `${subtitle ?? ""}${published ? "" : "  /  DRAFT"}`,
    }),
  },
});

/* --------------------------------------------------------------- testimonial */

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  icon: StarIcon,
  description:
    "Only real reviews a customer actually left. Nothing here is shown on the site unless Verified is on.",
  fields: [
    defineField({
      name: "name",
      title: "Customer name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "rating",
      title: "Rating out of 5",
      type: "number",
      validation: (Rule) => Rule.min(1).max(5),
    }),
    defineField({
      name: "text",
      title: "What they said",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "device", title: "Device repaired", type: "string" }),
    defineField({
      name: "source",
      title: "Where it came from",
      type: "string",
      options: {
        list: ["Google", "Facebook", "In person", "Email"].map((value) => ({
          title: value,
          value,
        })),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sourceUrl",
      title: "Link to the original review",
      type: "url",
      description: "Needed before a review can be marked verified.",
    }),
    defineField({ name: "date", title: "Date left", type: "date" }),
    defineField({
      name: "verified",
      title: "Verified",
      type: "boolean",
      initialValue: false,
      description:
        "Only turn this on for a review you can point to publicly. Unverified reviews never appear on the site.",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (!value) return true;
          const doc = context.document as { sourceUrl?: string } | undefined;
          if (!doc?.sourceUrl) {
            return "Add a link to the original review before marking it verified.";
          }
          return true;
        }),
    }),
  ],
  preview: {
    select: { title: "name", rating: "rating", source: "source", verified: "verified" },
    prepare: ({ title, rating, source, verified }) => ({
      title,
      subtitle: `${rating ?? "?"}/5  /  ${source ?? ""}${verified ? "" : "  /  NOT VERIFIED, hidden"}`,
    }),
  },
});
