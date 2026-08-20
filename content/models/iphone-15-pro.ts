/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "Iphone-15-pro",
  "name": "Iphone 15 Pro",
  "intro": [
    {
      "_key": "model.Iphone-15-pro-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.Iphone-15-pro-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Iphone 15 Pro moved to a titanium frame, swapped Lightning for USB-C, and replaced the mute switch with the programmable Action button. Each of those is a separate part in a repair, and the Action button sits on its own flex assembly rather than sharing one with the volume keys. TechBrotherz repairs the 15 Pro at 3317 17 Ave SE in Calgary. Call (403) 273-8324 for a firm price."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked front glass on the ProMotion panel",
    "Action button unresponsive, a control unique to the 15 Pro and later",
    "USB-C port loose",
    "Titanium frame scuffed at the edges",
    "Rear camera lens cover cracked"
  ],
  "verdict": [
    {
      "_key": "model.Iphone-15-pro-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.Iphone-15-pro-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Yes, clearly. The Iphone 15 Pro is current enough that any repair is far cheaper than replacement, and it still receives iOS updates with years to run. Its titanium frame also resists bending better than the stainless of earlier Pro models, so drops more often break glass alone, which is the cheaper outcome."
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
