/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "galaxy-note-2",
  "name": "Galaxy Note 2",
  "intro": [
    {
      "_key": "model.galaxy-note-2-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-note-2-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Galaxy Note 2 is the phone that convinced the industry large screens would sell, at a size that looked absurd in 2012 and ordinary now. It has a removable battery, a microSD slot and an ordinary micro USB port, which makes it the simplest and cheapest of the older Notes to keep running."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Micro USB charging port worn out, the repair we list for this model at $49.99",
    "Battery worn, removable by hand",
    "Plastic back cover loose",
    "S Pen lost or its tip worn",
    "Screen cracked, quoted in person for this model"
  ],
  "verdict": [
    {
      "_key": "model.galaxy-note-2-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-note-2-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Charging port only, and only for sentiment. The Note 2 stopped at Android 4.4 well over a decade ago and cannot run any current app. A $49.99 port on a phone being kept as a curiosity is fine. As a working phone, it finished its life years ago."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.galaxy-note-2-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-note-2-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "Unlike the Note 3 that followed it, the Note 2 uses an ordinary micro USB connector, so ports and cables are still easy to source. Together with the removable battery and memory card, that makes it the least awkward old Note to maintain."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "lastSupportedOs": "Android 4.4",
  "stillReceivesUpdates": false
} as ModelContent;

export default content;
