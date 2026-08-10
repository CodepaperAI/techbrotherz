/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "htc-one-m7",
  "name": "HTC One M7",
  "intro": [
    {
      "_key": "model.htc-one-m7-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.htc-one-m7-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The HTC One M7 was the phone that introduced the aluminium unibody to Android, and its UltraPixel camera used fewer, larger pixels to gather more light rather than chasing a megapixel count. It is the cheapest of the three HTC screens we fit, and the oldest."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked glass on the 4.7 inch display",
    "UltraPixel camera producing purple-tinted photos, a documented fault specific to this model",
    "Battery sealed and degraded",
    "Micro USB port worn",
    "Aluminium unibody dented"
  ],
  "verdict": [
    {
      "_key": "model.htc-one-m7-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.htc-one-m7-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "No. The HTC One M7 stopped at Android 5, more than a decade ago. Even as the cheapest HTC screen we fit, it costs far more than the handset is worth, and the camera fault this model is known for is a separate expense again. This is a phone to keep as a curiosity rather than repair."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.htc-one-m7-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.htc-one-m7-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The M7's UltraPixel camera developed a well-known purple tint fault caused by the sensor's infrared filter degrading. It is a camera module replacement rather than a software fix, and it is a fault essentially unique to this model."
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
