/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "iphone-6s",
  "name": "iPhone 6S",
  "intro": [
    {
      "_key": "model.iphone-6s-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-6s-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The iPhone 6S is the model Apple ran a public battery replacement programme for, after unexpected shutdowns on ageing cells became widespread. That history matters at the Store: an iPhone 6S that shuts down at thirty percent almost always needs a battery rather than anything more serious. Its screen is one of the cheaper repairs TechBrotherz does."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Sudden shutdowns at twenty or thirty percent charge, the fault Apple's own replacement programme addressed",
    "Cracked front glass on the 4.7 inch display",
    "Home button and Touch ID failing after years of use",
    "Charging port no longer holding the cable",
    "Loudspeaker distorted or silent"
  ],
  "verdict": [
    {
      "_key": "model.iphone-6s-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-6s-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "A battery, yes. Anything larger, probably not. The iPhone 6S stopped at iOS 15 and is now about ten years old. A battery that brings a working phone back for another year is genuinely good value. A screen and a battery and a port together on a phone of this age is money that would go further toward a used replacement."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.iphone-6s-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-6s-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "Because unexpected shutdowns on this model are so strongly associated with battery ageing rather than the logic board, TechBrotherz always tests the battery on a 6S before quoting anything more involved. It is frequently a battery fix on a phone the owner assumed was finished."
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
