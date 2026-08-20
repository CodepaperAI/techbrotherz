/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "Iphone-13",
  "name": "Iphone 13",
  "intro": [
    {
      "_key": "model.Iphone-13-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.Iphone-13-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "On the Iphone 13, Apple tied Face ID to the original screen, so a replacement done without transferring the sensor or recalibrating the phone leaves Face ID dead. That step is part of the job at TechBrotherz rather than an extra. The 13 also has a smaller notch than the 12, which means its earpiece assembly is a different part and Iphone 12 screens do not fit. We are at 3317 17 Ave SE in Calgary, walk-ins welcome."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked front glass with the display still working",
    "Face ID dead after a screen replacement done elsewhere without transferring the sensor",
    "Battery health declining after several years of fast charging",
    "Charging port intermittent",
    "Rear camera lens cover cracked"
  ],
  "verdict": [
    {
      "_key": "model.Iphone-13-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.Iphone-13-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Yes, without hesitation. The Iphone 13 still receives iOS updates and has years of app support ahead of it. The one caution is Face ID: have the screen done somewhere that transfers the sensor, because a cheap repair that kills Face ID permanently reduces the phone's value by far more than it saved."
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
