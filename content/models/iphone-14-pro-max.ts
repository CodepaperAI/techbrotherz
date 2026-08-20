/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "iphone-14-pro-max",
  "name": "iPhone 14 Pro Max",
  "intro": [
    {
      "_key": "model.iphone-14-pro-max-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-14-pro-max-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The iPhone 14 Pro Max has the largest and most expensive screen of the 14 range, combining the Dynamic Island cutout with an always-on ProMotion panel. It also carries the 48 megapixel main camera, whose lens cover sits proud of the body and cracks readily in a drop. TechBrotherz can often replace just the cracked lens cover rather than the whole camera module. We are at 3317 17 Ave SE in Calgary."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked front glass on the largest and dearest panel of the 14 range",
    "48 megapixel camera lens cover cracked, which we can often replace on its own",
    "Dynamic Island area unresponsive after a drop",
    "Battery health declining with the always-on display",
    "Cracked rear glass"
  ],
  "verdict": [
    {
      "_key": "model.iphone-14-pro-max-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-14-pro-max-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Yes, and check the camera separately. The 14 Pro Max still receives iOS updates and is costly enough that repair clearly beats replacement. Its main camera lens cover sits proud of the body and cracks readily, and replacing just that cover is far cheaper than the whole camera module if the sensor is undamaged."
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
