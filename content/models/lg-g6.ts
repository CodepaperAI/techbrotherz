/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "lg-g6",
  "name": "LG G6",
  "intro": [
    {
      "_key": "model.lg-g6-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.lg-g6-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The LG G6 abandoned the modular accessory system of the G5 and was the first mainstream phone with an 18 by 9 tall display. It was also LG's first properly water-resistant flagship. Its screen is the dearest of the five LG models TechBrotherz still repairs."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked glass on the tall 18 by 9 display, the first mainstream phone with that aspect ratio",
    "Battery sealed and degraded, the G6 dropping the removable battery of earlier G models",
    "USB-C port worn",
    "Rear glass cracked",
    "Display dimming unevenly with age"
  ],
  "verdict": [
    {
      "_key": "model.lg-g6-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.lg-g6-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Marginal, and the platform has an end date. The LG G6 stopped at Android 9, and LG exited the phone business entirely in 2021, so there will be no more parts made. A screen on a working phone is defensible if you like it, but nothing about this platform gets better from here."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.lg-g6-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.lg-g6-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The G6 sealed the battery in and dropped both the modular accessories of the G5 and the removable back of the G4, so unlike its predecessors it cannot be revived with a hand-swapped cell. LG left the phone business in 2021, so remaining parts come from existing stock."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "lastSupportedOs": "Android 9",
  "stillReceivesUpdates": false
} as ModelContent;

export default content;
