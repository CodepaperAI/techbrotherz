/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "galaxy-s5",
  "name": "Galaxy S5",
  "intro": [
    {
      "_key": "model.galaxy-s5-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-s5-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Galaxy S5 is the one with the dimpled back. It was Samsung's first water-resistant flagship, achieved with a rubber-sealed charging port flap rather than internal adhesive, and it kept the removable battery that the S6 would drop a year later. It arrives at the counter more often than any other Galaxy of its age."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked front glass on the 5.1 inch display",
    "Charging port flap lost or perished, which removes the water resistance entirely",
    "Battery worn, though this model's battery lifts out by hand",
    "Fingerprint swipe sensor in the home button failing, an early and unreliable design",
    "Dimpled plastic back cover loose or cracked at the clips"
  ],
  "verdict": [
    {
      "_key": "model.galaxy-s5-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-s5-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Battery only. The Galaxy S5 stopped at Android 6, over a decade ago, and no current banking or messaging app will support it. A new battery costs very little and the owner can fit it. A $149.99 screen on a phone this old is not a repair we would recommend."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.galaxy-s5-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-s5-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "Water resistance on the S5 depends on a physical rubber flap over the charging port rather than sealed adhesive, so a missing flap means the phone is no longer protected regardless of any repair. The removable back also makes a battery swap the cheapest possible fix on this model."
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
