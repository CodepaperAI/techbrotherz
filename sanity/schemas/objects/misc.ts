import { defineField, defineType } from "sanity";

/** Latitude and longitude for the storefront, used by LocalBusiness schema. */
export const geoPoint = defineType({
  name: "geoPoint",
  title: "Map coordinates",
  type: "object",
  fields: [
    defineField({
      name: "lat",
      title: "Latitude",
      type: "number",
      validation: (Rule) => Rule.min(-90).max(90),
    }),
    defineField({
      name: "lng",
      title: "Longitude",
      type: "number",
      validation: (Rule) => Rule.min(-180).max(180),
    }),
  ],
});

export const socialLink = defineType({
  name: "socialLink",
  title: "Social link",
  type: "object",
  fields: [
    defineField({
      name: "platform",
      title: "Platform",
      type: "string",
      options: {
        list: ["Facebook", "Instagram", "X", "YouTube", "TikTok", "Google Business Profile"].map(
          (value) => ({ title: value, value }),
        ),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "Link",
      type: "url",
      validation: (Rule) => Rule.required().uri({ scheme: ["https"] }),
    }),
  ],
  preview: { select: { title: "platform", subtitle: "url" } },
});

export const announcementBar = defineType({
  name: "announcementBar",
  title: "Announcement bar",
  type: "object",
  description: "A thin strip across the top of every page. Use for holiday hours or a closure.",
  fields: [
    defineField({
      name: "active",
      title: "Show the bar",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "text",
      title: "Message",
      type: "string",
      description: "Keep it to one short sentence. No em dashes.",
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: "link",
      title: "Link (optional)",
      type: "string",
      description: "A page address on this site, for example /contact.",
    }),
  ],
});

export const howToStep = defineType({
  name: "howToStep",
  title: "Step",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Step title",
      type: "string",
      validation: (Rule) => Rule.required().max(90),
    }),
    defineField({
      name: "text",
      title: "What to do",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "image", title: "Photo", type: "image", options: { hotspot: true } }),
  ],
  preview: { select: { title: "name", subtitle: "text" } },
});

/** A repeatable process step shown on service pages. */
export const processStep = defineType({
  name: "processStep",
  title: "Process step",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Step title",
      type: "string",
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: "description",
      title: "Two lines of detail",
      type: "text",
      rows: 2,
      description: "Use a number rather than an adjective, for example about 30 minutes.",
      validation: (Rule) => Rule.required().max(220),
    }),
  ],
  preview: { select: { title: "title", subtitle: "description" } },
});

/**
 * Body copy. Deliberately restricted: no headings above H2 or below H3, and
 * tables are built by dedicated components rather than freehand, so the
 * question-shaped H2 rule and the real-table rule cannot be broken by an editor.
 */
export const richText = defineType({
  name: "richText",
  title: "Body",
  type: "array",
  of: [
    {
      type: "block",
      styles: [
        { title: "Paragraph", value: "normal" },
        { title: "Heading (question)", value: "h2" },
        { title: "Sub-heading", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              defineField({
                name: "href",
                title: "Address",
                type: "string",
                description:
                  "A page on this site such as /repair-prices, or a full https address for an outside source.",
                validation: (Rule) => Rule.required(),
              }),
              defineField({
                name: "isExternal",
                title: "Opens an outside website",
                type: "boolean",
                initialValue: false,
                description:
                  "Turn on when linking to a source such as Apple or the CRTC. Adds rel=noopener.",
              }),
            ],
          },
        ],
      },
    },
    { type: "image", options: { hotspot: true } },
  ],
});
