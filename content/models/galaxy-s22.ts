/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "galaxy-s22",
  "name": "Galaxy S22",
  "intro": [
    {
      "_key": "model.galaxy-s22-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-s22-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Galaxy S22 went back to a glass back after the plastic S21, and it carries a smaller battery than the S21 did, which is why S22 owners often come to us for a battery well before the phone feels old. The screen is the OLED panel bonded to the frame and replaced as one part. TechBrotherz is at 3317 17 Ave SE in Calgary, walk-ins welcome."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked front glass on the bonded OLED panel",
    "Battery draining noticeably fast, this model shipping with a smaller cell than the S21 before it",
    "In-display fingerprint reader failing after a repair without recalibration",
    "Cracked rear glass, the S22 returning to glass after the plastic S21",
    "USB-C port worn"
  ],
  "verdict": [
    {
      "_key": "model.galaxy-s22-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-s22-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Yes, and consider the battery first. The Galaxy S22 still receives updates. Samsung fitted it with a smaller battery than the S21, so battery complaints arrive earlier on this model than owners expect, and a battery replacement is often the repair that actually solves the problem rather than the screen."
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
