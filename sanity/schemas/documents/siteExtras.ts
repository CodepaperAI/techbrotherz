import { defineField, defineType } from "sanity";
import { LinkIcon, MenuIcon, StarIcon } from "@sanity/icons";

/* ------------------------------------------------------------- navigation */

export const navigation = defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  icon: MenuIcon,
  description: "The links in the top menu and in the footer.",
  fields: [
    defineField({
      name: "header",
      title: "Top menu",
      type: "array",
      of: [
        {
          type: "object",
          name: "navLink",
          fields: [
            defineField({
              name: "label",
              title: "Link text",
              type: "string",
              description: 'What the customer reads. Always describe the page, never "click here".',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "href",
              title: "Page address",
              type: "string",
              description: "For example /repair-prices.",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        },
      ],
      validation: (Rule) => Rule.max(8).warning("More than 8 top menu links gets crowded."),
    }),
    defineField({
      name: "footerColumns",
      title: "Footer columns",
      type: "array",
      description:
        "The footer is what gives every important page a link from every other page, so keep all four columns full.",
      of: [
        {
          type: "object",
          name: "footerColumn",
          fields: [
            defineField({
              name: "heading",
              title: "Column heading",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "links",
              title: "Links",
              type: "array",
              of: [
                {
                  type: "object",
                  name: "navLink",
                  fields: [
                    defineField({ name: "label", title: "Link text", type: "string" }),
                    defineField({ name: "href", title: "Page address", type: "string" }),
                  ],
                  preview: { select: { title: "label", subtitle: "href" } },
                },
              ],
            }),
          ],
          preview: {
            select: { title: "heading", links: "links" },
            prepare: ({ title, links }) => ({
              title,
              subtitle: `${Array.isArray(links) ? links.length : 0} links`,
            }),
          },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Navigation" }) },
});

/* ---------------------------------------------------------- reviewSummary */

/**
 * Dormant by design.
 *
 * AggregateRating structured data is only emitted when `enabled` is true AND
 * every field below is filled in from a real Google Business Profile. Until the
 * client supplies verified numbers, the code path stays off and the site shows
 * no rating at all. Never invent a rating or a review count.
 * CLAUDE.md Section 3, rule 3.
 */
export const reviewSummary = defineType({
  name: "reviewSummary",
  title: "Review summary",
  type: "document",
  icon: StarIcon,
  description:
    "DO NOT ENABLE UNTIL YOU HAVE REAL NUMBERS. Ratings are only shown when every field here is filled in from your live Google Business Profile.",
  fields: [
    defineField({
      name: "enabled",
      title: "Show ratings on the site",
      type: "boolean",
      initialValue: false,
      description:
        "Leave off until the rating, the review count and the link below all come from your real Google Business Profile.",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (!value) return true;
          const doc = context.document as
            { ratingValue?: number; reviewCount?: number; sourceUrl?: string } | undefined;

          const missing: string[] = [];
          if (typeof doc?.ratingValue !== "number") missing.push("the rating");
          if (typeof doc?.reviewCount !== "number") missing.push("the number of reviews");
          if (!doc?.sourceUrl) missing.push("the link to your reviews");

          if (missing.length > 0) {
            return `Fill in ${missing.join(", ")} before turning this on. A rating is never shown unless it can be checked.`;
          }
          return true;
        }),
    }),
    defineField({
      name: "ratingValue",
      title: "Average rating",
      type: "number",
      description: "Copy the number from your Google Business Profile, for example 4.7.",
      validation: (Rule) => Rule.min(1).max(5).precision(1),
    }),
    defineField({
      name: "reviewCount",
      title: "Number of reviews",
      type: "number",
      validation: (Rule) => Rule.integer().positive(),
    }),
    defineField({
      name: "source",
      title: "Where the reviews are",
      type: "string",
      initialValue: "Google",
    }),
    defineField({
      name: "sourceUrl",
      title: "Link to your reviews",
      type: "url",
    }),
    defineField({
      name: "lastVerified",
      title: "Date you last checked",
      type: "date",
      description: "Update this whenever you refresh the numbers.",
    }),
  ],
  preview: {
    select: { rating: "ratingValue", count: "reviewCount", enabled: "enabled" },
    prepare: ({ rating, count, enabled }) => ({
      title: "Review summary",
      subtitle: enabled
        ? `${rating ?? "?"} from ${count ?? "?"} reviews, shown on the site`
        : "Off, no rating is shown anywhere",
    }),
  },
});

/* --------------------------------------------------------------- redirect */

export const redirect = defineType({
  name: "redirect",
  title: "Redirect",
  type: "document",
  icon: LinkIcon,
  description:
    "Sends an old web address to a new one, so links and search rankings from the previous site are not lost.",
  fields: [
    defineField({
      name: "from",
      title: "Old address",
      type: "string",
      description: "Starts with a slash, for example /iphone-repair-old.",
      validation: (Rule) =>
        Rule.required().custom((value) =>
          value?.startsWith("/") ? true : "Must start with a slash.",
        ),
    }),
    defineField({
      name: "to",
      title: "New address",
      type: "string",
      description: "Starts with a slash, for example /services/iphone-repair.",
      validation: (Rule) =>
        Rule.required().custom((value, context) => {
          const doc = context.document as { from?: string } | undefined;
          if (!value?.startsWith("/")) return "Must start with a slash.";
          if (doc?.from === value) return "The old and new addresses are the same.";
          return true;
        }),
    }),
    defineField({
      name: "permanent",
      title: "Permanent",
      type: "boolean",
      initialValue: true,
      description: "Leave on unless the move is genuinely temporary.",
    }),
  ],
  preview: {
    select: { title: "from", subtitle: "to", permanent: "permanent" },
    prepare: ({ title, subtitle, permanent }) => ({
      title,
      subtitle: `${permanent ? "301" : "302"} to ${subtitle ?? ""}`,
    }),
  },
});
