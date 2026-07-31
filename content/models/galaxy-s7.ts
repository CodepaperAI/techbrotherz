/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "galaxy-s7",
  "name": "Galaxy S7",
  "intro": [
    {
      "_key": "model.galaxy-s7-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-s7-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Galaxy S7 has a flat 5.1 inch display rather than the curve of the S7 Edge beside it, which makes it the more durable of the pair and slightly cheaper to repair at $249.99. It was the model that restored the microSD slot and water resistance after the S6 removed both, and it sold heavily in Canada."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked glass on the flat display, less exposed than the Edge but still a bonded assembly",
    "Battery degraded after nearly a decade",
    "Micro USB port worn out",
    "Camera glass cracked, this model's rear lens sitting nearly flush",
    "Loudspeaker distorted"
  ],
  "verdict": [
    {
      "_key": "model.galaxy-s7-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-s7-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "No, at $249.99. The Galaxy S7 stopped at Android 8 and the screen repair now costs several times what the phone is worth. If the fault is a battery or a charging port rather than the screen, that is a different conversation and often worth doing. A screen at this price is not."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.galaxy-s7-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-s7-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The flat panel on the standard S7 is meaningfully more robust than the S7 Edge's curved glass, and its replacement part is fifty dollars cheaper. The rear camera cover on this model sits almost flush with the body, so it cracks far less often than on phones with a raised camera bump."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "lastSupportedOs": "Android 8",
  "stillReceivesUpdates": false
} as ModelContent;

export default content;
