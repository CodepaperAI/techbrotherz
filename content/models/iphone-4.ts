/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "iphone-4",
  "name": "iPhone 4",
  "intro": [
    {
      "_key": "model.iphone-4-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-4-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The iPhone 4 was the first with a Retina display and the first with the flat stainless steel band that Apple returned to a decade later on the iPhone 12. Its external antenna band produced the signal problem that became widely known at launch. It is the oldest iPhone TechBrotherz holds parts for."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked front glass on the 3.5 inch Retina display",
    "Cracked rear glass panel",
    "Signal dropping when held across the antenna gap, the fault specific to this model's external antenna design",
    "Battery entirely spent",
    "30-pin dock connector no longer charging"
  ],
  "verdict": [
    {
      "_key": "model.iphone-4-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-4-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "No. The iPhone 4 stopped at iOS 7, which is more than a decade without security updates, and effectively no current app will run on it. We keep parts because people occasionally restore one, and that is the only reason to repair an iPhone 4 today. As a phone, its working life ended years ago."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.iphone-4-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-4-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The iPhone 4 exists in two internally different versions for GSM and CDMA networks, and their screen assemblies and rear glass are not interchangeable. TechBrotherz identifies which one you have from the SIM tray and the antenna band rather than from the box."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "lastSupportedOs": "iOS 7",
  "stillReceivesUpdates": false
} as ModelContent;

export default content;
