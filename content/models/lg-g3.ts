/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "lg-g3",
  "name": "LG G3",
  "intro": [
    {
      "_key": "model.lg-g3-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.lg-g3-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The LG G3 was the first mainstream phone with a Quad HD display and it introduced LG's laser autofocus, a small module beside the rear camera that measures distance. It kept the rear-mounted buttons and the removable battery, and it ran noticeably warm because of the resolution its processor had to drive."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Running hot and throttling, a consequence of driving a Quad HD panel on this generation's processor",
    "Cracked glass on the 5.5 inch display",
    "Laser autofocus module failing, a feature introduced on this model",
    "Removable battery worn, replaceable by hand",
    "Rear-mounted power and volume buttons wearing out"
  ],
  "verdict": [
    {
      "_key": "model.lg-g3-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.lg-g3-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "No, except as a small fix on a working phone. The LG G3 stopped at Android 6 and LG has left the market. The screen is inexpensive, and the removable battery helps, but a decade-old phone that runs hot and receives no security updates is not one to invest in."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.lg-g3-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.lg-g3-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The G3 places its power and volume buttons on the back below the camera rather than on the sides, which is unusual and means a button fault is a different part from any side-button phone. Its laser autofocus module can fail independently of the camera itself."
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
