/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "htc-one-m9",
  "name": "HTC One M9",
  "intro": [
    {
      "_key": "model.htc-one-m9-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.htc-one-m9-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The HTC One M9 kept the aluminium unibody of the M8 but replaced the depth-sensing dual camera with a single 20 megapixel sensor, a change most reviewers considered a step backwards. It ran hot enough that HTC issued a software update to manage it. Its screen replacement is the dearest of the three HTC models we fit."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Running hot under load, a documented characteristic of this specific model's processor",
    "Cracked glass on the 5 inch display",
    "Battery sealed and degraded",
    "Micro USB port worn",
    "Aluminium unibody dented at the corners"
  ],
  "verdict": [
    {
      "_key": "model.htc-one-m9-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.htc-one-m9-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "No. The HTC One M9 stopped at Android 7 and HTC has effectively left the mainstream phone market. Its screen costs more than the handset is worth, and this particular model was not well regarded even when new. We would advise against the spend."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.htc-one-m9-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.htc-one-m9-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The M9's aluminium unibody means the screen is bonded into the body and replaced as an assembly, and a dented frame will stop a new screen seating flat. HTC's thermal update for this model changed how the processor throttles, so an M9 that runs hot is behaving as designed rather than failing."
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
