/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "lg-g2",
  "name": "LG G2",
  "intro": [
    {
      "_key": "model.lg-g2-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.lg-g2-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The LG G2 was the first phone to put its power and volume buttons on the back, below the camera, because LG argued that is where your index finger already rests. It has no buttons on its sides at all. That single decision defines the phone and every repair conversation about it."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Rear-mounted buttons failing, the only controls this phone has",
    "Cracked glass on the 5.2 inch display",
    "Sealed battery degraded, unusually for an LG of this era",
    "Micro USB port worn",
    "Screen showing burn-in from static elements"
  ],
  "verdict": [
    {
      "_key": "model.lg-g2-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.lg-g2-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "No. The LG G2 stopped at Android 5 more than a decade ago, and LG no longer makes phones or parts. A $110 screen on a handset of this age cannot be justified for normal use. TechBrotherz will do it if the phone matters to you for a particular reason, but we will say that first."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.lg-g2-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.lg-g2-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The G2 has no side buttons whatsoever, so a failed rear button assembly leaves the phone with no physical controls at all. That makes the button repair more urgent on this model than on any other phone we handle, and it is a different part from the G3's rear buttons despite the similar idea."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "lastSupportedOs": "Android 5",
  "stillReceivesUpdates": false
} as ModelContent;

export default content;
