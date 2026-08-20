/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "iphone-6-plus",
  "name": "Iphone 6 Plus",
  "intro": [
    {
      "_key": "model.iphone-6-plus-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-6-plus-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Iphone 6 Plus is the model that gave Apple its bending problem. Its 6000 series aluminium frame was thin enough that pocket pressure could deform it near the volume buttons, and a bent frame is still the first thing TechBrotherz checks on one of these. It stopped at iOS 12, which makes it the oldest Iphone on our list that is still occasionally worth putting a part into."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Bent frame near the volume buttons, the fault this specific model became known for",
    "Touch disease, a display fault caused by the logic board flexing in a bent frame",
    "Cracked front glass on the 5.5 inch display",
    "Battery long past its useful life",
    "Home button worn out"
  ],
  "verdict": [
    {
      "_key": "model.iphone-6-plus-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-6-plus-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Almost never worth repairing now. The Iphone 6 Plus stopped receiving updates at iOS 12, which means no security patches and a shrinking set of apps that will still install. We will fit a screen if you have a specific reason to keep the phone alive, but for general use the honest answer is that this handset has reached the end and the money is better spent elsewhere."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.iphone-6-plus-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-6-plus-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "A bent Iphone 6 Plus frame is not cosmetic. Flexing puts stress on the touch controller chips on the logic board, producing the intermittent grey bar and unresponsive touch known as touch disease. TechBrotherz checks the frame before quoting a screen, because fitting a new screen to a bent 6 Plus wastes the part."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "lastSupportedOs": "iOS 12",
  "stillReceivesUpdates": false
} as ModelContent;

export default content;
