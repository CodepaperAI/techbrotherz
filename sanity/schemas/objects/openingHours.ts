import { defineField, defineType } from "sanity";

export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

export const openingHours = defineType({
  name: "openingHours",
  title: "Opening hours",
  type: "object",
  fields: [
    defineField({
      name: "day",
      title: "Day",
      type: "string",
      options: { list: DAYS.map((day) => ({ title: day, value: day })) },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "closed",
      title: "Closed all day",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "open",
      title: "Opens",
      type: "string",
      description: "24-hour time, for example 10:00.",
      hidden: ({ parent }) => Boolean(parent?.closed),
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { closed?: boolean } | undefined;
          if (parent?.closed) return true;
          if (!value) return "An opening time is required.";
          return TIME_PATTERN.test(value) ? true : "Use 24-hour time, for example 10:00.";
        }),
    }),
    defineField({
      name: "close",
      title: "Closes",
      type: "string",
      description: "24-hour time, for example 19:00 for 7pm.",
      hidden: ({ parent }) => Boolean(parent?.closed),
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { closed?: boolean; open?: string } | undefined;
          if (parent?.closed) return true;
          if (!value) return "A closing time is required.";
          if (!TIME_PATTERN.test(value)) return "Use 24-hour time, for example 19:00.";
          if (parent?.open && value <= parent.open) {
            return "The closing time must be later than the opening time.";
          }
          return true;
        }),
    }),
  ],
  preview: {
    select: { day: "day", open: "open", close: "close", closed: "closed" },
    prepare: ({ day, open, close, closed }) => ({
      title: day ?? "Day",
      subtitle: closed ? "Closed" : `${open ?? "?"} to ${close ?? "?"}`,
    }),
  },
});
