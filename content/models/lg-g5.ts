/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "lg-g5",
  "name": "LG G5",
  "intro": [
    {
      "_key": "model.lg-g5-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.lg-g5-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The LG G5 is the modular one. Its bottom chin slides out so the battery can be swapped or an accessory module fitted, an idea no other mainstream phone tried and which LG abandoned after a single generation. That sliding joint is a mechanical weak point that no other phone we repair has."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Sliding modular chin loose or no longer latching, unique to this model in the entire LG range",
    "Cracked glass on the 5.3 inch display",
    "Battery contacts in the removable module worn from repeated swaps",
    "USB-C port worn",
    "Rattling from the modular joint"
  ],
  "verdict": [
    {
      "_key": "model.lg-g5-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.lg-g5-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Only if you value the modular battery. The LG G5 stopped at Android 8 and LG has left the phone business. The screen is affordable, and the swappable battery genuinely extends the phone's life. But there will be no more parts made, so treat any spend as short-term."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.lg-g5-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.lg-g5-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The G5's removable chin means the battery can be changed in seconds, which is genuinely useful, but the sliding contacts wear and the latch loosens. A G5 that reports a battery fault often has a contact problem at the module rather than a dead cell, and that is worth checking first."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "lastSupportedOs": "Android 8",
  "stillReceivesUpdates": false
} as ModelContent;

export default content;
