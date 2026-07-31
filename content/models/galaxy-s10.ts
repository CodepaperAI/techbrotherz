/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "galaxy-s10",
  "name": "Galaxy S10",
  "intro": [
    {
      "_key": "model.galaxy-s10-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-s10-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Galaxy S10 was Samsung's first phone with an ultrasonic fingerprint reader under the display. That reader is matched to the original screen, so an S10 that stops recognising a finger after a repair elsewhere usually needs recalibrating rather than a new part. TechBrotherz does that as part of a screen replacement at 3317 17 Ave SE in Calgary. Bring the phone in and we will tell you which it needs."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked glass on the curved display",
    "Ultrasonic in-display fingerprint reader failing, an early and unreliable implementation unique to this generation",
    "Battery capacity well down after several years",
    "Cracked rear glass",
    "Screen burn-in from static navigation elements"
  ],
  "verdict": [
    {
      "_key": "model.galaxy-s10-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-s10-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "No, other than a cheap fix. The Galaxy S10 has reached the end of its Android upgrades, and its first-generation ultrasonic fingerprint reader was unreliable even when new. A battery on a phone still in daily use is fine. A curved screen replacement costs more than the handset is worth."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": null,
  "lastSupportedOs": null,
  "stillReceivesUpdates": false
} as ModelContent;

export default content;
