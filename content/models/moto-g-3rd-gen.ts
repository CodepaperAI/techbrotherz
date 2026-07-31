/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "moto-g-3rd-gen",
  "name": "Moto G (3rd gen)",
  "intro": [
    {
      "_key": "model.moto-g-3rd-gen-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.moto-g-3rd-gen-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The third-generation Moto G was the first in the range with a proper IP67 water resistance rating, which no budget phone of 2015 offered. It also introduced the customisable Moto Maker colours. It shares a $110 screen price with the two Moto G generations before it, but not their construction."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked glass on the 5 inch display",
    "Water resistance lost after opening, this being the first Moto G rated IP67",
    "Battery worn, sealed on this generation",
    "Micro USB port worn",
    "Rear cover clips broken from removal"
  ],
  "verdict": [
    {
      "_key": "model.moto-g-3rd-gen-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.moto-g-3rd-gen-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "No, other than as a spare. The third-generation Moto G stopped at Android 6. At $110 the screen costs more than the phone is worth. If you need a working spare and already own it, the repair is cheap enough to consider, but do not expect the water resistance back."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.moto-g-3rd-gen-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.moto-g-3rd-gen-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The third-generation Moto G is the only one of the three sharing its price that carries an IP67 rating, and that rating depends on seals destroyed when the phone is opened. TechBrotherz will tell you the phone is no longer water resistant after a repair rather than let you assume it still is."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "lastSupportedOs": "Android 6",
  "stillReceivesUpdates": false
} as ModelContent;

export default content;
