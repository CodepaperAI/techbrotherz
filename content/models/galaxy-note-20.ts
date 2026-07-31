/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "galaxy-note-20",
  "name": "Galaxy Note 20",
  "intro": [
    {
      "_key": "model.galaxy-note-20-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-note-20-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "TechBrotherz repairs the Galaxy Note 20 at 3317 17 Ave SE in Calgary. The Note range carries an extra digitizer layer behind the display for the S Pen, so a screen replacement on a Note has to restore pen pressure sensitivity as well as finger touch, and the part costs more than a comparable non-Note screen. If the S Pen has stopped registering pressure but touch still works, bring it in, because that is a different fault from a cracked screen."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked glass with the display still working",
    "S Pen no longer registering pressure or hover",
    "Coloured bands across the OLED panel",
    "Battery no longer lasting a full day",
    "USB-C port worn from repeated charging"
  ],
  "verdict": null,
  "repairNotes": null,
  "lastSupportedOs": null,
  "stillReceivesUpdates": false
} as ModelContent;

export default content;
