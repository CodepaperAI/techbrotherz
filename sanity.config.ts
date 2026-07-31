import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { addStandardRepairsAction } from "./sanity/actions/addStandardRepairs";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { SINGLETON_TYPES, schemaTypes } from "./sanity/schemas";
import { defaultDocumentNode, structure } from "./sanity/structure";

/** Actions that make no sense on a document that exists exactly once. */
const SINGLETON_DISALLOWED_ACTIONS = new Set(["duplicate", "delete", "unpublish"]);

export default defineConfig({
  name: "techbrotherz",
  title: "TechBrotherz",
  basePath: "/studio",

  projectId,
  dataset,

  plugins: [
    structureTool({ structure, defaultDocumentNode }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],

  schema: {
    types: schemaTypes,
    // Singletons are reached through the Site group, never created from scratch.
    templates: (prev) => prev.filter((template) => !SINGLETON_TYPES.has(template.schemaType)),
  },

  document: {
    actions: (prev, context) => {
      let actions = prev;

      if (SINGLETON_TYPES.has(context.schemaType)) {
        actions = actions.filter(
          (action) => !SINGLETON_DISALLOWED_ACTIONS.has(String(action.action)),
        );
      }

      // The biggest time-saver for the shop owner. See the action for why the
      // rows it creates default to "quote in person".
      if (context.schemaType === "deviceModel") {
        actions = [...actions, addStandardRepairsAction];
      }

      return actions;
    },

    // Singletons never appear in the global "new document" menu.
    newDocumentOptions: (prev) =>
      prev.filter((item) => !SINGLETON_TYPES.has(item.templateId ?? "")),
  },
});
