/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "galaxy-note-3",
  "name": "Galaxy Note 3",
  "intro": [
    {
      "_key": "model.galaxy-note-3-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-note-3-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Galaxy Note 3 is the one with the stitched faux-leather back, and it used the wide USB 3.0 connector that Samsung fitted to only a handful of phones. That connector is the single most common reason a Note 3 comes to the TechBrotherz Store, and it is the one repair still worth doing on this model."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Wide USB 3.0 charging port failing, the unusual connector specific to this generation",
    "Battery worn, removable by hand on this model",
    "Stitched faux-leather back cover peeling at the edges",
    "S Pen tip worn",
    "Screen cracked, though we quote that in person for this model"
  ],
  "verdict": [
    {
      "_key": "model.galaxy-note-3-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-note-3-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Charging port only. The Note 3 stopped at Android 5, over a decade ago. A port replacement on a phone someone is keeping for a specific reason is fine. Beyond that, this is a handset at the end of its life and we will say so rather than quote a screen."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.galaxy-note-3-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-note-3-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The Note 3 uses a wide USB 3.0 connector rather than ordinary micro USB, and the two are not interchangeable parts even though an ordinary micro USB cable will fit in one half of the socket. That confusion is why the port on this model wears out early."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "lastSupportedOs": "Android 5",
  "stillReceivesUpdates": false
} as ModelContent;

export default content;
