/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "ipad-mini-3",
  "name": "iPad Mini 3",
  "intro": [
    {
      "_key": "model.ipad-mini-3-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.ipad-mini-3-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The iPad Mini 3 added Touch ID and a gold colour option to the Mini 2 and changed almost nothing else, which made it the least-loved Mini Apple released. Its glass replacement costs noticeably more than the Mini 1 and 2, because the Touch ID sensor has to be transferred rather than simply refitted."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked front glass on the 7.9 inch display",
    "Touch ID failing, the one feature that separates this model from the Mini 2",
    "Battery no longer lasting a day",
    "Lightning port loose",
    "Touch unresponsive along a crack"
  ],
  "verdict": [
    {
      "_key": "model.ipad-mini-3-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.ipad-mini-3-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Marginal, and the gap to a newer Mini matters. The iPad Mini 3 stopped at iPadOS 12, and its glass repair lands close to what a used Mini 4 costs on the second-hand market. If Touch ID has already failed, we would generally suggest putting the money toward a newer Mini instead of repairing this one."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.ipad-mini-3-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.ipad-mini-3-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The Touch ID sensor is why a Mini 3 glass repair costs more than the near-identical Mini 2. The sensor is paired to the tablet, so it must be carefully transferred from the broken glass to the new one, and if it was already damaged in the original accident Touch ID cannot be restored."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "lastSupportedOs": "iPadOS 12",
  "stillReceivesUpdates": false
} as ModelContent;

export default content;
