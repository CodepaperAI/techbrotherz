/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "ipad-air-4",
  "name": "iPad Air 4",
  "intro": [
    {
      "_key": "model.ipad-air-4-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.ipad-air-4-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The iPad Air 4 was the redesign: flat edges, no home button, and the first Apple device anywhere to move Touch ID into the power button. It runs an A14 chip, the same generation as the iPhone 12, which was quick in 2020 and is merely adequate now. That ageing processor, rather than anything about the screen, is what usually decides whether an Air 4 is worth putting money into."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Power button failing, which on this generation takes Touch ID down with it",
    "Front glass shattered across the flat-edge corners, where the 2020 redesign concentrates impact",
    "A14 processor struggling with newer apps, the main reason owners retire this model",
    "Charging socket loosened by repeated cable pulls",
    "Rear camera bump glass chipped"
  ],
  "verdict": [
    {
      "_key": "model.ipad-air-4-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.ipad-air-4-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Yes, but check the price against what an Air 4 now fetches secondhand. Its A14 processor has aged, values have dropped further than the Air 5, and the display repair is the same cost as its newer sibling. If the tablet is doing a light job well, fix it. If it already feels slow, spending on glass will not fix that."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": null,
  "lastSupportedOs": null,
  "stillReceivesUpdates": true
} as ModelContent;

export default content;
