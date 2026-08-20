/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "Ipad-4",
  "name": "Ipad 4",
  "intro": [
    {
      "_key": "model.Ipad-4-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.Ipad-4-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Ipad 4 was a mid-cycle refresh released only seven months after the Ipad 3, and it was the first full-size Ipad with a Lightning connector rather than the 30-pin dock. It shares its glass price with the Ipad 2 and 3, but not its port, and that difference catches people out when they bring the wrong cable."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked front glass with the display underneath undamaged",
    "Lightning port worn, this being the first full-size Ipad to use it",
    "Battery no longer holding a useful charge",
    "Home button unresponsive",
    "Touch dead in one area after a drop"
  ],
  "verdict": [
    {
      "_key": "model.Ipad-4-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.Ipad-4-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Marginal. The Ipad 4 stopped at IpadOS 10 and is now more than a decade old, so app support is very limited. A glass repair is cheap enough to be worth it for a tablet that is used for video or as a child's device, but this is not a tablet to invest in beyond that."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.Ipad-4-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.Ipad-4-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The Ipad 4 looks identical to the Ipad 3 but takes a Lightning cable rather than a 30-pin dock connector, and its charging port assembly is a different part. TechBrotherz identifies the generation from the port rather than the case, because the two are indistinguishable from the front."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "lastSupportedOs": "IpadOS 10",
  "stillReceivesUpdates": false
} as ModelContent;

export default content;
