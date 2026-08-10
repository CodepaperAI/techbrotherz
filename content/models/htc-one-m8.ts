/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "htc-one-m8",
  "name": "HTC One M8",
  "intro": [
    {
      "_key": "model.htc-one-m8-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.htc-one-m8-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The HTC One M8 is the one with two rear cameras used for depth rather than zoom, years before that became standard, and with front-facing BoomSound speakers that were the best on any phone of its year. Its curved aluminium back makes it the most comfortable phone of the three HTC models we repair."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked glass on the 5 inch display",
    "Depth-sensing second camera failing, a feature unique to this model among the HTCs we handle",
    "Front BoomSound speakers distorting",
    "Battery sealed and degraded",
    "Micro USB port worn"
  ],
  "verdict": [
    {
      "_key": "model.htc-one-m8-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.htc-one-m8-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "No, other than affection. The HTC One M8 stopped at Android 6 and receives no updates. Its screen exceeds the phone's value. It remains one of the better-built phones of its era, and people are fond of them, but that is not a reason we would encourage the spend."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.htc-one-m8-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.htc-one-m8-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The M8's second rear camera captures depth rather than an image, so it fails in ways that are not obvious: photos still take, but background blur stops working. That is a different diagnosis from a dead main camera and worth mentioning when you bring the phone in."
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
