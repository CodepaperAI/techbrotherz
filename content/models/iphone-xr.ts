/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "iphone-xr",
  "name": "iPhone XR",
  "intro": [
    {
      "_key": "model.iphone-xr-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-xr-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The iPhone XR is the cheapest Face ID iPhone to repair, because it uses an LCD panel while the XS and X of the same era use OLED. That keeps a cracked XR screen well below what a comparable XS costs. The XR is now old enough that a worn battery is often the real complaint rather than the screen. TechBrotherz will check both at 3317 17 Ave SE in Calgary before quoting you for either."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked front glass on the LCD panel, the cheapest Face ID iPhone screen we replace",
    "Battery health well below 80 percent",
    "Charging port worn after years of use",
    "Face ID failing after a repair done elsewhere",
    "Rear single camera lens cover cracked"
  ],
  "verdict": [
    {
      "_key": "model.iphone-xr-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.iphone-xr-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Yes for a cheap repair, with one caveat. The iPhone XR has reached the end of new iOS versions, so it will slowly lose app support over the next few years. Its LCD screen is the cheapest of any Face ID iPhone, which makes a screen or battery repair on a working XR a sound short-term spend rather than a long-term one."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": null,
  "lastSupportedOs": null,
  "stillReceivesUpdates": null
} as ModelContent;

export default content;
