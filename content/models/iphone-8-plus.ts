/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "iphone-8-plus",
  "name": "iPhone 8 Plus",
  "intro": [
    {
      "_key": "model.iphone-8-plus-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-8-plus-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The iPhone 8 Plus was Apple's last large phone with a home button, and it is still one of the most common repairs on the bench at TechBrotherz. It was the first Plus model with a glass back for wireless charging, which means a drop can break the front, the back, or both. Its 5.5 inch LCD is cheaper to replace than any OLED iPhone of a similar size."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked front glass, by far the most common fault we see on this model",
    "Cracked rear glass, which the 8 generation introduced and earlier Plus models did not have",
    "Battery capacity below 80 percent, common on a phone this age",
    "Home button losing its click, or Touch ID stopping after a repair done elsewhere",
    "Charging port packed with pocket lint so the cable no longer seats"
  ],
  "verdict": [
    {
      "_key": "model.iphone-8-plus-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-8-plus-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Worth repairing for a screen or a battery, not worth a major rebuild. The iPhone 8 Plus stopped at iOS 16, so it no longer receives new features and its app support is narrowing year by year. A screen on a phone you plan to keep another year is sound. A screen, a battery and a back glass together is money better put toward a replacement."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.iphone-8-plus-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-8-plus-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The home button on the iPhone 8 Plus is paired to the logic board at the factory. A replacement button will click and register presses, but Touch ID will not work again on any button other than the original. We tell you that before starting rather than after. The rear glass is bonded to the frame and has to be broken out in pieces, which is why back glass is a separate and slower job than the screen."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "lastSupportedOs": "iOS 16",
  "stillReceivesUpdates": false
} as ModelContent;

export default content;
