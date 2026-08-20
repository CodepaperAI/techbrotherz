/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "galaxy-s8-plus",
  "name": "Galaxy S8 Plus",
  "intro": [
    {
      "_key": "model.galaxy-s8-plus-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-s8-plus-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Galaxy S8 Plus was the first big Samsung with an almost bezel-free curved display, and it moved the fingerprint reader to an awkward spot beside the rear camera. Its 6.2 inch curved OLED is bonded to the frame, which is why a screen replacement costs considerably more than a flat panel would."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked glass along the curved edge, where this generation is thinnest",
    "Green or pink vertical lines on the OLED after a drop",
    "Rear fingerprint reader hard to find beside the camera, a design complaint specific to the S8 generation",
    "Battery no longer lasting a day",
    "Cracked rear glass affecting wireless charging"
  ],
  "verdict": [
    {
      "_key": "model.galaxy-s8-plus-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-s8-plus-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Hard to justify. The Galaxy S8 Plus stopped at Android 9, so it receives no security patches, and the screen repair costs more than many working used handsets. TechBrotherz will do it if the phone has value to you beyond its market price, but for general use the money goes further on a replacement."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.galaxy-s8-plus-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-s8-plus-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "Samsung bonds the curved OLED panel to the aluminium frame on this generation, so the replacement part is the screen and the frame together rather than a panel alone. That is the single reason a Galaxy screen costs more than an Iphone screen of comparable size."
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
