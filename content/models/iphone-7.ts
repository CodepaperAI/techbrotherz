/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "iphone-7",
  "name": "iPhone 7",
  "intro": [
    {
      "_key": "model.iphone-7-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-7-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The iPhone 7 was the first iPhone rated for water resistance and the first with a solid-state home button. At $84.99 its screen is among the cheapest iPhone repairs TechBrotherz offers. Most iPhone 7 handsets arriving now are long out of their original ownership and are being kept going as backup phones or handed down."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked front glass, the cheapest iPhone screen replacement on our list",
    "Home button no longer registering, a Taptic Engine fault on this generation rather than a switch",
    "Water resistance lost after a previous repair, because the frame seal is single-use",
    "Charging port worn from years of Lightning cables",
    "Battery health well below 80 percent"
  ],
  "verdict": [
    {
      "_key": "model.iphone-7-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-7-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Only worth a cheap repair. The iPhone 7 stopped at iOS 15 and is now old enough that app compatibility is a real constraint rather than a theoretical one. An $84.99 screen on a phone that otherwise works is defensible. Anything more than that, on a phone of this age, is better spent on a replacement handset."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.iphone-7-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-7-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The iPhone 7 is rated IP67 from the factory, but that rating depends on an adhesive seal around the frame that is destroyed the first time the phone is opened. TechBrotherz re-seals during a repair, but no shop can restore the original factory rating, and we would rather say that than imply otherwise."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "lastSupportedOs": "iOS 15",
  "stillReceivesUpdates": false
} as ModelContent;

export default content;
