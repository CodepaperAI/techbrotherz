/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "nexus-5",
  "name": "Nexus 5",
  "intro": [
    {
      "_key": "model.nexus-5-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.nexus-5-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Nexus 5 is the one people remember, made by LG for Google in 2013 with a soft-touch plastic back and a price that undercut every flagship of its year. It shipped with stock Android and no carrier software at all, which is why it still has a following among people who dislike manufacturer skins."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked glass on the 5 inch display",
    "Soft-touch rear coating wearing shiny at the corners, characteristic of this model",
    "Battery degraded, sealed on this model",
    "Micro USB port worn",
    "Loudspeaker quiet, the bottom grille packing with lint easily"
  ],
  "verdict": [
    {
      "_key": "model.nexus-5-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.nexus-5-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Only for the people who want stock Android. The Nexus 5 stopped at Android 6 and receives no security updates. At $100 the screen is among the cheapest we fit, and there is a small group who keep these deliberately. For general use, it is well past its useful life."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.nexus-5-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.nexus-5-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The Nexus 5 uses micro USB and a sealed battery, unlike the Nexus 5X that followed it with USB-C. Its soft-touch back wears smooth with handling rather than cracking, so a scuffed Nexus 5 is cosmetic rather than structural."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "lastSupportedOs": "Android 6",
  "stillReceivesUpdates": false
} as ModelContent;

export default content;
