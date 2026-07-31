/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "iphone-16",
  "name": "iPhone 16",
  "intro": [
    {
      "_key": "model.iphone-16-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-16-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The iPhone 16 added the Camera Control button on the right edge, which sits on its own flex assembly and is a separate repair from the volume and power keys. The 16 uses USB-C like the 15 before it. Parts for this generation are ordered in rather than held in stock at TechBrotherz, so phone (403) 273-8324 with your model and we will confirm the price and the lead time."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked front glass on the OLED panel",
    "Camera Control button unresponsive, a control introduced on this generation and on its own flex assembly",
    "USB-C port loose",
    "Cracked rear glass",
    "Battery draining faster than expected under heavy use"
  ],
  "verdict": [
    {
      "_key": "model.iphone-16-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-16-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Yes, obviously. The iPhone 16 is current, receives iOS updates and will for years. Any repair is a fraction of replacement cost. The only practical note is that parts for this generation are ordered in rather than stocked, so call ahead and we will tell you the lead time before you travel."
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
