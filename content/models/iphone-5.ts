/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "iphone-5",
  "name": "Iphone 5",
  "intro": [
    {
      "_key": "model.iphone-5-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-5-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Iphone 5 introduced the Lightning connector and the taller 4 inch screen, and it was the first Iphone with an aluminium unibody back. It shares a price list with the 5S and 5C but differs from both: no Touch ID like the 5S, and a metal body rather than the 5C's plastic. Its anodised finish chips easily at the corners."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked front glass on the 4 inch display",
    "Chipped anodised finish at the corners, characteristic of this model's aluminium back",
    "Battery entirely worn out after more than a decade",
    "Lightning port worn, this being the first generation to use the connector",
    "Power button failing, a widespread fault on this model specifically"
  ],
  "verdict": [
    {
      "_key": "model.iphone-5-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-5-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "No. The Iphone 5 stopped at iOS 10 and is now well beyond the point where it can run current apps or receive security updates. TechBrotherz can fit a screen, and occasionally someone has a good reason, but for any normal use the honest answer is that this phone's working life is over."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.iphone-5-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-5-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The Iphone 5 was the first Lightning Iphone, and its port design was revised in later models, so the part is not shared with the 5S or 5C despite the shared price. The power button flex on this model fails often enough that Apple ran a replacement programme for it."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "lastSupportedOs": "iOS 10",
  "stillReceivesUpdates": false
} as ModelContent;

export default content;
