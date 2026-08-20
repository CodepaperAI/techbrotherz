/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "Iphone-5c",
  "name": "Iphone 5C",
  "intro": [
    {
      "_key": "model.Iphone-5c-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.Iphone-5c-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Iphone 5C is the plastic one. Apple built it from polycarbonate over a steel frame rather than aluminium, in five colours, and it is the only Iphone that has ever been made that way. That construction changes the repair: the shell flexes rather than bends, and it cracks around the screw posts rather than denting."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked front glass on the 4 inch display",
    "Polycarbonate shell cracking around the internal screw posts, unique to this model's plastic body",
    "Battery long dead, this model is now more than a decade old",
    "Charging port worn out",
    "Home button unresponsive, a simple switch on this model with no fingerprint sensor"
  ],
  "verdict": [
    {
      "_key": "model.Iphone-5c-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.Iphone-5c-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "No, other than for sentiment. The Iphone 5C stopped at iOS 10, which is now many years without security updates, and almost no current app will install on it. TechBrotherz will still repair one if you ask, and we will be straight with you first: this is a collectable or a keepsake at this point, not a working phone."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.Iphone-5c-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.Iphone-5c-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The 5C has no Touch ID, so unlike the 5S beside it on the price list a replacement home button restores full function with nothing lost. Its plastic shell is also more forgiving to open than the aluminium 5 and 5S, but it cracks at the screw posts if it has been opened carelessly before."
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
