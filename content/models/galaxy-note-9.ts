/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "galaxy-note-9",
  "name": "Galaxy Note 9",
  "intro": [
    {
      "_key": "model.galaxy-note-9-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-note-9-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Galaxy Note 9 was the last Note with a headphone socket and the first with a Bluetooth S Pen that worked as a remote shutter. It had the largest battery Samsung had fitted to a Note at the time, which is why Note 9 handsets often still hold a usable charge when their contemporaries do not."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked glass on the 6.4 inch curved display",
    "S Pen Bluetooth pairing lost, a feature introduced on this model",
    "Battery still serviceable more often than its contemporaries, thanks to the large cell",
    "Cracked rear glass",
    "USB-C port worn"
  ],
  "verdict": [
    {
      "_key": "model.galaxy-note-9-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-note-9-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "No for a screen, but this one lasts longer than most. The Note 9 stopped at Android 10. Its unusually large battery means many are still usable, so a smaller repair such as a charging port can be worth doing. The screen is not, because it costs more than the handset."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.galaxy-note-9-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-note-9-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The Note 9 introduced a Bluetooth S Pen that charges inside the phone, so a pen that no longer acts as a remote may need pairing rather than replacing. It also kept the 3.5 mm headphone socket that the Note 10 removed, which is a repairable part on this model and absent from the next."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "lastSupportedOs": "Android 10",
  "stillReceivesUpdates": false
} as ModelContent;

export default content;
