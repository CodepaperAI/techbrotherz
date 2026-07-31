/**
 * The Tier 5 index.
 *
 * Ten pages: nine in Calgary and one for Chestermere. Split across three
 * modules for file size only. content/local-inventory.md records why the
 * planned seventeen became thirteen.
 */

import { LOCAL_PHONES } from "@/lib/content/local";
import { LOCAL_DEVICES } from "@/lib/content/local-devices";
import { LOCAL_OTHER } from "@/lib/content/local-other";
import type { LocalDef } from "@/lib/content/local";

export const LOCAL_PAGES: LocalDef[] = [...LOCAL_PHONES, ...LOCAL_DEVICES, ...LOCAL_OTHER];

const BY_SLUG = new Map(LOCAL_PAGES.map((entry) => [entry.slug, entry]));

export function localContent(slug: string): LocalDef | undefined {
  return BY_SLUG.get(slug);
}
