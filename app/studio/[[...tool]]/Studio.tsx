"use client";

import { NextStudio } from "next-sanity/studio";

import config from "@/sanity.config";

/**
 * Client boundary for the Studio.
 *
 * sanity.config.ts pulls in the schema, the desk structure and the preview
 * pane, all of which call React.createContext at module scope. Importing it
 * from a server component puts those calls in the server bundle, where the RSC
 * build of React has no createContext, so the config is imported here instead.
 */
export function Studio() {
  return <NextStudio config={config} />;
}
