/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "galaxy-s20",
  "name": "Galaxy S20",
  "intro": [
    {
      "_key": "model.galaxy-s20-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-s20-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Galaxy S20 was Samsung's first S-series phone with a 120Hz display, and its curved edges mean a drop on the corner usually cracks glass along the curve where the panel is thinnest. That curve is also why the replacement part is the screen bonded to the frame rather than a flat panel. TechBrotherz replaces it at 3317 17 Ave SE in Calgary. Phone ahead to check the part is in stock."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked glass along the curved edge of the display",
    "Green tint on the OLED at low brightness, a documented characteristic of some S20 panels",
    "In-display fingerprint reader unreliable",
    "Battery capacity declining",
    "Cracked rear glass"
  ],
  "verdict": [
    {
      "_key": "model.galaxy-s20-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-s20-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Marginal. The Galaxy S20 has reached the end of its Android upgrades, and its curved display is both the most fragile part of the phone and the most expensive to replace. A battery or a charging port on a working S20 is reasonable. A screen is a decision to weigh against what the handset now fetches."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": null,
  "lastSupportedOs": null,
  "stillReceivesUpdates": false
} as ModelContent;

export default content;
