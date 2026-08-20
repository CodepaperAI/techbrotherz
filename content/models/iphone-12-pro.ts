/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "Iphone-12-pro",
  "name": "Iphone 12 Pro",
  "intro": [
    {
      "_key": "model.Iphone-12-pro-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.Iphone-12-pro-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Iphone 12 Pro pairs an OLED panel with a stainless steel frame and a LiDAR scanner beside the rear cameras. The stainless frame is stiffer than the aluminium on the standard 12, so a heavy drop tends to crack glass rather than bend the body, which is the easier outcome to repair. TechBrotherz replaces 12 Pro screens and rear glass at 3317 17 Ave SE in Calgary, usually while you wait."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked front glass on the OLED panel",
    "LiDAR scanner failing, a component the standard Iphone 12 does not have",
    "Stainless steel frame scuffed rather than bent, characteristic of the Pro body",
    "Battery health declining",
    "Cracked rear glass affecting MagSafe"
  ],
  "verdict": [
    {
      "_key": "model.Iphone-12-pro-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.Iphone-12-pro-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Yes. The Iphone 12 Pro still receives iOS updates and its stainless frame means drops tend to break glass rather than deform the body, which is the more repairable outcome. A screen or battery on a 12 Pro is a straightforward yes; a full rebuild of screen, back and battery together is where the sums stop working."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": null,
  "lastSupportedOs": null,
  "stillReceivesUpdates": true
} as ModelContent;

export default content;
