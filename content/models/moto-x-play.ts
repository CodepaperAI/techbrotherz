/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "moto-x-play",
  "name": "Moto X Play",
  "intro": [
    {
      "_key": "model.moto-x-play-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.moto-x-play-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Moto X Play was built around battery life rather than speed, with a 3630 mAh cell that routinely lasted two days when the phone was new. That is still the reason people keep them. It has a water-repellent nano-coating inside rather than a sealed body, so it survives splashes but not immersion."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked glass on the 5.5 inch display",
    "Battery finally degraded, though this model started with an unusually large cell",
    "Micro USB port worn out",
    "Textured rear cover loose at the clips",
    "Camera glass scratched"
  ],
  "verdict": [
    {
      "_key": "model.moto-x-play-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.moto-x-play-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Only for the battery life. The Moto X Play stopped at Android 7. Its screen is inexpensive, and this specific model's battery endurance is genuinely better than its peers, so people keep them as work or site phones. For anything needing current apps, it is finished."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.moto-x-play-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.moto-x-play-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The Moto X Play uses an internal water-repellent coating rather than gaskets, so it tolerates rain but not submersion, and a repair does not change that either way. Its large battery means a X Play often still holds a usable charge when contemporaries do not."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "lastSupportedOs": "Android 7",
  "stillReceivesUpdates": false
} as ModelContent;

export default content;
