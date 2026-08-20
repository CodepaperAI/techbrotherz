/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "galaxy-s6-edge",
  "name": "Galaxy S6 Edge",
  "intro": [
    {
      "_key": "model.galaxy-s6-edge-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-s6-edge-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Galaxy S6 Edge was Samsung's first dual-curved phone and the model where it abandoned removable batteries and microSD cards. Its curved display broke often enough that it defined the repair economics of the whole generation, and it is still one of the dearer legacy Samsung screens we fit."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked glass on both curved edges, this being Samsung's first dual-curve design",
    "Battery sealed in and now degraded, the S6 generation removing the user-replaceable battery",
    "No microSD expansion, a limitation this generation introduced",
    "Micro USB port worn",
    "Rear glass cracked"
  ],
  "verdict": [
    {
      "_key": "model.galaxy-s6-edge-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-s6-edge-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "No. The Galaxy S6 Edge stopped at Android 7, which is a decade of missed security updates, and its curved screen is one of the dearest legacy repairs on the board, several times the handset's value. This is a phone to retire. TechBrotherz will say that at the Store rather than take the work."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.galaxy-s6-edge-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-s6-edge-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The S6 generation was where Samsung sealed the battery in and dropped the microSD slot, so a tired S6 Edge cannot be revived by swapping a battery at home the way earlier Galaxy phones could. The dual curve makes the screen assembly the most fragile part of the phone."
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
