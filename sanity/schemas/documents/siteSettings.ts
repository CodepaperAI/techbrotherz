import { CogIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

/**
 * The single source of truth for the business facts.
 *
 * NAP consistency is absolute: the name, address and phone here are the exact
 * strings that appear on every page, in every JSON-LD block and in llms.txt.
 * Changing one of them changes all of them. CLAUDE.md Section 2.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "business", title: "Business", default: true },
    { name: "contact", title: "Address and phone" },
    { name: "hours", title: "Hours and policies" },
    { name: "seo", title: "Search and AI" },
  ],
  fields: [
    defineField({
      name: "brandName",
      title: "Business name",
      type: "string",
      group: "business",
      description: "Must match your Google Business Profile exactly, character for character.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "legalName",
      title: "Legal name",
      type: "string",
      group: "business",
      description: "The registered name, if it differs from the business name.",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      group: "business",
      description: "One short line. No em dashes.",
    }),

    defineField({
      name: "street",
      title: "Street address",
      type: "string",
      group: "contact",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      group: "contact",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "region",
      title: "Province",
      type: "string",
      group: "contact",
      initialValue: "Alberta",
    }),
    defineField({
      name: "regionCode",
      title: "Province code",
      type: "string",
      group: "contact",
      initialValue: "AB",
    }),
    defineField({
      name: "postalCode",
      title: "Postal code",
      type: "string",
      group: "contact",
      description:
        "REQUIRED FOR LAUNCH. Needed for a complete address in Google's structured data and for directory listings. Leave empty rather than guessing.",
    }),
    defineField({
      name: "country",
      title: "Country",
      type: "string",
      group: "contact",
      initialValue: "Canada",
    }),
    defineField({
      name: "geo",
      title: "Map coordinates",
      type: "geoPoint",
      group: "contact",
      description:
        "REQUIRED FOR LAUNCH. Read them off your Google Business Profile. Left empty, the map coordinates are simply left out of the search data rather than sent as blanks.",
    }),
    defineField({
      name: "phone",
      title: "Phone, as displayed",
      type: "string",
      group: "contact",
      description: "Exactly as it should appear on the page, for example (403) 273-8324.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "phoneRaw",
      title: "Phone, international format",
      type: "string",
      group: "contact",
      description: "Used for tap-to-call links and search data. Format +14032738324.",
      validation: (Rule) =>
        Rule.required().regex(/^\+1\d{10}$/, {
          name: "E.164",
          invert: false,
        }),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "googleMapsUrl",
      title: "Google Maps link",
      type: "url",
      group: "contact",
    }),
    defineField({
      name: "googleBusinessUrl",
      title: "Google Business Profile link",
      type: "url",
      group: "contact",
      description: "REQUIRED FOR LAUNCH. Used for the reviews link and search data.",
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      group: "contact",
      of: [{ type: "socialLink" }],
    }),

    defineField({
      name: "hours",
      title: "Opening hours",
      type: "array",
      group: "hours",
      of: [{ type: "openingHours" }],
      description: "One row per day. These feed the footer, the contact page and Google.",
      validation: (Rule) => Rule.required().length(7),
    }),
    defineField({
      name: "warrantyDays",
      title: "Warranty length in days",
      type: "number",
      group: "hours",
      initialValue: 60,
      description:
        "Used everywhere the warranty is mentioned. Change it once, it changes site wide.",
      validation: (Rule) => Rule.required().integer().positive(),
    }),
    defineField({
      name: "appointmentPolicy",
      title: "Appointment policy",
      type: "string",
      group: "hours",
      initialValue: "No appointment needed, walk-ins welcome",
    }),
    defineField({
      name: "typicalWaitMinutes",
      title: "Typical wait in minutes",
      type: "number",
      group: "hours",
      initialValue: 30,
      description:
        "The honest typical wait on a common repair. Used as a number, never as a claim.",
      validation: (Rule) => Rule.required().integer().positive(),
    }),
    defineField({
      name: "priceDisclaimer",
      title: "Line shown under every price table",
      type: "string",
      group: "hours",
      initialValue:
        "All prices include the part and labour, and every repair is covered by a 60-day warranty.",
    }),
    defineField({
      name: "paymentAccepted",
      title: "Payment methods accepted",
      type: "array",
      group: "hours",
      of: [{ type: "string" }],
      options: {
        list: ["Cash", "Debit", "Visa", "Mastercard", "American Express", "Interac e-Transfer"].map(
          (value) => ({ title: value, value }),
        ),
      },
      description:
        "REQUIRED FOR LAUNCH. Left empty, payment methods are left out of the search data rather than guessed.",
    }),
    defineField({
      name: "foundedYear",
      title: "Year the shop opened",
      type: "number",
      group: "business",
      description:
        "REQUIRED FOR LAUNCH. Used on the About page and in author biographies. Left empty, we say nothing about how long you have traded rather than inventing a number.",
      validation: (Rule) => Rule.min(1980).max(new Date().getFullYear()),
    }),

    defineField({
      name: "defaultOgImage",
      title: "Default social share image",
      type: "image",
      group: "seo",
      options: { hotspot: true },
    }),
    defineField({
      name: "gaId",
      title: "Google Analytics measurement ID",
      type: "string",
      group: "seo",
      description: "Optional. Set through the hosting environment instead if you prefer.",
    }),
    defineField({
      name: "gscVerification",
      title: "Google Search Console verification code",
      type: "string",
      group: "seo",
    }),
    defineField({
      name: "announcementBar",
      title: "Announcement bar",
      type: "announcementBar",
      group: "seo",
    }),
  ],
  preview: {
    select: { title: "brandName", subtitle: "street" },
  },
});
