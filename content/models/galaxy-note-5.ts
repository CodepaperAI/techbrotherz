/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "galaxy-note-5",
  "name": "Galaxy Note 5",
  "intro": [
    {
      "_key": "model.galaxy-note-5-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-note-5-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Galaxy Note 5 is the model with the S Pen that could be inserted backwards and jam permanently, a design fault Samsung acknowledged and corrected in later Notes. It was also the first Note with a sealed glass back and no microSD slot, which made it the least popular Note among long-time owners."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "S Pen inserted backwards and jammed, a fault specific to this model's slot design",
    "Cracked glass on the 5.7 inch display",
    "Sealed battery degraded, this being the first Note without a removable back",
    "No microSD expansion, dropped on this model",
    "Micro USB port worn"
  ],
  "verdict": [
    {
      "_key": "model.galaxy-note-5-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-note-5-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "No. The Galaxy Note 5 stopped at Android 7, and a screen on a decade-old phone with a known design fault is not a sensible spend. TechBrotherz will free a jammed S Pen and give you an honest assessment, but we would not recommend investing in this handset."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.galaxy-note-5-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-note-5-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The Note 5 slot accepts the S Pen either way round, and inserting it backwards can permanently damage the detection mechanism. If a Note 5 has lost pen detection entirely, that history is usually the reason, and it is a different repair from a cracked screen."
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
