/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "Iphone-5s",
  "name": "Iphone 5S",
  "intro": [
    {
      "_key": "model.Iphone-5s-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.Iphone-5s-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Iphone 5S was the first Iphone with Touch ID and the first with a 64-bit processor, which is why it kept receiving updates years after the 5 and 5C had stopped. It shares its repair prices with those two models but not its internals, and the fingerprint sensor is the difference that matters most when a repair is quoted."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked front glass on the 4 inch display",
    "Touch ID failing, unique to the 5S among the three models sharing its price",
    "Battery degraded past usefulness",
    "Charging port worn out",
    "Power button sticking, a common fault across this generation"
  ],
  "verdict": [
    {
      "_key": "model.Iphone-5s-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.Iphone-5s-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Not worth repairing except for sentiment or a very specific need. The Iphone 5S stopped at iOS 12 and is now well over a decade old, with no security updates and very limited app support. TechBrotherz will fit a screen if you want the phone working for a particular reason, but we would not recommend it as a phone to rely on."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.Iphone-5s-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.Iphone-5s-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The Iphone 5S was the first Iphone to pair its home button to the logic board, so Touch ID cannot be transferred to a replacement button. The Iphone 5 and 5C beside it on the price list have no fingerprint sensor at all, so their home button repairs restore full function while the 5S does not."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "lastSupportedOs": "iOS 12",
  "stillReceivesUpdates": false
} as ModelContent;

export default content;
