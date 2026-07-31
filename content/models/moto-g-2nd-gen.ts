/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "moto-g-2nd-gen",
  "name": "Moto G (2nd gen)",
  "intro": [
    {
      "_key": "model.moto-g-2nd-gen-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.moto-g-2nd-gen-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The second-generation Moto G grew to a 5 inch screen and added front-facing stereo speakers and a microSD slot, both of which the first generation lacked. Those speakers are the thing owners mention, because they were unusually good for a budget phone and remain so."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked glass on the 5 inch display",
    "Front stereo speakers distorting, a feature this generation added",
    "Battery worn, sealed on this model",
    "Micro USB port worn",
    "microSD card slot failing, added on this generation"
  ],
  "verdict": [
    {
      "_key": "model.moto-g-2nd-gen-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.moto-g-2nd-gen-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "No. The second-generation Moto G stopped at Android 6 and a $110 screen exceeds what the handset is worth by a wide margin. TechBrotherz will repair one if you have a reason, but for ordinary use this is a phone to retire rather than to fix."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.moto-g-2nd-gen-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.moto-g-2nd-gen-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The second generation added front-facing stereo speakers and a memory card slot that the first-generation Moto G did not have, so speaker and storage faults on this model are repairs that simply do not exist on its predecessor despite the shared screen price."
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
