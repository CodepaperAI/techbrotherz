/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "ipad-air",
  "name": "iPad Air",
  "intro": [
    {
      "_key": "model.ipad-air-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.ipad-air-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The first iPad Air was Apple's big weight reduction, dropping nearly a third of the previous full-size iPad. It was also the first full-size iPad with a laminated-feeling thin build while keeping the glass as a layer separate from the display panel, which is why a cracked front on an Air 1 is a glass repair rather than a whole screen."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked front glass with the picture underneath still perfect, the repair this model is most often brought in for",
    "Touch failing along a crack line",
    "Battery no longer lasting a full day, this model being more than a decade old",
    "Lightning port loose after years of use",
    "Home button worn out"
  ],
  "verdict": [
    {
      "_key": "model.ipad-air-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.ipad-air-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Worth it for a light-duty tablet, not for a main device. The first iPad Air stopped at iPadOS 12, so many current apps will not install. A glass repair on a tablet used for video, recipes or as a second screen is easy to justify. If you need current apps, the repair does not solve the real problem."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.ipad-air-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.ipad-air-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "On the first-generation iPad Air the touch glass is a separate layer above the display panel, so a cracked front can be repaired by replacing the glass alone. From the iPad Air 2 onward Apple laminated the two together, which roughly doubles the cost of the same accident. That single design change is the biggest price difference across the iPad range."
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
