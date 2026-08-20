/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "iphone-14",
  "name": "Iphone 14",
  "intro": [
    {
      "_key": "model.iphone-14-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-14-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Iphone 14 was rebuilt internally so the rear glass comes off on its own rather than requiring the whole phone to be stripped. That single change makes back glass replacement on a 14 far less involved than on a 12 or 13, and the price reflects it. Cracked front glass is still the repair we see most on this model. TechBrotherz is a walk-in store at 3317 17 Ave SE in Calgary, no appointment needed."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked front glass on the OLED panel",
    "Cracked rear glass, which is far less involved to replace on this model than on the 12 or 13",
    "Battery health beginning to decline",
    "Charging port worn from Lightning cables, this being the last Lightning generation",
    "Rear camera lens cover cracked"
  ],
  "verdict": [
    {
      "_key": "model.iphone-14-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-14-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Yes. The Iphone 14 still receives iOS updates and is recent enough that a repair clearly beats replacement. Its redesigned internals also mean rear glass damage costs far less to put right than on the two generations before it, so a phone broken on both sides is still worth quoting."
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
