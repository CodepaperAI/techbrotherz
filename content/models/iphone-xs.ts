/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "Iphone-xs",
  "name": "Iphone XS",
  "intro": [
    {
      "_key": "model.Iphone-xs-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.Iphone-xs-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Iphone XS looks almost identical to the Iphone X and is constantly mistaken for it, but the two take different screen parts and will not accept each other's. TechBrotherz identifies the exact model from the phone itself rather than from what the box said, so the right part goes in. Like the X, the XS has Face ID paired to the logic board. Walk in at 3317 17 Ave SE in Calgary."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked front glass on the OLED panel, frequently mistaken for the visually identical Iphone X",
    "Face ID permanently lost after a previous repair",
    "Battery health well below 80 percent",
    "Screen burn-in from static interface elements",
    "Charging port worn"
  ],
  "verdict": [
    {
      "_key": "model.Iphone-xs-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.Iphone-xs-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Marginal, the same call as the Iphone X. The XS has reached the end of new iOS versions. A battery on a sound handset is worth doing. A screen is harder to justify on a phone whose software support has ended, unless you need this specific phone working for a defined period."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": null,
  "lastSupportedOs": null,
  "stillReceivesUpdates": null
} as ModelContent;

export default content;
