/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "nexus-4",
  "name": "Nexus 4",
  "intro": [
    {
      "_key": "model.nexus-4-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.nexus-4-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Nexus 4 has a patterned glass back that catches the light, and it was one of the first phones to support wireless charging out of the box. That glass back is also its defining weakness: it breaks as readily as the front, and it makes the phone slippery enough that many did."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked rear glass, unusually fragile on this model and a common reason it is brought in",
    "Cracked glass on the 4.7 inch front display",
    "Battery degraded after more than a decade",
    "Micro USB port worn",
    "Phone slipping off surfaces, a genuine complaint about this model's glass back"
  ],
  "verdict": [
    {
      "_key": "model.nexus-4-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.nexus-4-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "No. The Nexus 4 stopped at Android 5 and is around thirteen years old. The screen is cheap in isolation, but a phone this old with glass on both sides will simply break again. TechBrotherz will fit one on request and will be honest that it is not a sensible spend."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.nexus-4-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.nexus-4-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The Nexus 4 is glass on both sides at a time when almost no phone was, so it arrives broken on the back at least as often as on the front. Its wireless charging works through that rear glass, so cracked rear glass can also stop the phone charging on a pad."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "lastSupportedOs": "Android 5",
  "stillReceivesUpdates": false
} as ModelContent;

export default content;
