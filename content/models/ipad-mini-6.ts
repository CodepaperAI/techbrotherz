/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "Ipad-mini-6",
  "name": "Ipad Mini 6",
  "intro": [
    {
      "_key": "model.Ipad-mini-6-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.Ipad-mini-6-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Ipad Mini 6 has a laminated display and puts Touch ID in the power button, so a failed button takes the fingerprint reader with it. Worth knowing before you bring one in: the slight uneven scrolling people call jelly scroll is normal behaviour on this model and not a fault we can repair. TechBrotherz replaces cracked Mini 6 screens at 3317 17 Ave SE in Calgary."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked laminated display, a change from the separate glass of the Mini 2 and 3",
    "Touch ID in the power button failing",
    "USB-C port loose",
    "Uneven scrolling that owners call jelly scroll, which is normal behaviour on this model and not repairable",
    "Battery declining"
  ],
  "verdict": [
    {
      "_key": "model.Ipad-mini-6-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.Ipad-mini-6-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Yes, with one thing to rule out first. The Ipad Mini 6 still receives IpadOS updates and has no real small-tablet competition. If your complaint is the slightly uneven scrolling known as jelly scroll, that is how this model behaves and no repair changes it. Cracked glass, on the other hand, is well worth fixing."
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
