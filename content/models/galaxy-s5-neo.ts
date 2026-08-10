/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "galaxy-s5-neo",
  "name": "Galaxy S5 Neo",
  "intro": [
    {
      "_key": "model.galaxy-s5-neo-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-s5-neo-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Galaxy S5 Neo is the version of the S5 Samsung released a year later with a different processor, sold mainly outside the United States and common in Canada. It keeps the dimpled removable plastic back of the original S5, which means the battery can still be changed by hand and the back does not shatter."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked front glass on the 5.1 inch display",
    "Charging port flap seal perished, the S5 generation using a physical cover for water resistance",
    "Battery worn out, though this model's battery is user-replaceable",
    "Home button with fingerprint swipe sensor failing",
    "Micro USB 3.0 port worn, an unusual wide connector specific to this generation"
  ],
  "verdict": [
    {
      "_key": "model.galaxy-s5-neo-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-s5-neo-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Battery yes, screen no. The Galaxy S5 Neo stopped at Android 7. Its removable battery means a very cheap revival is possible, and that is worth doing on a working phone. A screen on a handset from 2015 is not, because it is several times the phone's value."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.galaxy-s5-neo-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-s5-neo-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The S5 generation is one of the last Galaxy phones with a removable back and a user-replaceable battery, so a tired S5 Neo often needs nothing more than a new cell that the owner can fit. It also uses the wide micro USB 3.0 connector, which is not the same part as an ordinary micro USB port."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "lastSupportedOs": "Android 7",
  "stillReceivesUpdates": false
} as ModelContent;

export default content;
