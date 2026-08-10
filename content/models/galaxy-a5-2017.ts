/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "galaxy-a5-2017",
  "name": "Galaxy A5 (2017)",
  "intro": [
    {
      "_key": "model.galaxy-a5-2017-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-a5-2017-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Galaxy A5 from 2017 was Samsung's mid-range phone that borrowed the flagship's glass sandwich body and water resistance, at roughly half the price. Its screen is expensive to replace for a mid-range handset, because Samsung used the same bonded OLED construction as its flagships."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked front glass on the bonded OLED",
    "Cracked rear glass, unusual on a mid-range phone of this era",
    "Battery degraded, and a replacement is one of the smaller repairs on this handset",
    "USB-C port worn, this being an early mid-range Samsung to adopt it",
    "Home button with fingerprint reader failing"
  ],
  "verdict": [
    {
      "_key": "model.galaxy-a5-2017-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-a5-2017-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "No for the screen, yes for the battery. The A5 stopped at Android 8, so it receives no security updates. A screen on a mid-range handset of this age costs far more than the phone justifies now. A battery or a back glass on a phone still doing a job is a reasonable spend, and we will tell you which category yours falls into."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.galaxy-a5-2017-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-a5-2017-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The 2017 A5 uses flagship-style bonded OLED construction rather than the cheaper separate-layer panels found in most mid-range phones of its year, which is why its screen price sits closer to a Galaxy S than to a budget handset."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "lastSupportedOs": "Android 8",
  "stillReceivesUpdates": false
} as ModelContent;

export default content;
