/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "Iphone-7-plus",
  "name": "Iphone 7 Plus",
  "intro": [
    {
      "_key": "model.Iphone-7-plus-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.Iphone-7-plus-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Iphone 7 Plus was the first Iphone with two rear cameras, and the first with no headphone socket. It kept the aluminium back of the Iphone 6 generation rather than the glass of the 8, so it cannot charge wirelessly and rear damage is a dent rather than a shatter. It is one of the older models TechBrotherz still stocks screens for."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked front glass on the 5.5 inch LCD",
    "Bent or dented aluminium frame after a drop, which stops a new screen sitting flat",
    "Home button unresponsive, this generation's button is a pressure sensor rather than a physical switch",
    "Rear camera lens cover cracked, affecting one of the two cameras",
    "Battery no longer lasting a working day"
  ],
  "verdict": [
    {
      "_key": "model.Iphone-7-plus-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.Iphone-7-plus-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Marginal, and we will say so at the Store. The Iphone 7 Plus stopped at iOS 15, which is now two major versions behind, and banking and messaging apps are beginning to drop it. A screen makes sense if the phone is otherwise healthy and you need it for a specific job. If the battery is also tired, replacing the handset is usually the better spend."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.Iphone-7-plus-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.Iphone-7-plus-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The Iphone 7 generation replaced the physical home button with a pressure-sensitive pad driven by the Taptic Engine, so a home button that has stopped clicking may be a Taptic Engine fault rather than the button itself. The aluminium back also means we check the frame for bend before fitting a screen, because a bent 7 Plus frame will crack a new screen within weeks."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "lastSupportedOs": "iOS 15",
  "stillReceivesUpdates": false
} as ModelContent;

export default content;
