/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "galaxy-note-10",
  "name": "Galaxy Note 10",
  "intro": [
    {
      "_key": "model.galaxy-note-10-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-note-10-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Galaxy Note 10 is the smaller Note, at 6.3 inches, and the only Note ever released without a microSD slot. Its screen replacement is $469.99, thirty dollars less than the Plus, and like every Note it carries the S Pen digitizer layer behind the display."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked curved glass on the 6.3 inch display",
    "S Pen pressure sensitivity lost while finger touch still works",
    "No microSD expansion, unique among Notes to this model",
    "Battery degraded, this model having a smaller cell than the Plus",
    "USB-C port worn"
  ],
  "verdict": [
    {
      "_key": "model.galaxy-note-10-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-note-10-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "No, at $469.99. The Galaxy Note 10 stopped at Android 12 and the screen repair costs more than the phone fetches. TechBrotherz would rather tell you that than take the job. If the fault is the battery or the charging port, those are worth doing on a Note that is otherwise sound."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.galaxy-note-10-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-note-10-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The standard Note 10 has a smaller battery than the Plus and no memory card slot, so storage-full and battery complaints arrive more often on this model than on its larger sibling. The S Pen digitizer is replaced with the screen assembly."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "lastSupportedOs": "Android 12",
  "stillReceivesUpdates": false
} as ModelContent;

export default content;
