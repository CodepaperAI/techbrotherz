/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "galaxy-s4",
  "name": "Galaxy S4",
  "intro": [
    {
      "_key": "model.galaxy-s4-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-s4-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Galaxy S4 is the only phone TechBrotherz repairs where the glass and the display panel are still quoted separately. That is because its layers are not bonded the way every later Galaxy is, so a cracked front with a working picture can be fixed for a fraction of a full screen."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked front glass with the picture underneath still perfect, repairable on its own",
    "Failed display panel showing lines or black patches, a different and dearer repair",
    "Micro USB charging port worn, quoted separately from the display",
    "Battery worn out, removable on this model",
    "Plastic back cover cracked at the clips"
  ],
  "verdict": [
    {
      "_key": "model.galaxy-s4-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-s4-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Only the glass, and only if the picture is intact. The Galaxy S4 stopped at Android 5, more than a decade ago. A glass-only repair on a phone kept for a specific purpose is the one defensible spend here. A full panel replacement on a handset this old is not."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.galaxy-s4-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-s4-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The Galaxy S4 is the last model we handle where glass-only replacement is practical on a phone, using LOCA adhesive to bond a new front to the working panel underneath. Every Samsung after it laminates the two together. That is why the S4 has two separate screen prices where every other Galaxy has one."
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
