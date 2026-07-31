/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "ipad-mini-2",
  "name": "iPad Mini 2",
  "intro": [
    {
      "_key": "model.ipad-mini-2-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.ipad-mini-2-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The iPad Mini 2 brought the Retina display to Apple's small tablet and is the model that made the Mini genuinely usable for reading. It has no Touch ID, which is what keeps its glass repair at $79.99 while the otherwise similar Mini 3 costs $129.99. It stayed on sale for years and remains common as a hand-me-down."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked front glass on the 7.9 inch Retina display",
    "Battery no longer holding a useful charge",
    "Home button worn out, a plain switch on this model with no fingerprint sensor",
    "Lightning port loose or slow to charge",
    "Touch registering phantom taps"
  ],
  "verdict": [
    {
      "_key": "model.ipad-mini-2-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.ipad-mini-2-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Worth it as a reading and video tablet. The iPad Mini 2 stopped at iPadOS 12, so treat it as a device for books, video and browsing rather than current apps. At $79.99 the glass repair is cheap enough that keeping a working Mini alive for that purpose is sensible, particularly given how few small tablets exist."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.ipad-mini-2-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.ipad-mini-2-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The absence of Touch ID is the reason this model is fifty dollars cheaper to repair than the Mini 3 that replaced it. Nothing needs transferring from the broken glass, so the job is quicker and the part is simpler."
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
