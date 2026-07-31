/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "ipad-3",
  "name": "iPad 3",
  "intro": [
    {
      "_key": "model.ipad-3-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.ipad-3-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The iPad 3 was the first full-size iPad with a Retina display, and fitting that panel made it thicker and heavier than the iPad 2 it replaced. It ran hot and charged slowly, and Apple replaced it after only seven months, which makes it the shortest-lived iPad ever sold. It shares a glass price with the iPad 2 and 4."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked front glass over the Retina panel",
    "Battery worn out, this model having the largest and hardest-working cell of the three that share its price",
    "30-pin dock connector no longer charging reliably",
    "Running warm during charging, characteristic of this specific generation",
    "Home button worn out"
  ],
  "verdict": [
    {
      "_key": "model.ipad-3-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.ipad-3-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "No, other than as a child's tablet. The iPad 3 stopped at iPadOS 9, and its short production life means it was already behind when it was new. A $69.99 glass repair keeps a video-watching tablet alive for a child, which is a fair reason. For anything requiring a current app, it is finished."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.ipad-3-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.ipad-3-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The iPad 3 is heavier and thicker than both the iPad 2 before it and the iPad 4 after it, because of the larger battery needed to drive its Retina panel. Its glass and digitizer are a separate layer from the display, so a cracked front is a $69.99 glass repair rather than a full screen."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "lastSupportedOs": "iPadOS 9",
  "stillReceivesUpdates": false
} as ModelContent;

export default content;
