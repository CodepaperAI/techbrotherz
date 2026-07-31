/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "galaxy-note-4",
  "name": "Galaxy Note 4",
  "intro": [
    {
      "_key": "model.galaxy-note-4-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-note-4-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Galaxy Note 4 is the last Note with both a removable battery and a microSD slot, which is exactly why some owners still refuse to give theirs up. Its faux-leather plastic back lifts off by hand, and a flat battery can be swapped in seconds without a single tool."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked glass on the 5.7 inch display, replaced as a panel at $174.99",
    "Battery worn, but removable by hand on this model",
    "Micro USB port worn out",
    "S Pen tip worn or lost",
    "Plastic back cover loose at the clips"
  ],
  "verdict": [
    {
      "_key": "model.galaxy-note-4-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-note-4-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Battery yes, screen borderline. The Note 4 stopped at Android 6, so it is not a phone for banking or messaging. Its removable battery makes a revival almost free, which is worth doing for a specific use. A $174.99 screen on a phone from 2014 is much harder to justify."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.galaxy-note-4-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-note-4-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The Note 4 is the last Note where the owner can replace the battery and expand the storage without any tools. That makes it unusually cheap to keep alive compared with every Note that followed, and it is the reason people hold onto them."
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
