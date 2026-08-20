/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "iphone-x",
  "name": "Iphone X",
  "intro": [
    {
      "_key": "model.iphone-x-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-x-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Iphone X was Apple's first phone with Face ID, and its front sensor array is paired to the logic board at the factory, so Face ID cannot be carried across to a replacement part. We tell every Iphone X customer that before starting rather than after. The X was also the first Iphone with a glass back for wireless charging. TechBrotherz repairs both at 3317 17 Ave SE in Calgary."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked front glass on Apple's first OLED Iphone panel",
    "Face ID permanently lost after a previous repair, because the sensor array is paired to the logic board",
    "Screen burn-in from static interface elements, this being an early OLED",
    "Battery health well below 80 percent",
    "Cracked rear glass"
  ],
  "verdict": [
    {
      "_key": "model.iphone-x-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-x-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Marginal. The Iphone X has reached the end of new iOS versions and its early OLED panel is old enough that burn-in is common. A battery on a working X is fine. A screen is harder to justify, particularly if Face ID has already been lost, because that cannot be restored by any repair."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": null,
  "lastSupportedOs": null,
  "stillReceivesUpdates": false
} as ModelContent;

export default content;
