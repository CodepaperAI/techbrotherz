/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "iphone-15",
  "name": "iPhone 15",
  "intro": [
    {
      "_key": "model.iphone-15-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-15-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The iPhone 15 was the first iPhone to move from Lightning to USB-C, so a worn charging port on a 15 takes a different part from every iPhone before it and an older port will not fit. The Dynamic Island runs across the whole 15 range rather than just the Pro models. TechBrotherz repairs the iPhone 15 at 3317 17 Ave SE in Calgary. Phone (403) 273-8324 and we will confirm the price and the part."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked front glass on the OLED panel",
    "USB-C port loose or charging intermittently, this being the first USB-C iPhone generation",
    "Battery capacity dropping after heavy fast charging",
    "Cracked rear glass",
    "Rear camera lens cover cracked"
  ],
  "verdict": [
    {
      "_key": "model.iphone-15-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-15-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Yes, clearly. The iPhone 15 is recent, still receives iOS updates and has a long life ahead of it, so any repair is cheaper than replacing it. The only thing worth knowing is that its USB-C port is a different part from every Lightning iPhone, so an older port will not fit."
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
