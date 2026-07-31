import {
  defineField,
  type ArrayRule,
  type FieldGroupDefinition,
  type PortableTextBlock,
  type SlugRule,
  type StringRule,
  type TextRule,
} from "sanity";

/**
 * Shared field builders, so the global field rules in the Phase 2 brief are
 * defined once and every public document obeys them automatically.
 *
 * Field descriptions are written for a shop owner, not a developer.
 *
 * Each builder takes an optional `group`. Types that declare CONTENT_GROUPS get
 * the sensible default. Small types with no tabs pass `group: null`, because
 * Sanity rejects a field that names a group the type has not declared.
 */

export const CONTENT_GROUPS: FieldGroupDefinition[] = [
  { name: "content", title: "Content", default: true },
  { name: "seo", title: "Search and AI" },
  { name: "settings", title: "Settings" },
];

type GroupOption = string | null;

interface FieldOptions {
  description?: string;
  group?: GroupOption;
}

/** Only set `group` when there is one, so ungrouped types stay valid. */
function withGroup<T extends Record<string, unknown>>(field: T, group: GroupOption) {
  return group ? { ...field, group } : field;
}

/** Lowercase, hyphenated, unique. This becomes the page address. */
export function slugField(source: string, options: FieldOptions = {}) {
  const { description, group = "settings" } = options;

  return defineField(
    withGroup(
      {
        name: "slug",
        title: "Web address",
        type: "slug" as const,
        description:
          description ??
          "The last part of the page address. Lowercase with hyphens, for example iphone-8-plus. Changing this after the page is live breaks existing links, so avoid it.",
        options: {
          source,
          maxLength: 96,
          slugify: (input: string) =>
            input
              .toLowerCase()
              .normalize("NFKD")
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "")
              .slice(0, 96),
        },
        validation: (Rule: SlugRule) =>
          Rule.required().custom((value) => {
            const current = value?.current;
            if (!current) return "A web address is required.";
            if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(current)) {
              return "Use lowercase letters, numbers and hyphens only, with no spaces.";
            }
            return true;
          }),
      },
      group,
    ),
  );
}

/** Title, description, social image, and the noindex switch. */
export function seoFields(options: { group?: GroupOption } = {}) {
  const { group = "seo" } = options;

  return [
    defineField(
      withGroup(
        {
          name: "seoTitle",
          title: "Search title",
          type: "string" as const,
          description:
            "The headline Google shows. Aim for 60 characters or fewer so it is not cut off. Include the device and Calgary where it reads naturally.",
          validation: (Rule: StringRule) =>
            Rule.max(60).warning("Over 60 characters, so Google will probably shorten this."),
        },
        group,
      ),
    ),
    defineField(
      withGroup(
        {
          name: "seoDescription",
          title: "Search description",
          type: "text" as const,
          rows: 3,
          description:
            "The two lines of text under the headline in Google. Aim for 155 characters or fewer. Say the price, the time and the warranty if they fit.",
          validation: (Rule: TextRule) =>
            Rule.max(155).warning("Over 155 characters, so Google will probably shorten this."),
        },
        group,
      ),
    ),
    defineField(
      withGroup(
        {
          name: "ogImage",
          title: "Social share image",
          type: "image" as const,
          description:
            "Shown when the page is shared on Facebook, X or in a text message. Leave empty to use the site default from Site settings.",
          options: { hotspot: true },
        },
        group,
      ),
    ),
    defineField(
      withGroup(
        {
          name: "noIndex",
          title: "Hide from Google",
          type: "boolean" as const,
          initialValue: false,
          description:
            "Turn on only if you want this page to exist but never appear in search results.",
        },
        group,
      ),
    ),
  ];
}

/** The publish switch. Nothing reaches the live site until this is on. */
export function publishedField(options: FieldOptions = {}) {
  const { description, group = "settings" } = options;

  return defineField(
    withGroup(
      {
        name: "published",
        title: "Published",
        type: "boolean" as const,
        initialValue: false,
        description:
          description ??
          "Off means the page is not on the live site. Turn on when the content is ready.",
      },
      group,
    ),
  );
}

/** A references array of FAQs, used by every page type that shows questions. */
export function faqsField(options: { group?: GroupOption } = {}) {
  const { group = "content" } = options;

  return defineField(
    withGroup(
      {
        name: "faqs",
        title: "Questions to show on this page",
        type: "array" as const,
        description:
          "Pick 6 to 10 questions. These also feed the question and answer box that Google and AI assistants read.",
        of: [{ type: "reference", to: [{ type: "faq" }] }],
        validation: (Rule: ArrayRule<unknown[]>) => Rule.unique().max(12),
      },
      group,
    ),
  );
}

/** Counts words across a portable text field, used by the thin-content guard. */
export function portableTextWordCount(blocks: PortableTextBlock[] | undefined): number {
  if (!Array.isArray(blocks)) return 0;

  return blocks.reduce((total, block) => {
    if (block?._type !== "block" || !Array.isArray(block.children)) return total;

    const text = block.children
      .map((child) => (typeof child?.text === "string" ? child.text : ""))
      .join(" ")
      .trim();

    return total + (text ? text.split(/\s+/).length : 0);
  }, 0);
}
