/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "pixel-6",
  "name": "Pixel 6",
  "intro": [
    {
      "_key": "model.pixel-6-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.pixel-6-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Pixel 6 was Google's first phone with its own Tensor chip and an under-display fingerprint sensor, and that sensor is matched to the original screen, so it needs recalibrating after a replacement or it stops recognising a finger. The rear camera bar glass on the Pixel 6 also cracks readily in a drop. TechBrotherz orders Pixel parts in, so call (403) 273-8324 for a price and a lead time."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked front glass on the OLED panel",
    "Under-display fingerprint sensor failing after a screen repair done without recalibration",
    "Rear camera bar glass cracked, a large and exposed strip unique to this Pixel generation",
    "Battery capacity declining",
    "Modem dropping signal, a documented complaint on this specific generation"
  ],
  "verdict": [
    {
      "_key": "model.pixel-6-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.pixel-6-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Marginal. The Pixel 6 has reached the end of its Android version upgrades though it continues to receive security patches for a period. Its camera bar glass is unusually exposed and cracks readily. A screen repair is worth doing only if you are attached to the phone, because parts are ordered in and the handset's value has fallen."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": null,
  "lastSupportedOs": null,
  "stillReceivesUpdates": false
} as ModelContent;

export default content;
