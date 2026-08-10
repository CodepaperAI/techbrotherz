/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "galaxy-s8",
  "name": "Galaxy S8",
  "intro": [
    {
      "_key": "model.galaxy-s8-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-s8-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Galaxy S8 introduced Samsung's Infinity Display and dropped the physical home button that every Galaxy S before it had. Its 5.8 inch curved OLED is smaller than the S8 Plus but replaced as the same kind of bonded screen-and-frame assembly, and the figure printed on the legacy list is one we have asked the shop to confirm."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked glass on the curved edge",
    "Burn-in on the OLED from the on-screen navigation bar, this being the first Galaxy S without physical buttons",
    "Iris scanner failing, a feature unique to the S8 and S9 generations",
    "Battery degraded past a working day",
    "Charging port worn"
  ],
  "verdict": [
    {
      "_key": "model.galaxy-s8-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-s8-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "No. The Galaxy S8 stopped at Android 9 and its screen exceeds what the handset is worth. This is also one of the figures we have asked the shop to confirm, because the printed list puts it above the larger S8 Plus. Either way, at this level a replacement phone is the better spend."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.galaxy-s8-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-s8-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The S8 was the first Galaxy S to replace the physical home button with on-screen navigation, which is why burn-in along the bottom of the panel is more common on this generation than on the S7 before it. The screen is bonded to the frame and replaced as one assembly."
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
