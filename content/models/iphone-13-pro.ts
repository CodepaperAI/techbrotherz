/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "iphone-13-pro",
  "name": "Iphone 13 Pro",
  "intro": [
    {
      "_key": "model.iphone-13-pro-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-13-pro-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Iphone 13 Pro was the first Iphone with a 120Hz ProMotion display, and that panel costs more than the standard 13 screen sitting next to it. Face ID on the 13 Pro is tied to the original screen, so the sensor has to be carried across during a replacement or recalibrated afterwards. TechBrotherz does that as part of the repair at 3317 17 Ave SE in Calgary. No appointment is needed."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked front glass on the ProMotion panel, dearer than the standard 13 screen",
    "Face ID lost after a screen repair done without transferring the sensor",
    "Battery health declining after several years",
    "Macro camera failing, a feature the standard 13 does not have",
    "Lightning port worn"
  ],
  "verdict": [
    {
      "_key": "model.iphone-13-pro-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-13-pro-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Yes, and the screen is worth doing properly. The Iphone 13 Pro still receives iOS updates. Its 120Hz ProMotion panel costs more than the standard 13's, so a cut-price repair that fits a non-ProMotion part will feel noticeably worse. Ask what panel is going in before agreeing to any quote, here or anywhere."
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
