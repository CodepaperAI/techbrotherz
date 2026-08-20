/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "iphone-11-pro",
  "name": "Iphone 11 Pro",
  "intro": [
    {
      "_key": "model.iphone-11-pro-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-11-pro-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Iphone 11 Pro is smaller than the standard Iphone 11 but costs more to repair, because the Pro uses an OLED panel where the 11 uses LCD. People are often surprised by that, so we say it up front. A 11 Pro this age frequently needs a battery as much as a screen. TechBrotherz will test the battery health with you at 3317 17 Ave SE in Calgary before you commit to anything."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked front glass on the OLED panel, dearer to replace than the standard Iphone 11's LCD",
    "Battery health well below 80 percent on a phone of this age",
    "Charging port worn",
    "One of the three rear cameras failing while the others work",
    "Stainless frame scuffed at the corners"
  ],
  "verdict": [
    {
      "_key": "model.iphone-11-pro-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-11-pro-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Yes, but expect to spend more than an Iphone 11 owner. The 11 Pro still receives iOS updates, so the phone has life left. Its OLED screen costs more to replace than the larger standard Iphone 11, which surprises people. If the battery is also tired, price both together before deciding."
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
