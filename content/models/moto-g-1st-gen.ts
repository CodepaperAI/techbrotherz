/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "moto-g-1st-gen",
  "name": "Moto G (1st gen)",
  "intro": [
    {
      "_key": "model.moto-g-1st-gen-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.moto-g-1st-gen-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The first Moto G changed what a budget phone was allowed to be, shipping in 2013 with near-stock Android and prompt updates at a price nobody expected. It has a 4.5 inch screen, no memory card slot and mono sound, all of which the second generation fixed a year later."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked glass on the 4.5 inch display, the smallest of the three Moto G generations we repair",
    "No storage expansion, this generation having no microSD slot",
    "Battery worn, sealed on this model",
    "Micro USB port worn",
    "Swappable rear shell cracked at the clips"
  ],
  "verdict": [
    {
      "_key": "model.moto-g-1st-gen-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.moto-g-1st-gen-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "No. The first Moto G stopped at Android 5 and is now more than a decade old with no security updates. Its screen costs several times the handset's value. This is a phone with historical interest rather than a repair we would advise anyone to pay for."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.moto-g-1st-gen-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.moto-g-1st-gen-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The first-generation Moto G has a smaller 4.5 inch screen than the two generations that follow it and no memory card slot, so despite sharing a screen price with them its panel is a different and smaller part. It also takes interchangeable coloured back shells."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "lastSupportedOs": "Android 5",
  "stillReceivesUpdates": false
} as ModelContent;

export default content;
