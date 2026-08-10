/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "nexus-5x",
  "name": "Nexus 5X",
  "intro": [
    {
      "_key": "model.nexus-5x-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.nexus-5x-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Nexus 5X was made by LG for Google and was the first Nexus with a rear fingerprint reader and a USB-C port. It is also known for a bootloop fault caused by solder failure on the mainboard, the same class of problem that affected LG's own G4 of the same era. Note this model is listed as Nexus 5S on the original price list."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Bootloop caused by mainboard solder failure, the fault this model is known for",
    "Cracked glass on the 5.2 inch display",
    "USB-C port worn, this being an early adopter of the connector",
    "Rear fingerprint reader failing, introduced on this model",
    "Battery degraded"
  ],
  "verdict": [
    {
      "_key": "model.nexus-5x-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.nexus-5x-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Only if it is not bootlooping. The Nexus 5X stopped at Android 8. A screen on a sound handset is defensible for someone who wants stock Android on a small phone. If it bootloops, the honest answer is that the phone is beyond economic repair."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.nexus-5x-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.nexus-5x-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The 5X bootloop is a mainboard fault and no screen or battery repair addresses it. TechBrotherz diagnoses that before quoting. This model was also printed as Nexus 5S on the original shop price list, which is a name that never existed, and we have flagged the mapping for the shop to confirm."
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
