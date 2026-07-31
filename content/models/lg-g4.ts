/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "lg-g4",
  "name": "LG G4",
  "intro": [
    {
      "_key": "model.lg-g4-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.lg-g4-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The LG G4 is the one with the optional stitched leather back and a well-documented bootloop fault, caused by solder joints failing on the mainboard under heat. LG ran a replacement programme for it. A G4 that will not get past the logo is almost certainly that fault, and it is not a screen problem."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Bootloop, the failure this specific model became known for and which LG acknowledged",
    "Cracked glass on the 5.5 inch curved display",
    "Removable battery worn, replaceable by hand on this model",
    "Micro USB port worn",
    "Leather back cover peeling if fitted with that option"
  ],
  "verdict": [
    {
      "_key": "model.lg-g4-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.lg-g4-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Only if it is not bootlooping. The LG G4 stopped at Android 6 and LG has exited phones entirely. If the fault is a cracked screen on an otherwise working handset, $110 is cheap. If it is the bootloop, no repair at this price will help and we will tell you at the counter."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.lg-g4-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.lg-g4-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The G4 bootloop is a mainboard fault, not a software one, and no screen or battery repair will fix it. TechBrotherz will diagnose it before quoting anything, because it is the one fault on this model where the honest answer is that the phone is beyond economic repair."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "lastSupportedOs": "Android 6",
  "stillReceivesUpdates": false
} as ModelContent;

export default content;
