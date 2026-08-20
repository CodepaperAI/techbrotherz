/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "iphone-4s",
  "name": "Iphone 4S",
  "intro": [
    {
      "_key": "model.iphone-4s-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-4s-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Iphone 4S was the first Iphone with Siri and the last with the 30-pin dock connector. Its front and back are both glass over a stainless steel frame, so it breaks on both sides and it is heavy for its size. TechBrotherz still stocks parts for it, which very few shops do."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked front glass on the 3.5 inch display",
    "Cracked rear glass, this generation being glass on both sides",
    "30-pin dock connector worn out, a connector no longer made",
    "Battery entirely spent",
    "Home button unresponsive"
  ],
  "verdict": [
    {
      "_key": "model.iphone-4s-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-4s-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "No, and we will say so plainly. The Iphone 4S stopped at iOS 9, well over a decade ago. It cannot run current apps, receives no security updates, and uses a charging connector that is no longer sold in most shops. TechBrotherz will repair one on request, but not one member of staff would recommend spending money on it."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.iphone-4s-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-4s-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The 4 and 4S use a 30-pin dock connector rather than Lightning, so charging port parts are increasingly hard to source and cables are no longer commonly sold. The rear glass is a two-screw removal on this generation, which makes it one of the easiest back glass repairs we do."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "lastSupportedOs": "iOS 9",
  "stillReceivesUpdates": false
} as ModelContent;

export default content;
