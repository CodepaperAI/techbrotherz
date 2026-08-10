/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "iphone-6",
  "name": "iPhone 6",
  "intro": [
    {
      "_key": "model.iphone-6-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-6-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The iPhone 6 was the best-selling iPhone Apple ever made, which is why they still turn up at the counter a decade later. Its 4.7 inch LCD is one of the cheaper iPhone screens to replace, and TechBrotherz still fits the full component range for it. It stopped at iOS 12, so it is now firmly a phone with a specific purpose rather than a daily driver."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked front glass, the cheapest iPhone screen we replace on a metal-backed model",
    "Battery that no longer holds a useful charge",
    "Home button and Touch ID failing",
    "Charging port worn out",
    "Rear camera producing blurry images from a scratched lens cover"
  ],
  "verdict": [
    {
      "_key": "model.iphone-6-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-6-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Only for a specific purpose. The iPhone 6 stopped at iOS 12 and no longer receives security updates, so we would not recommend it for banking or messaging. As a music player, a car phone or a spare kept in a drawer, a screen or a battery still makes sense. As a main phone in 2026, it does not."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.iphone-6-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-6-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The iPhone 6 uses the thinner 6000 series aluminium of its generation, so like the 6 Plus it is worth checking for frame bend before fitting a screen, though the smaller body makes it far less prone than its larger sibling."
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
