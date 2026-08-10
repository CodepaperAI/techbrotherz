/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "galaxy-note-10-plus",
  "name": "Galaxy Note 10 Plus",
  "intro": [
    {
      "_key": "model.galaxy-note-10-plus-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-note-10-plus-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Galaxy Note 10 Plus has the largest and most demanding screen of any handset TechBrotherz fits, because it combines a 6.8 inch curved OLED with the extra digitizer layer the S Pen needs. It was also the Note that dropped the headphone socket, which remains a sore point for owners."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked curved glass on the 6.8 inch display, the largest panel we replace",
    "S Pen no longer registering pressure, a fault of the digitizer layer rather than the glass",
    "Battery degraded after several years",
    "Cracked rear glass",
    "USB-C port worn from fast charging"
  ],
  "verdict": [
    {
      "_key": "model.galaxy-note-10-plus-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-note-10-plus-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Almost never worth it. The Note 10 Plus stopped at Android 12, so it receives no further updates, and its screen is the dearest repair on the board by a clear margin. If the S Pen has failed but the screen is intact, come in anyway, because that is sometimes a smaller and separate conversation."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.galaxy-note-10-plus-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-note-10-plus-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "A Note screen carries a second digitizer layer behind the display for the S Pen, so a replacement has to restore pen pressure as well as finger touch. That extra layer, combined with the size and the curve, is why this is the dearest screen on our list."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "lastSupportedOs": "Android 12",
  "stillReceivesUpdates": false
} as ModelContent;

export default content;
