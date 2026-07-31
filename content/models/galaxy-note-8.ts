/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "galaxy-note-8",
  "name": "Galaxy Note 8",
  "intro": [
    {
      "_key": "model.galaxy-note-8-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-note-8-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Galaxy Note 8 was the model Samsung had to get right, released directly after the Note 7 was withdrawn worldwide over battery fires. Samsung fitted it with a deliberately conservative battery and put it through an eight-point safety check. It was the first Note with dual rear cameras."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked glass on the 6.3 inch curved display",
    "Battery capacity noticeably small for the phone's size, a deliberate safety decision after the Note 7 recall",
    "S Pen no longer registering pressure",
    "Cracked rear glass",
    "Micro USB era ended here, this model using USB-C"
  ],
  "verdict": [
    {
      "_key": "model.galaxy-note-8-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-note-8-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "No for a $329.99 screen. The Note 8 stopped at Android 9. Given its conservative battery, a battery replacement on a Note 8 that is otherwise sound is the repair that actually helps, and it costs a fraction of the screen. We will point you at that instead."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.galaxy-note-8-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-note-8-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "Samsung fitted the Note 8 with a smaller battery than its size suggests, as a direct response to the Note 7 recall. That means Note 8 owners see battery complaints earlier in the phone's life than Note 9 owners do, and a battery replacement is often the more useful repair on this model."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "lastSupportedOs": "Android 9",
  "stillReceivesUpdates": false
} as ModelContent;

export default content;
